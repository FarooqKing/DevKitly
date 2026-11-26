export function ytId(input: string): string | null {
  const s = input.trim(); if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|\/shorts\/|youtu\.be\/|\/embed\/|\/v\/|\/live\/)([\w-]{11})/); return m ? m[1] : null;
}
