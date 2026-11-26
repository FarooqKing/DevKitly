import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/site.config";
export const metadata: Metadata = { title: "Privacy Policy", description: `How ${siteConfig.name} handles your data: processing happens in your browser; we never receive your files.`, alternates: { canonical: "/privacy" } };
const host = siteConfig.url.replace("https://", "");

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>{siteConfig.name} (&quot;we&quot;, &quot;us&quot;) operates {host}. This page explains what information we do and do not collect when you use the site.</p>
      <h2>Your files and inputs</h2>
      <p>All tools on {siteConfig.name} run inside your web browser. Files you drop, text you paste and numbers you enter are processed on your own device using JavaScript. <strong>They are never uploaded to, stored on or seen by our servers.</strong> When you close the tab, the data is gone.</p>
      <h2>Server-assisted tools</h2>
      <p>A few tools (Website Speed Test, Broken Link Checker, Website Screenshot, Grammar Checker) need to fetch a web page or call an analysis service, which a browser cannot do on its own. For these, the URL or text you submit is sent to our server and, where noted on the tool page, to a third-party service (Google PageSpeed Insights, LanguageTool, a screenshot service). It is processed and discarded; we do not store submitted URLs or text. These tools are clearly labelled.</p>
      <h2>Information we collect automatically</h2>
      <ul>
        <li><strong>Analytics.</strong> We may use Google Analytics or a privacy-focused alternative to understand which tools are used and how often. This records page views, approximate location (country/city), device type and browser. IP addresses are anonymised where the provider supports it.</li>
        <li><strong>Server logs.</strong> Our hosting provider keeps standard access logs (IP address, user agent, requested URL, timestamp) for security and debugging, typically for a limited period.</li>
        <li><strong>Local storage.</strong> We store your theme preference (light/dark) in your browser&apos;s local storage. Nothing else is stored.</li>
      </ul>
      <h2>Advertising and cookies</h2>
      <p>We may display advertisements served by Google AdSense or similar networks to keep the tools free. These providers may use cookies and similar technologies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising at <a href="https://www.google.com/settings/ads" rel="noreferrer" target="_blank">Google Ads Settings</a> or <a href="https://www.aboutads.info" rel="noreferrer" target="_blank">aboutads.info</a>. Third-party vendors&apos; use of cookies is governed by their own privacy policies.</p>
      <h2>Third-party services</h2>
      <p>The site is hosted on infrastructure such as Vercel. Fonts and scripts are served from our own domain; we do not load third-party scripts other than analytics and advertising described above.</p>
      <h2>Children</h2>
      <p>The site is not directed at children under 13 and we do not knowingly collect personal information from them.</p>
      <h2>Your rights</h2>
      <p>Because we do not hold your files or personal data, there is normally nothing for us to delete or export. For questions about analytics data or anything on this page, contact us at <a href={`mailto:privacy@${host}`}>privacy@{host}</a>.</p>
      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>
    </LegalPage>
  );
}
