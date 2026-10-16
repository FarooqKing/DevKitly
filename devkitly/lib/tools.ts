export type Category = "Formatters" | "Encoders" | "Generators" | "Text" | "Converters";

export interface ToolMeta {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: Category;
  icon: string;          // lucide icon name (components/Icon.tsx)
  keywords: string[];
  popular?: boolean;
  about: string[];
}

export const categories: { name: Category; blurb: string }[] = [
  { name: "Formatters", blurb: "Beautify, minify and preview code" },
  { name: "Encoders", blurb: "Encode, decode and inspect tokens" },
  { name: "Generators", blurb: "Random IDs, hashes, passwords and QR codes" },
  { name: "Text", blurb: "Compare, count, match and transform text" },
  { name: "Converters", blurb: "Switch between formats and units" },
];

export const tools: ToolMeta[] = [
  // Formatters
  { slug: "json-formatter", name: "JSON Formatter", short: "Beautify, minify and validate JSON", category: "Formatters", icon: "Braces", popular: true,
    description: "Free online JSON formatter and validator. Beautify or minify JSON instantly with precise error messages. Runs in your browser.",
    keywords: ["json formatter", "json beautifier", "json validator", "json minifier"],
    about: ["Paste JSON on the left and the formatted result appears on the right as you type. Choose 2-space, 4-space or tab indentation, or switch to Minify for the smallest output. Invalid JSON shows the exact parser error so you can find the missing comma or bracket quickly.", "Your data never leaves the browser, which makes this safe for API responses, config files and anything containing credentials."] },
  { slug: "markdown-preview", name: "Markdown Preview", short: "Write Markdown and see rendered HTML live", category: "Formatters", icon: "FileText",
    description: "Live Markdown editor and previewer. Write Markdown on the left and see the rendered output instantly. Copy the generated HTML.",
    keywords: ["markdown preview", "markdown editor online", "markdown to html"],
    about: ["Type or paste Markdown and the preview updates on every keystroke. Headings, lists, tables, links, code blocks and images are all supported.", "Use the HTML tab to copy the generated markup for a blog, README or CMS."] },
  { slug: "css-minifier", name: "CSS Minifier", short: "Remove whitespace and comments from CSS", category: "Formatters", icon: "Paintbrush",
    description: "Minify CSS online. Strip comments, whitespace and redundant characters to shrink your stylesheets before deploying.",
    keywords: ["css minifier", "minify css online", "compress css"],
    about: ["Minification removes comments, line breaks and unnecessary spaces so the stylesheet downloads faster. The size reduction is shown so you can see what you saved.", "For production builds use your bundler's minifier; this tool is ideal for quick one-off snippets and inline styles."] },

  // Encoders
  { slug: "base64", name: "Base64 Encoder / Decoder", short: "Convert text to Base64 and back", category: "Encoders", icon: "Binary", popular: true,
    description: "Encode text to Base64 or decode Base64 to text online. Full UTF-8 support, live output, nothing uploaded.",
    keywords: ["base64 encode", "base64 decode", "base64 converter online"],
    about: ["Base64 represents binary data using 64 printable characters, which is why it appears in data URLs, email attachments, JWTs and API payloads. This tool handles UTF-8 correctly so non-English text and emoji round-trip without corruption.", "Switch between Encode and Decode with one click, or swap the panes to reverse the operation."] },
  { slug: "url-encoder", name: "URL Encoder / Decoder", short: "Percent-encode strings for use in URLs", category: "Encoders", icon: "Link",
    description: "URL encode and decode text online. Convert spaces and special characters to percent-encoding and back.",
    keywords: ["url encode", "url decode online", "percent encoding"],
    about: ["URLs may only contain a limited set of characters, so spaces, ampersands and non-ASCII letters must be percent-encoded in query strings. This tool follows the same rules as encodeURIComponent.", "Decoding helps when reading logs or analytics URLs where parameters were encoded one or more times."] },
  { slug: "html-entities", name: "HTML Entity Encoder", short: "Escape and unescape HTML special characters", category: "Encoders", icon: "Code",
    description: "Encode HTML entities online. Escape <, >, & and quotes for safe HTML output, or decode entities back to text.",
    keywords: ["html encode", "html entities", "escape html online"],
    about: ["Characters like < > & and quotes have special meaning in HTML. Escaping them prevents broken markup and cross-site scripting when inserting user content into a page.", "Decode mode turns &amp;, &lt; and numeric entities back into readable text."] },
  { slug: "jwt-decoder", name: "JWT Decoder", short: "Inspect JSON Web Token header, payload and expiry", category: "Encoders", icon: "KeyRound", popular: true,
    description: "Decode JWT tokens online. View header, payload claims and expiry instantly. Your token never leaves the browser.",
    keywords: ["jwt decoder", "decode jwt", "jwt viewer online"],
    about: ["A JSON Web Token has three Base64URL parts: header, payload and signature. This tool decodes the first two and highlights standard claims such as sub, iat and exp, including whether the token has already expired.", "Signature verification requires your secret or public key and is intentionally not done here. Avoid pasting production secrets into any website."] },

  // Generators
  { slug: "uuid-generator", name: "UUID Generator", short: "Generate random UUID v4 values in bulk", category: "Generators", icon: "Fingerprint",
    description: "Generate UUID v4 online. Create one or hundreds of random, cryptographically secure UUIDs and copy them instantly.",
    keywords: ["uuid generator", "guid generator", "uuid v4 online"],
    about: ["A UUID is a 128-bit identifier written as 32 hexadecimal characters in five groups. Version 4 UUIDs are random, making collisions practically impossible.", "Values come from the browser's secure random source and are suitable for database keys, correlation IDs and test fixtures."] },
  { slug: "hash-generator", name: "Hash Generator", short: "SHA-1, SHA-256, SHA-384 and SHA-512 hashes", category: "Generators", icon: "Hash", popular: true,
    description: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text online using the browser's Web Crypto API.",
    keywords: ["sha256 generator", "hash generator online", "sha512 hash"],
    about: ["A hash maps input of any size to a fixed-length digest. The same input always gives the same hash and a one-character change produces a completely different result, which is why hashes are used for checksums and fingerprints.", "SHA-256 is the safe default today; SHA-1 is included for compatibility with older systems only."] },
  { slug: "password-generator", name: "Password Generator", short: "Strong random passwords with your own rules", category: "Generators", icon: "Lock",
    description: "Generate strong random passwords online. Choose length and character sets. Generated locally with secure randomness.",
    keywords: ["password generator", "strong password generator", "random password"],
    about: ["Length matters more than anything else: a 16-character password with mixed characters is far stronger than a short one with clever substitutions. This generator uses crypto.getRandomValues rather than Math.random.", "Nothing is stored or sent anywhere. Pair the result with a password manager."] },
  { slug: "qr-code-generator", name: "QR Code Generator", short: "Create QR codes for links and text, download as PNG", category: "Generators", icon: "QrCode", popular: true,
    description: "Free QR code generator. Turn any URL or text into a QR code and download it as a PNG, instantly in your browser.",
    keywords: ["qr code generator", "free qr code", "qr code maker"],
    about: ["Enter a URL, Wi-Fi string, phone number or any text and the QR code renders live. Adjust the size and error-correction level, then download a PNG for print or web.", "Higher error correction lets the code survive damage or a logo overlay at the cost of a denser pattern."] },
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", short: "Placeholder paragraphs, sentences or words", category: "Generators", icon: "Type",
    description: "Generate Lorem Ipsum placeholder text online. Choose paragraphs, sentences or words and copy in one click.",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text"],
    about: ["Lorem Ipsum is scrambled Latin used as filler so layouts can be judged without readable content distracting the eye.", "Pick how much you need and whether to start with the classic opening line."] },

  // Text
  { slug: "diff-checker", name: "Diff Checker", short: "Compare two texts and highlight the differences", category: "Text", icon: "GitCompare", popular: true,
    description: "Compare two texts online and see additions and deletions highlighted line by line. Fast, private, browser-based diff tool.",
    keywords: ["diff checker", "text compare online", "compare two files"],
    about: ["Paste the original on the left and the changed version on the right. Added lines are highlighted green, removed lines red, so reviewing config changes, contracts or code snippets takes seconds.", "Switch to word-level diff for prose where whole-line highlighting is too coarse."] },
  { slug: "regex-tester", name: "Regex Tester", short: "Test regular expressions with live match highlighting", category: "Text", icon: "Regex", popular: true,
    description: "Test regular expressions online with live highlighting, match list and capture groups. Supports JavaScript regex flags.",
    keywords: ["regex tester", "regex online", "regular expression tester"],
    about: ["Type a pattern and flags, then paste sample text. Matches are highlighted instantly and listed with their capture groups, so you can refine the expression until it catches exactly what you need.", "The engine is your browser's JavaScript RegExp, so what works here works in Node.js and the browser."] },
  { slug: "word-counter", name: "Word Counter", short: "Count words, characters, sentences and reading time", category: "Text", icon: "AlignLeft",
    description: "Count words, characters, sentences and paragraphs online. Shows reading time and keyword frequency.",
    keywords: ["word counter", "character counter", "count words online"],
    about: ["Paste any text to see live word, character, sentence and paragraph counts along with an estimated reading time, useful for essays, tweets, meta descriptions and blog posts.", "Top keywords show which words you repeat most."] },
  { slug: "case-converter", name: "Case Converter", short: "camelCase, snake_case, kebab-case, Title Case and more", category: "Text", icon: "CaseSensitive",
    description: "Convert text between camelCase, PascalCase, snake_case, kebab-case, UPPER, lower and Title Case online.",
    keywords: ["case converter", "camelcase to snake case", "text case converter"],
    about: ["Paste identifiers or sentences and get every common case style at once. Handy when moving names between languages and style guides.", "Each result has its own copy button."] },

  // Converters
  { slug: "timestamp-converter", name: "Unix Timestamp Converter", short: "Epoch seconds or milliseconds to date and back", category: "Converters", icon: "Clock",
    description: "Convert Unix timestamps to readable dates and dates to epoch time. Detects seconds vs milliseconds, shows UTC and local time.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date"],
    about: ["Unix time counts seconds since 1 January 1970 UTC. This converter detects whether you pasted seconds or milliseconds and shows the result in UTC, your local zone and ISO 8601.", "Pick a date and time to get the matching epoch value for queries, cron jobs or token expiry fields."] },
  { slug: "color-converter", name: "Color Converter", short: "HEX, RGB and HSL with a live preview", category: "Converters", icon: "Palette",
    description: "Convert colors between HEX, RGB and HSL online with a live swatch. Pick a color or paste any value.",
    keywords: ["color converter", "hex to rgb", "rgb to hsl"],
    about: ["Paste a HEX, RGB or HSL value or use the color picker and every other format updates instantly alongside a preview swatch.", "Useful when matching design tokens across CSS, Tailwind, Figma and mobile code."] },
  { slug: "image-converter", name: "Image Converter & Resizer", short: "Convert PNG, JPG, WebP and resize or compress images", category: "Converters", icon: "Images", popular: true,
    description: "Convert images between PNG, JPEG and WebP, resize by width or height, and compress with a quality slider. Free, fast and private: files never leave your browser.",
    keywords: ["image converter", "png to jpg", "jpg to png", "webp converter", "resize image online", "compress image"],
    about: ["Drop one or many images, pick the output format, set a maximum width or height and adjust quality. The result is shown with its new size so you can compare before downloading. Everything happens in your browser with the Canvas API; nothing is uploaded.", "Use JPEG or WebP for photos and PNG when you need transparency or crisp edges. Lowering quality to 70–80% usually cuts file size dramatically with no visible loss."] },
  { slug: "image-to-base64", name: "Image to Base64", short: "Convert an image to a Base64 data URL", category: "Converters", icon: "Image",
    description: "Convert images to Base64 data URLs online. Drop a PNG, JPG, SVG or WebP and copy the string for CSS or HTML.",
    keywords: ["image to base64", "base64 image converter", "data url generator"],
    about: ["Drop an image and get a data URL you can inline in CSS, HTML or JSON. The file is read locally and never uploaded.", "Inline images avoid an extra request but increase document size, so keep them small."] },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
