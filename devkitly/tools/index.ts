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

export const toolComponents: Record<string, ComponentType> = {
  "merge-pdf": MergePdf, "split-pdf": SplitPdf, "compress-pdf": CompressPdf, "pdf-to-jpg": PdfToImages, "jpg-to-pdf": ImagesToPdf,
  "rotate-pdf": RotatePdf, "delete-pdf-pages": DeletePages, "watermark-pdf": WatermarkPdf, "pdf-page-numbers": PageNumbers, "unlock-pdf": UnlockPdf,
  "excel-converter": SpreadsheetConverter, "excel-to-word": ExcelToWord, "word-to-excel": WordToExcel,
  "loan-calculator": LoanCalculator, "compound-interest-calculator": CompoundInterest, "bmi-calculator": BmiCalculator, "age-calculator": AgeCalculator,
  "percentage-calculator": PercentageCalculator, "date-calculator": DateCalculator, "discount-calculator": DiscountCalculator, "tip-calculator": TipCalculator,
  "gst-calculator": GstCalculator, "unit-converter": UnitConverter,
  "json-formatter": JsonFormatter, "markdown-preview": MarkdownPreview, "css-minifier": CssMinifier,
  base64: Base64, "url-encoder": UrlEncoder, "html-entities": HtmlEntities, "jwt-decoder": JwtDecoder,
  "uuid-generator": UuidGenerator, "hash-generator": HashGenerator, "password-generator": PasswordGenerator,
  "qr-code-generator": QrCodeGenerator, "lorem-ipsum": LoremIpsum,
  "diff-checker": DiffChecker, "regex-tester": RegexTester, "word-counter": WordCounter, "case-converter": CaseConverter,
  "timestamp-converter": TimestampConverter, "color-converter": ColorConverter, "image-to-base64": ImageToBase64, "image-converter": ImageConverter,
};
