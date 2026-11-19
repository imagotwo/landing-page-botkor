# Flujo n8n: leads → Google Sheets + correo

Archivo para importar: [`botkor-leads-sheets-correo.json`](botkor-leads-sheets-correo.json)

```
Webhook lead ─▶ Verificar firma ─▶ ¿Firma válida? ─ sí ─▶ Guardar en Google Sheets ─▶ Responder OK (200) ─▶ Avisar por correo
                                                   └ no ─▶ Rechazar (401)
```

- **Verificar firma**: comprueba la firma HMAC (`X-Botkor-Signature`) con el mismo secreto que usa la web y rechaza los envíos con más de 5 minutos. Así nadie puede meter leads falsos aunque descubra la URL.
- **Google Sheets**: agrega una fila por lead. Usa el formato `RAW`, así el `+57…` del WhatsApp se conserva y ningún texto se interpreta como fórmula.
- **Responder OK** va antes del correo. La web recibe la confirmación en cuanto el lead queda guardado, y un correo lento no hace esperar al cliente. La web corta la espera a los 8 s.

## 1. Crear la hoja

1. En Google Sheets crea un archivo, por ejemplo «Leads botkor».
2. Renombra la pestaña a **`Leads`**.
3. Pega esta fila de encabezados en la fila 1, empezando en A1. Los nombres deben quedar exactos:

```
Fecha	ID	Nombre	Empresa	Sector	Tipo de web	Canal	Email	WhatsApp	Página	Referrer	utm_source	utm_medium	utm_campaign	gclid	fbclid	Estado
```

Si pegas la línea tal cual, Google Sheets reparte cada nombre en su columna (están separados por tabulaciones). Más adelante puedes agregar columnas a la derecha, como «Notas» o «Valor cotizado»: el flujo no las toca.

## 2. Importar el flujo en n8n

1. En n8n abre **Workflows → Create workflow**, luego el menú **⋯ → Import from File…** y elige el `.json`.
2. Configura el nodo **Verificar firma**: reemplaza `PEGA_AQUI_EL_VALOR_DE_N8N_WEBHOOK_SECRET` por el mismo valor de `N8N_WEBHOOK_SECRET` que pongas en Vercel.
   - Genera el secreto con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - Mientras no lo cambies, el flujo rechaza todos los leads con el mensaje «Falta configurar SECRET».
3. Configura el nodo **Guardar en Google Sheets**:
   - En *Credential* crea una credencial de **Google Sheets OAuth2** e inicia sesión con tu cuenta de Google.
   - En *Document* pega la URL de tu hoja.
   - En *Sheet* deja `Leads`.
4. Configura el nodo **Avisar por correo**:
   - En *Credential* crea una credencial de **Gmail OAuth2**.
   - En *To* cambia `TU_CORREO@ejemplo.com` por tu correo. Puedes poner varios separados por coma.
   - Si no usas Gmail, cambia este nodo por **Send Email (SMTP)** con el asunto `{{ $('Verificar firma').first().json.email.subject }}` y el HTML `{{ $('Verificar firma').first().json.email.html }}`.
5. Guarda el flujo y actívalo con el interruptor **Active**, arriba a la derecha.

## 3. Conectar la web

En el nodo **Webhook lead** copia la **Production URL**. Termina en `/webhook/botkor-lead`.

| Dónde | Variable | Valor |
|---|---|---|
| Vercel → Settings → Environment Variables | `N8N_WEBHOOK_URL` | la Production URL |
| Vercel → Settings → Environment Variables | `N8N_WEBHOOK_SECRET` | el mismo secreto del paso 2 |
| `.env.local` (para probar en tu PC) | las mismas dos variables | |

Después de cambiar variables en Vercel, haz **Redeploy** para que se apliquen.

> La **Test URL** (`/webhook-test/…`) solo funciona mientras pulsas «Listen for test event» en n8n. En Vercel usa siempre la **Production URL** con el flujo activo.

## 4. Probar

Con las variables en `.env.local`:

```bash
node --env-file=.env.local scripts/test-n8n-webhook.mjs          # debe dar HTTP 200, una fila nueva y un correo
node --env-file=.env.local scripts/test-n8n-webhook.mjs --mala   # debe dar HTTP 401 y no escribir nada
```

También puedes llenar el formulario real con `npm run dev`: con `N8N_WEBHOOK_URL` definida, los leads de desarrollo también llegan a n8n. Borra las filas de prueba de la hoja cuando termines.

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| La web dice «No pudimos registrar tu solicitud…» | El flujo no está activo, la URL es la Test URL o n8n no responde en 8 s |
| HTTP 401 «Firma inválida» | El secreto del nodo no coincide con `N8N_WEBHOOK_SECRET` (revisa espacios al copiar) |
| HTTP 401 «Timestamp vencido» | El reloj del servidor de n8n está desfasado más de 5 min |
| Error en el nodo Sheets | La pestaña no se llama `Leads` o los encabezados no coinciden |
| El WhatsApp aparece sin `+` | En el nodo Sheets, *Options → Cell Format* debe ser `RAW` |

En **Executions** de n8n ves cada lead recibido y en qué nodo falló, si falló.
