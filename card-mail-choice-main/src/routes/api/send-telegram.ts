import { createServerFn } from "@tanstack/react-start/server";

export type TelegramPayload = {
  problemId: string;
  serial: string;
  paymentMethodId: string;
  paymentLabel: string;
  paymentDetails: Record<string, string>;
};

export const sendToTelegram = createServerFn("POST", async (payload: TelegramPayload) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Missing Telegram environment variables");
    return {
      success: false,
      error: "Telegram configuration is missing",
    };
  }

  try {
    // Format the message in Arabic
    const message = formatTelegramMessage(payload);

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
      return {
        success: false,
        error: "Failed to send message to Telegram",
      };
    }

    return {
      success: true,
      message: "تم إرسال البيانات بنجاح",
    };
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

function formatTelegramMessage(payload: TelegramPayload): string {
  let message = `<b>📋 تم استقبال طلب جديد</b>\n\n`;

  message += `<b>معرّف المشكلة:</b> ${escapeHtml(payload.problemId)}\n`;
  message += `<b>الرقم المتسلسل:</b> ${escapeHtml(payload.serial)}\n`;
  message += `<b>طريقة الدفع:</b> ${escapeHtml(payload.paymentLabel)}\n\n`;

  message += `<b>تفاصيل الدفع:</b>\n`;
  for (const [key, value] of Object.entries(payload.paymentDetails)) {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    message += `• <b>${escapeHtml(formattedKey)}:</b> ${escapeHtml(String(value))}\n`;
  }

  message += `\n<i>تم إرسال البيانات في: ${new Date().toLocaleString("ar-SA")}</i>`;

  return message;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
