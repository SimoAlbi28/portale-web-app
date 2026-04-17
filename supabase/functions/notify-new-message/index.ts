// Supabase Edge Function: invia una notifica email al proprietario
// quando viene inserito un nuovo record nella tabella `messages`.
//
// Invocata da un Database Webhook (INSERT on public.messages).
// Richiede le env vars:
//   - RESEND_API_KEY  → chiave API di https://resend.com
//   - NOTIFY_TO       → email di destinazione (es. simone.albini@garipalli.com)
//   - NOTIFY_FROM     → mittente verificato su Resend (es. noreply@tuodominio.it)

// deno-lint-ignore-file no-explicit-any
type MessageRow = {
  id?: number | string;
  user_id?: string | null;
  email?: string | null;
  name?: string | null;
  subject?: string | null;
  body?: string | null;
  created_at?: string | null;
};

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: MessageRow;
  old_record: MessageRow | null;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const NOTIFY_TO = Deno.env.get("NOTIFY_TO");
  const NOTIFY_FROM =
    Deno.env.get("NOTIFY_FROM") ?? "onboarding@resend.dev";

  if (!RESEND_API_KEY || !NOTIFY_TO) {
    return new Response(
      JSON.stringify({ error: "Missing RESEND_API_KEY or NOTIFY_TO" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (payload.type !== "INSERT" || payload.table !== "messages") {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const m = payload.record ?? {};
  const subject = m.subject?.trim() || "(senza oggetto)";
  const senderEmail = m.email?.trim() || "-";
  const senderName = m.name?.trim() || "-";
  const body = m.body?.trim() || "(messaggio vuoto)";
  const created = m.created_at
    ? new Date(m.created_at).toLocaleString("it-IT")
    : new Date().toLocaleString("it-IT");

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background:#0a0420; color:#e6f1ff; border-radius:16px">
      <h2 style="color:#22d3ee; margin:0 0 16px;">Nuovo messaggio dal portale</h2>
      <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:16px">
        <tr><td style="padding:4px 0; color:#9ca3af; width:90px">Da</td><td>${escapeHtml(senderName)}</td></tr>
        <tr><td style="padding:4px 0; color:#9ca3af">Email</td><td><a href="mailto:${escapeHtml(senderEmail)}" style="color:#67e8f9">${escapeHtml(senderEmail)}</a></td></tr>
        <tr><td style="padding:4px 0; color:#9ca3af">Oggetto</td><td>${escapeHtml(subject)}</td></tr>
        <tr><td style="padding:4px 0; color:#9ca3af">Ricevuto</td><td>${escapeHtml(created)}</td></tr>
      </table>
      <div style="background:#07021c; border:1px solid #ffffff22; border-radius:12px; padding:16px; white-space:pre-wrap; font-size:14px; line-height:1.55">
        ${escapeHtml(body)}
      </div>
    </div>
  `;

  const text = [
    "Nuovo messaggio dal portale",
    `Da: ${senderName} <${senderEmail}>`,
    `Oggetto: ${subject}`,
    `Ricevuto: ${created}`,
    "",
    body,
  ].join("\n");

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: senderEmail !== "-" ? senderEmail : undefined,
      subject: `[Portale] ${subject}`,
      html,
      text,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    return new Response(
      JSON.stringify({ error: "Resend failed", detail: errText }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
});
