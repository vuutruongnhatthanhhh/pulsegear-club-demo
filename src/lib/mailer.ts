import nodemailer from "nodemailer";

export function hasSmtpConfig(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Full HTML document (not just a fragment) with an explicit UTF-8 <meta charset> —
// without this, some mail clients guess the wrong encoding and Vietnamese
// diacritics render as mojibake ("bể phông chữ").
export function emailLayout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background:#f4f4f4;">
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto;">
      <div style="background:#0A0A0A; padding: 32px 24px; text-align: center;">
        <span style="color:#FF3C00; font-weight: 900; letter-spacing: 0.1em; font-size: 14px;">PULSEGEAR.CLUB</span>
      </div>
      <div style="padding: 32px 24px; background:#fff;">
        ${bodyHtml}
      </div>
    </div>
  </body>
</html>`;
}

// `label` must already be upper-cased in the source string — do NOT use CSS
// text-transform:uppercase here. Several mail-client renderers (Outlook's Word
// engine, some webmail apps) synthesize the uppercase glyph at render time and
// botch Vietnamese double-diacritic letters (e.g. "nhận" -> "NHẬN").
//
// Also avoid font-weight:900 (Black) with Vietnamese text — many renderers
// synthesize/fall back to a font for that weight that lacks full glyph coverage
// for double-diacritic letters (ậ, ễ, ộ, ...), even though the same weight
// renders single-diacritic letters (á, à) and non-Vietnamese text just fine.
// font-weight:700 (Bold) is far more reliably supported end-to-end.
export function emailButtonHtml(link: string, label: string) {
  return `
    <div style="text-align:center; margin: 28px 0;">
      <a href="${link}" style="background:#FF3C00; color:#000000; text-decoration:none; font-weight:700; letter-spacing:0.1em; font-size:12px; padding:14px 28px; display:inline-block;">
        ${label}
      </a>
    </div>
  `;
}
