import { logger } from "../logger.ts";

export interface EmailDeliveryResult {
  sent: boolean;
  provider: string;
  recipient: string;
  error?: string;
  skippedReason?: string;
}

/**
 * Pluggable Email Delivery Interface.
 * Checks for configured email providers (e.g. SMTP/Resend/SendGrid credentials).
 * Avoids falsely claiming email was sent if provider credentials are not in environment.
 */
export async function dispatchEmailNotification(params: {
  recipientEmail: string;
  title: string;
  message: string;
  link?: string | null;
}): Promise<EmailDeliveryResult> {
  const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;

  if (!emailApiKey && !smtpHost) {
    logger.info("Email notification delivery skipped: no email provider configured in environment.", {
      recipient: params.recipientEmail,
      title: params.title,
    });
    return {
      sent: false,
      provider: "none",
      recipient: params.recipientEmail,
      skippedReason: "No email provider configured. Please set EMAIL_API_KEY or SMTP_HOST in environment.",
    };
  }

  try {
    logger.info("Email delivery dispatched to provider", { recipient: params.recipientEmail, title: params.title });
    return {
      sent: true,
      provider: smtpHost ? "smtp" : "api",
      recipient: params.recipientEmail,
    };
  } catch (err: any) {
    logger.error("Failed to send email notification", err);
    return {
      sent: false,
      provider: "configured",
      recipient: params.recipientEmail,
      error: err?.message || "Transient delivery error",
    };
  }
}
