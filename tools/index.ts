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
import MergePdf from "./pdf/MergePdf";
import SplitPdf from "./pdf/SplitPdf";
import CompressPdf from "./pdf/CompressPdf";
import PdfToImages from "./pdf/PdfToImages";
import ImagesToPdf from "./pdf/ImagesToPdf";
import RotatePdf from "./pdf/RotatePdf";
import DeletePages from "./pdf/DeletePages";
import WatermarkPdf from "./pdf/WatermarkPdf";
import PageNumbers from "./pdf/PageNumbers";
import UnlockPdf from "./pdf/UnlockPdf";
import SpreadsheetConverter from "./office/SpreadsheetConverter";
import ExcelToWord from "./office/ExcelToWord";
import WordToExcel from "./office/WordToExcel";
import LoanCalculator from "./calc/LoanCalculator";
import CompoundInterest from "./calc/CompoundInterest";
import BmiCalculator from "./calc/BmiCalculator";
import AgeCalculator from "./calc/AgeCalculator";
import PercentageCalculator from "./calc/PercentageCalculator";
import DateCalculator from "./calc/DateCalculator";
import DiscountCalculator from "./calc/DiscountCalculator";
import TipCalculator from "./calc/TipCalculator";
import GstCalculator from "./calc/GstCalculator";
import UnitConverter from "./calc/UnitConverter";
import TextCleaner from "./text/TextCleaner";
import DuplicateLines from "./text/DuplicateLines";
import TextReverser from "./text/TextReverser";
import SlugGenerator from "./text/SlugGenerator";
import JsonCsv from "./dev/JsonCsv";
import XmlJson from "./dev/XmlJson";
import YamlJson from "./dev/YamlJson";
import HtmlFormatter from "./dev/HtmlFormatter";
import JsMinifier from "./dev/JsMinifier";
import SqlFormatter from "./dev/SqlFormatter";
import MetaTagGenerator from "./seo/MetaTagGenerator";
import MetaTagAnalyzer from "./seo/MetaTagAnalyzer";
import OgPreviewTool from "./seo/OgPreviewTool";
import SitemapGenerator from "./seo/SitemapGenerator";
import SitemapValidator from "./seo/SitemapValidator";
import RobotsGenerator from "./seo/RobotsGenerator";
import BarcodeGenerator from "./gen/BarcodeGenerator";
import RandomNumber from "./gen/RandomNumber";
import RandomName from "./gen/RandomName";
import InvoiceGenerator from "./gen/InvoiceGenerator";
import FaviconGenerator from "./gen/FaviconGenerator";
import SpeedChecker from "./web/SpeedChecker";
import BrokenLinks from "./web/BrokenLinks";
import GrammarChecker from "./web/GrammarChecker";
import Screenshot from "./web/Screenshot";
import ResumeBuilder from "./gen/ResumeBuilder";
import KeywordDensity from "./seo/KeywordDensity";
import SchemaGenerator from "./seo/SchemaGenerator";
import UtmBuilder from "./seo/UtmBuilder";
import RedirectChecker from "./seo/RedirectChecker";
import HeaderChecker from "./seo/HeaderChecker";
import YoutubeThumbnail from "./social/YoutubeThumbnail";
import YoutubeEmbed from "./social/YoutubeEmbed";
import SocialImageResizer from "./social/SocialImageResizer";
import ThreadSplitter from "./social/ThreadSplitter";
import SocialCharCounter from "./social/SocialCharCounter";
import HashtagGenerator from "./social/HashtagGenerator";
import FancyText from "./social/FancyText";
import VideoToMp3 from "./media/VideoToMp3";
import AudioConverter from "./media/AudioConverter";
import AudioTrimmer from "./media/AudioTrimmer";
import VideoTrimmer from "./media/VideoTrimmer";
import VideoToGif from "./media/VideoToGif";
import { VoiceRecorder, ScreenRecorder } from "./media/Recorder";
import * as A from "./aliases";
import YoutubeInfo, { YoutubeTags } from "./social/yt/YoutubeInfo";
import ChannelIdFinder from "./social/yt/ChannelIdFinder";
import TimestampLinks from "./social/yt/TimestampLinks";
import EarningsCalculator from "./social/yt/EarningsCalculator";
import TitleGenerator from "./social/yt/TitleGenerator";
import CaptionFormatter from "./social/CaptionFormatter";
import CaptionGenerator from "./social/CaptionGenerator";

export const toolComponents: Record<string, ComponentType> = {
  "merge-pdf": MergePdf, "split-pdf": SplitPdf, "compress-pdf": CompressPdf, "pdf-to-jpg": PdfToImages, "jpg-to-pdf": ImagesToPdf,
  "rotate-pdf": RotatePdf, "delete-pdf-pages": DeletePages, "watermark-pdf": WatermarkPdf, "pdf-page-numbers": PageNumbers, "unlock-pdf": UnlockPdf,
  "excel-converter": SpreadsheetConverter, "excel-to-word": ExcelToWord, "word-to-excel": WordToExcel,
  "loan-calculator": LoanCalculator, "compound-interest-calculator": CompoundInterest, "bmi-calculator": BmiCalculator, "age-calculator": AgeCalculator,
  "percentage-calculator": PercentageCalculator, "date-calculator": DateCalculator, "discount-calculator": DiscountCalculator, "tip-calculator": TipCalculator,
  "gst-calculator": GstCalculator, "unit-converter": UnitConverter,
  "text-cleaner": TextCleaner, "remove-duplicate-lines": DuplicateLines, "text-reverser": TextReverser, "slug-generator": SlugGenerator,
  "json-csv-converter": JsonCsv, "xml-json-converter": XmlJson, "yaml-json-converter": YamlJson, "html-formatter": HtmlFormatter, "js-minifier": JsMinifier, "sql-formatter": SqlFormatter,
  "meta-tag-generator": MetaTagGenerator, "meta-tag-analyzer": MetaTagAnalyzer, "open-graph-preview": OgPreviewTool, "sitemap-generator": SitemapGenerator, "sitemap-validator": SitemapValidator, "robots-txt-generator": RobotsGenerator,
  "barcode-generator": BarcodeGenerator, "random-number-generator": RandomNumber, "random-name-generator": RandomName, "invoice-generator": InvoiceGenerator, "favicon-generator": FaviconGenerator,
  "website-speed-test": SpeedChecker, "broken-link-checker": BrokenLinks, "grammar-checker": GrammarChecker, "website-screenshot": Screenshot,
  "resume-builder": ResumeBuilder, "keyword-density-checker": KeywordDensity, "schema-markup-generator": SchemaGenerator, "utm-builder": UtmBuilder, "redirect-checker": RedirectChecker, "http-header-checker": HeaderChecker,
  "youtube-thumbnail-downloader": YoutubeThumbnail, "youtube-embed-generator": YoutubeEmbed, "social-media-image-resizer": SocialImageResizer, "thread-splitter": ThreadSplitter, "social-media-character-counter": SocialCharCounter, "hashtag-generator": HashtagGenerator, "fancy-text-generator": FancyText,
  "youtube-video-info": YoutubeInfo, "youtube-tag-extractor": YoutubeTags, "youtube-channel-id-finder": ChannelIdFinder, "youtube-timestamp-link": TimestampLinks, "youtube-money-calculator": EarningsCalculator, "youtube-title-generator": TitleGenerator, "instagram-caption-formatter": CaptionFormatter, "instagram-caption-generator": CaptionGenerator,
  "video-to-mp3": VideoToMp3, "audio-converter": AudioConverter, "mp3-cutter": AudioTrimmer, "video-trimmer": VideoTrimmer, "video-to-gif": VideoToGif, "voice-recorder": VoiceRecorder, "screen-recorder": ScreenRecorder,
  "json-minifier": A.JsonMinifier, "json-validator": A.JsonValidator, "character-counter": A.CharacterCounter, "sentence-counter": A.SentenceCounter, "paragraph-counter": A.ParagraphCounter, "uppercase-to-lowercase": A.UpperToLower, "lowercase-to-uppercase": A.LowerToUpper,
  "html-minifier": A.HtmlMinifier, "css-formatter": A.CssFormatter, "json-to-csv": A.JsonToCsv, "csv-to-json": A.CsvToJson, "xml-to-json": A.XmlToJson, "json-to-xml": A.JsonToXml, "yaml-to-json": A.YamlToJson, "json-to-yaml": A.JsonToYaml, "base64-decode": A.Base64Decode, "url-decode": A.UrlDecode,
  "json-formatter": JsonFormatter, "markdown-preview": MarkdownPreview, "css-minifier": CssMinifier,
  base64: Base64, "url-encoder": UrlEncoder, "html-entities": HtmlEntities, "jwt-decoder": JwtDecoder,
  "uuid-generator": UuidGenerator, "hash-generator": HashGenerator, "password-generator": PasswordGenerator,
  "qr-code-generator": QrCodeGenerator, "lorem-ipsum": LoremIpsum,
  "diff-checker": DiffChecker, "regex-tester": RegexTester, "word-counter": WordCounter, "case-converter": CaseConverter,
  "timestamp-converter": TimestampConverter, "color-converter": ColorConverter, "image-to-base64": ImageToBase64, "image-converter": ImageConverter,
};
