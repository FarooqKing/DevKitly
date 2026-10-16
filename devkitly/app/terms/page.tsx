import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/site.config";
export const metadata: Metadata = { title: "Terms of Service", description: `Terms for using ${siteConfig.name}'s free online tools.`, alternates: { canonical: "/terms" } };
const host = siteConfig.url.replace("https://", "");

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026">
      <p>By using {siteConfig.name} ({host}) you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Use of the tools</h2>
      <p>The tools are provided free of charge for personal and commercial use. You may not use the site in a way that breaks the law, infringes others&apos; rights, or attempts to disrupt, overload or reverse-engineer the service.</p>
      <h2>Your content</h2>
      <p>Because processing happens in your browser, we never receive your files or inputs and claim no rights over them. You are responsible for ensuring you have the right to process any content you use with our tools.</p>
      <h2>No warranty</h2>
      <p>The tools are provided &quot;as is&quot; without warranties of any kind. We do our best to make results accurate, but calculators, converters and file tools can contain errors. Always verify important results (financial, legal, medical or otherwise) with a qualified professional or an authoritative source. Calculator outputs are for information only and are not financial, medical or legal advice.</p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, {siteConfig.name} and its operators are not liable for any loss or damage arising from your use of, or inability to use, the site, including loss of data or profits.</p>
      <h2>Advertising</h2>
      <p>The site may show third-party advertisements. We are not responsible for the content of ads or for third-party websites they link to.</p>
      <h2>Intellectual property</h2>
      <p>The site design, text and branding are owned by {siteConfig.name}. Underlying open-source libraries remain under their respective licences.</p>
      <h2>Changes and termination</h2>
      <p>We may modify, suspend or discontinue any tool or the whole site at any time without notice, and may update these terms. Continued use after changes means you accept the new terms.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:hello@${host}`}>hello@{host}</a>.</p>
    </LegalPage>
  );
}
