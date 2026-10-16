import {
  Braces, FileText, Paintbrush, Binary, Link, Code, KeyRound, Fingerprint, Hash, Lock, QrCode, Type,
  GitCompare, Regex, AlignLeft, CaseSensitive, Clock, Palette, Image, Images, Wrench, Merge, Scissors, Minimize2, FileImage, FileOutput, RotateCw, Trash2, Droplets, ListOrdered, Unlock, FileSpreadsheet, Table, Landmark, TrendingUp, HeartPulse, CalendarDays, Percent, Receipt, Coins, Ruler, Calculator, ArrowLeftRight, type LucideProps,
} from "lucide-react";

const icons = { Braces, FileText, Paintbrush, Binary, Link, Code, KeyRound, Fingerprint, Hash, Lock, QrCode, Type, GitCompare, Regex, AlignLeft, CaseSensitive, Clock, Palette, Image, Images, Merge, Scissors, Minimize2, FileImage, FileOutput, RotateCw, Trash2, Droplets, ListOrdered, Unlock, FileSpreadsheet, Table, Landmark, TrendingUp, HeartPulse, CalendarDays, Percent, Receipt, Coins, Ruler, Calculator, ArrowLeftRight };

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = (icons as Record<string, React.ComponentType<LucideProps>>)[name] ?? Wrench;
  return <C {...props} />;
}
