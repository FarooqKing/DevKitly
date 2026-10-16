import {
  Braces, FileText, Paintbrush, Binary, Link, Code, KeyRound, Fingerprint, Hash, Lock, QrCode, Type,
  GitCompare, Regex, AlignLeft, CaseSensitive, Clock, Palette, Image, Images, Wrench, type LucideProps,
} from "lucide-react";

const icons = { Braces, FileText, Paintbrush, Binary, Link, Code, KeyRound, Fingerprint, Hash, Lock, QrCode, Type, GitCompare, Regex, AlignLeft, CaseSensitive, Clock, Palette, Image, Images };

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = (icons as Record<string, React.ComponentType<LucideProps>>)[name] ?? Wrench;
  return <C {...props} />;
}
