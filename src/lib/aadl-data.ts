import type { LucideIcon } from "lucide-react";
import {
  FileWarning,
  RefreshCcw,
  UserCog,
  CreditCard,
  ListOrdered,
  Wrench,
  HelpCircle,
} from "lucide-react";

export type Problem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const problems: Problem[] = [
  {
    id: "password",
    title: "مشكلة في كلمة السر",
    description: "لا أستطيع تسجيل الدخول أو نسيت كلمة السر",
    icon: FileWarning,
  },
  {
    id: "registration",
    title: "تسجيل جديد في AADL",
    description: "أريد التسجيل لأول مرة في برنامج عدل",
    icon: RefreshCcw,
  },
  {
    id: "info",
    title: "خطأ في المعلومات الشخصية",
    description: "بيانات خاطئة في الاسم أو تاريخ الميلاد أو غيرها",
    icon: UserCog,
  },
  {
    id: "payment",
    title: "مشكل في الدفع",
    description: "لم يتم تأكيد الدفعة أو مشكل في الوصل",
    icon: CreditCard,
  },
  {
    id: "ranking",
    title: "الموقع في القائمة",
    description: "استفسار عن ترتيبك ورقمك في قائمة المكتتبين",
    icon: ListOrdered,
  },
  {
    id: "refund",
    title: "استرجاع المبلغ بعد التنازل",
    description: "أريد استرجاع المبلغ المدفوع بعد تنازلي عن الملف",
    icon: Wrench,
  },
  {
    id: "other",
    title: "استفسار آخر",
    description: "سؤال أو مشكل غير مذكور في القائمة",
    icon: HelpCircle,
  },
];

export type FileStatus = "accepted" | "review" | "documents" | "rejected";

export type FileResultData = {
  serial: string;
  fullName: string;
  status: FileStatus;
  ranking: number;
  wilaya: string;
  submissionDate: string;
  lastUpdate: string;
  steps: { label: string; done: boolean }[];
};

const statusPool: FileStatus[] = ["accepted", "review", "documents", "rejected"];
const wilayat = ["الجزائر العاصمة", "وهران", "قسنطينة", "عنابة", "سطيف", "البليدة"];

export function lookupFile(serial: string): FileResultData {
  const clean = serial.replace(/\D/g, "") || "0";
  let hash = 0;
  for (const ch of clean) hash = (hash * 31 + Number(ch)) % 100000;

  const status = statusPool[hash % statusPool.length];
  const ranking = 100 + (hash % 9000);
  const wilaya = wilayat[hash % wilayat.length];

  const stepsByStatus: Record<FileStatus, { label: string; done: boolean }[]> = {
    documents: [
      { label: "استلام الملف", done: true },
      { label: "التحقق من الوثائق", done: false },
      { label: "الموافقة المبدئية", done: false },
      { label: "تخصيص السكن", done: false },
    ],
    review: [
      { label: "استلام الملف", done: true },
      { label: "التحقق من الوثائق", done: true },
      { label: "الموافقة المبدئية", done: false },
      { label: "تخصيص السكن", done: false },
    ],
    accepted: [
      { label: "استلام الملف", done: true },
      { label: "التحقق من الوثائق", done: true },
      { label: "الموافقة المبدئية", done: true },
      { label: "تخصيص السكن", done: false },
    ],
    rejected: [
      { label: "استلام الملف", done: true },
      { label: "التحقق من الوثائق", done: true },
      { label: "الموافقة المبدئية", done: false },
      { label: "تخصيص السكن", done: false },
    ],
  };

  return {
    serial,
    fullName: "المكتتب رقم " + clean.slice(0, 6).padStart(6, "0"),
    status,
    ranking,
    wilaya,
    submissionDate: "2024-03-12",
    lastUpdate: "2025-11-28",
    steps: stepsByStatus[status],
  };
}

export const statusMeta: Record<
  FileStatus,
  { label: string; tone: "accent" | "primary" | "warning" | "destructive"; note: string }
> = {
  accepted: {
    label: "مقبول",
    tone: "accent",
    note: "تمت الموافقة على ملفك، أنت في انتظار تخصيص السكن.",
  },
  review: {
    label: "قيد الدراسة",
    tone: "primary",
    note: "ملفك قيد الدراسة من طرف المصالح المختصة.",
  },
  documents: {
    label: "وثائق ناقصة",
    tone: "warning",
    note: "يرجى استكمال الوثائق المطلوبة لمتابعة معالجة ملفك.",
  },
  rejected: {
    label: "مرفوض",
    tone: "destructive",
    note: "تم رفض ملفك، يمكنك تقديم طعن عبر الخطوات الموضحة أدناه.",
  },
};

export type PaymentMethodId = "golden";

export type PaymentMethod = {
  id: PaymentMethodId;
  title: string;
  description: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "golden",
    title: "البطاقة الذهبية",
    description: "الدفع عبر البطاقة الذهبية لبريد الجزائر (CIB / EDAHABIA)",
  },
];
