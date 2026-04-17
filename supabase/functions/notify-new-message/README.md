# notify-new-message

Edge Function che invia una email a te ogni volta che qualcuno invia un messaggio dal form `ContactSection` (tabella `messages`).

## Setup una-tantum

### 1. Crea account Resend (provider email)

1. Vai su https://resend.com e registrati (free tier: 3k email/mese)
2. Sezione **API Keys** → crea una chiave → copiala (inizia con `re_`)
3. Sezione **Domains** → aggiungi il tuo dominio (es. `daily-apps.it`) e segui le istruzioni DNS per verificarlo. Se non hai un dominio, puoi usare il mittente di test `onboarding@resend.dev` (invia solo al tuo indirizzo Resend registrato).

### 2. Installa Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <ID_PROGETTO>
```

Trovi `<ID_PROGETTO>` nell'URL della dashboard Supabase (`https://supabase.com/dashboard/project/<ID>`).

### 3. Configura i secrets

```bash
supabase secrets set \
  RESEND_API_KEY=re_xxx_tua_chiave \
  NOTIFY_TO=simone.albini28@gmail.com \
  NOTIFY_FROM=noreply@tuodominio.it
```

Se non hai dominio verificato, usa:
```bash
supabase secrets set NOTIFY_FROM=onboarding@resend.dev
```

### 4. Deploy della Edge Function

```bash
supabase functions deploy notify-new-message --no-verify-jwt
```

(`--no-verify-jwt` perché il webhook Supabase non manda il JWT).

### 5. Crea il Database Webhook

Da dashboard Supabase:

1. **Database** → **Webhooks** → **Create a new hook**
2. Nome: `notify-new-message`
3. Table: `public.messages`
4. Events: spunta solo **Insert**
5. Type: **Supabase Edge Functions**
6. Edge Function: seleziona `notify-new-message`
7. Method: **POST**
8. Timeout: 5000ms
9. Salva

### 6. Test

Manda un messaggio dal form contatti del sito. Dovresti ricevere l'email entro pochi secondi.

Se non arriva:
- Dashboard Resend → **Logs** → verifica se l'email è stata inviata/rifiutata
- Dashboard Supabase → **Edge Functions** → `notify-new-message` → **Logs** per errori
- Dashboard Supabase → **Database** → **Webhooks** → verifica lo status dell'ultimo trigger

## Aggiornare la funzione

Dopo modifiche a `index.ts`:
```bash
supabase functions deploy notify-new-message --no-verify-jwt
```

## Cambiare provider email

Il codice usa Resend. Per SendGrid/Postmark/Gmail SMTP, sostituisci la chiamata `fetch("https://api.resend.com/emails", …)` in `index.ts` con la chiamata equivalente del nuovo provider e aggiorna i secrets.
