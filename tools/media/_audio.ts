// Browser audio helpers: decode, trim, encode WAV / MP3
export async function decode(file: File | Blob): Promise<AudioBuffer> {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const buf = await ctx.decodeAudioData(await file.arrayBuffer()); await ctx.close(); return buf;
}
export function slice(buf: AudioBuffer, start: number, end: number): AudioBuffer {
  const ctx = new OfflineAudioContext(buf.numberOfChannels, 1, buf.sampleRate);
  const s = Math.floor(start * buf.sampleRate), e = Math.min(buf.length, Math.floor(end * buf.sampleRate));
  const out = ctx.createBuffer(buf.numberOfChannels, Math.max(1, e - s), buf.sampleRate);
  for (let c = 0; c < buf.numberOfChannels; c++) out.copyToChannel(buf.getChannelData(c).subarray(s, e), c);
  return out;
}
export function toWav(buf: AudioBuffer): Blob {
  const n = buf.numberOfChannels, len = buf.length * n * 2, out = new ArrayBuffer(44 + len), v = new DataView(out);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + len, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, n, true); v.setUint32(24, buf.sampleRate, true); v.setUint32(28, buf.sampleRate * n * 2, true); v.setUint16(32, n * 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, len, true);
  let o = 44; const ch = Array.from({ length: n }, (_, c) => buf.getChannelData(c));
  for (let i = 0; i < buf.length; i++) for (let c = 0; c < n; c++) { const s = Math.max(-1, Math.min(1, ch[c][i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
  return new Blob([out], { type: "audio/wav" });
}
export async function toMp3(buf: AudioBuffer, kbps = 128, onProgress?: (p: number) => void): Promise<Blob> {
  const lame = await import("lamejs");
  const n = Math.min(2, buf.numberOfChannels); const enc = new lame.Mp3Encoder(n, buf.sampleRate, kbps);
  const to16 = (f: Float32Array) => { const o = new Int16Array(f.length); for (let i = 0; i < f.length; i++) { const s = Math.max(-1, Math.min(1, f[i])); o[i] = s < 0 ? s * 0x8000 : s * 0x7fff; } return o; };
  const L = to16(buf.getChannelData(0)), R = n > 1 ? to16(buf.getChannelData(1)) : null; const parts: Uint8Array[] = []; const block = 1152 * 8;
  for (let i = 0; i < L.length; i += block) { const b = n > 1 ? enc.encodeBuffer(L.subarray(i, i + block), R!.subarray(i, i + block)) : enc.encodeBuffer(L.subarray(i, i + block)); if (b.length) parts.push(new Uint8Array(b)); if (i % (block * 50) === 0) { onProgress?.(i / L.length); await new Promise((r) => setTimeout(r, 0)); } }
  const end = enc.flush(); if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts as BlobPart[], { type: "audio/mpeg" });
}
export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
