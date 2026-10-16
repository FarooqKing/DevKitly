import type { ComponentType } from "react";
import JsonFormatter from "./JsonFormatter";
import MarkdownPreview from "./MarkdownPreview";
import CssMinifier from "./CssMinifier";
import Base64 from "./Base64";
import UrlEncoder from "./UrlEncoder";
import HtmlEntities from "./HtmlEntities";
import JwtDecoder from "./JwtDecoder";
import UuidGenerator from "./UuidGenerator";
import HashGenerator from "./HashGenerator";
import PasswordGenerator from "./PasswordGenerator";
import QrCodeGenerator from "./QrCodeGenerator";
import LoremIpsum from "./LoremIpsum";
import DiffChecker from "./DiffChecker";
import RegexTester from "./RegexTester";
import WordCounter from "./WordCounter";
import CaseConverter from "./CaseConverter";
import TimestampConverter from "./TimestampConverter";
import ColorConverter from "./ColorConverter";
import ImageToBase64 from "./ImageToBase64";
import ImageConverter from "./ImageConverter";

export const toolComponents: Record<string, ComponentType> = {
  "json-formatter": JsonFormatter, "markdown-preview": MarkdownPreview, "css-minifier": CssMinifier,
  base64: Base64, "url-encoder": UrlEncoder, "html-entities": HtmlEntities, "jwt-decoder": JwtDecoder,
  "uuid-generator": UuidGenerator, "hash-generator": HashGenerator, "password-generator": PasswordGenerator,
  "qr-code-generator": QrCodeGenerator, "lorem-ipsum": LoremIpsum,
  "diff-checker": DiffChecker, "regex-tester": RegexTester, "word-counter": WordCounter, "case-converter": CaseConverter,
  "timestamp-converter": TimestampConverter, "color-converter": ColorConverter, "image-to-base64": ImageToBase64, "image-converter": ImageConverter,
};
