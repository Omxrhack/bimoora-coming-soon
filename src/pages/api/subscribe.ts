import { Resend } from 'resend';
import type { APIRoute } from 'astro';

// Marcar este endpoint como server-rendered
export const prerender = false;

// Función para generar ID de registro
function generateRegistrationId(email: string): string {
	const timestamp = Date.now().toString();
	const data = email + '|' + timestamp;
	
	// Simple hash function (similar a PHP hash)
	let hash = 0;
	for (let i = 0; i < data.length; i++) {
		const char = data.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	
	return Math.abs(hash).toString(36).toUpperCase().substring(0, 10);
}

// Función para escapar HTML (equivalente a htmlspecialchars de PHP)
function escapeHtml(text: string): string {
	const map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

export const POST: APIRoute = async ({ request }) => {
	try {
		// Obtener API key desde variables de entorno
		const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
		const BIMOORA_TEAM_EMAIL = import.meta.env.BIMOORA_TEAM_EMAIL || 'soporte@suport.bimoora.com';

		// Verificar que la API key esté configurada
		if (!RESEND_API_KEY) {
			console.error('RESEND_API_KEY no está configurada');
			return new Response(
				JSON.stringify({ error: 'RESEND_API_KEY no está configurada en el servidor' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Inicializar cliente de Resend con la API key
		const resend = new Resend(RESEND_API_KEY);

		// Leer y parsear el body de forma segura
		let data;
		try {
			const text = await request.text();
			if (!text || text.trim() === '') {
				return new Response(
					JSON.stringify({ error: 'El cuerpo de la solicitud está vacío' }),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}
			data = JSON.parse(text);
		} catch (parseError) {
			console.error('Error al parsear JSON:', parseError);
			return new Response(
				JSON.stringify({ error: 'Formato de datos inválido' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const email = data.email?.trim() || '';

		// Validar email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return new Response(
				JSON.stringify({ error: 'Email inválido' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Generar datos seguros
		const safeEmail = escapeHtml(email);
		const registrationId = generateRegistrationId(email);
		
		// Fecha en zona horaria de Mazatlán (GMT-7)
		const now = new Date();
		const mazatlanTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mazatlan' }));
		const prettyDate = `${mazatlanTime.toLocaleDateString('es-ES')} ${mazatlanTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} (GMT-7)`;
		const dateStr = mazatlanTime.toISOString().replace('T', ' ').substring(0, 19);

		// Template HTML para el usuario
		const userHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Confirmación — Bimoora</title>
</head>
<body style="margin:0; padding:0; background:#FDFBFF;">
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Confirmación de lista de espera: ya estás dentro. ID ${registrationId}.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FDFBFF;">
    <tr>
      <td align="center" style="padding:30px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="max-width:600px; width:100%; background:#ffffff; border-radius:24px; overflow:hidden;
                 border:1px solid #E8D4F8; box-shadow:0 18px 60px rgba(168,156,255,0.22);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:26px 20px;
              background:linear-gradient(90deg,#A89CFF 0%, #E8D4F8 55%, #FFC8DD 100%);">
              <a href="https://bimoora.com" target="_blank" style="text-decoration:none;">
                <img src="https://i.imgur.com/SYhYKPA.png"
                  alt="Bimoora" width="78"
                  style="display:block; border-radius:18px; margin:0 auto 12px auto;" />
              </a>

              <div style="font-family: Arial, Helvetica, sans-serif; font-size:22px; font-weight:900; color:#1E1B4B;">
                ¡Bienvenido(a) a Bimoora!
              </div>
              <div style="font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#1E1B4B; opacity:0.9; margin-top:6px;">
                Ya estás en la lista de espera — <strong>Donde el amor deja memoria</strong>
              </div>

              <!-- Badge ID -->
              <div style="margin-top:12px; display:inline-block; padding:8px 12px; border-radius:999px;
                background:rgba(255,255,255,0.55); border:1px solid rgba(30,27,75,0.10);">
                <span style="font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#1E1B4B; font-weight:800;">
                  ID de registro: ${registrationId}
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:22px 22px 10px 22px;">
              <div style="font-family: Arial, Helvetica, sans-serif; color:#1E1B4B; font-size:16px; line-height:1.65;">
                Gracias por registrarte. Te avisaremos en cuanto lancemos para que seas de los primeros en probar Bimoora.
              </div>

              <div style="height:16px;"></div>

              <!-- Confirmación (Email/Fecha) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:#FBF9FF; border:1px solid #E8D4F8; border-radius:18px;">
                <tr>
                  <td style="padding:18px;">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">
                      Confirmación de registro
                    </div>

                    <div style="height:10px;"></div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">Correo</div>
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size:16px; font-weight:900; color:#1E1B4B;">
                            ${safeEmail}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0 0 0;">
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">Fecha</div>
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; font-weight:800; color:#1E1B4B;">
                            ${prettyDate}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:12px; font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#9CA3AF; line-height:1.5;">
                      Si no fuiste tú, ignora este correo. Nadie será registrado sin confirmación del envío.
                    </div>
                  </td>
                </tr>
              </table>

              <div style="height:16px;"></div>

              <!-- Qué podrás hacer -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:#FFFFFF; border:1px solid #F1E9FF; border-radius:18px;">
                <tr>
                  <td style="padding:18px;">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; font-weight:900; color:#1E1B4B;">
                      Lo que viene en Bimoora:
                    </div>
                    <div style="height:10px;"></div>
                    <ul style="margin:0; padding:0 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size:14px; color:#1E1B4B; line-height:1.75;">
                      <li><strong>Notas y recuerdos</strong> para guardar lo importante.</li>
                      <li><strong>Momentos especiales</strong> (fechas, rachas, sorpresas).</li>
                      <li><strong>Diario inteligente</strong> para cuidar su conexión.</li>
                      <li><strong>Espacio privado para dos</strong> (simple, bonito y seguro).</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <div style="height:16px;"></div>

              <!-- Qué sigue -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:linear-gradient(180deg,#FBF9FF 0%, #FFFFFF 100%); border:1px solid #E8D4F8; border-radius:18px;">
                <tr>
                  <td style="padding:18px;">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; font-weight:900; color:#1E1B4B;">
                      ¿Qué sigue?
                    </div>
                    <div style="height:10px;"></div>
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; color:#6B7280; line-height:1.6;">
                      Te enviaremos un correo en cuanto el acceso esté disponible. Guarda este ID por si necesitas soporte:
                      <strong style="color:#1E1B4B;">${registrationId}</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <div style="height:18px;"></div>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td align="center" style="border-radius:14px; background:linear-gradient(90deg,#A89CFF 0%, #E8D4F8 100%);">
                    <a href="https://bimoora.com" target="_blank"
                      style="display:inline-block; padding:12px 18px; font-family: Arial, Helvetica, sans-serif;
                             font-size:14px; font-weight:900; color:#ffffff; text-decoration:none; border-radius:14px;">
                      Ver novedades
                    </a>
                  </td>
                </tr>
              </table>

              <div style="height:12px;"></div>

              <div style="text-align:center; font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#9CA3AF;">
                Si el botón no funciona, abre: <span style="color:#A89CFF; font-weight:800;">bimoora.com</span>
              </div>

              <div style="height:16px;"></div>

              <div style="font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#6B7280; line-height:1.6;">
                Con cariño,<br />
                <strong style="color:#1E1B4B;">El equipo de Bimoora</strong>
              </div>
            </td>
          </tr>

          <!-- Footer legal -->
          <tr>
            <td style="padding:14px 22px 18px 22px; border-top:1px solid #F1E9FF;">
              <div style="font-family: Arial, Helvetica, sans-serif; font-size:11px; color:#9CA3AF; line-height:1.55;">
                Este correo fue generado automáticamente tras una suscripción en bimoora.com.
                Si necesitas ayuda, escribe a
                <strong style="color:#1E1B4B;">soporte@bimoora.com</strong>.
              </div>
              <div style="font-family: Arial, Helvetica, sans-serif; font-size:11px; color:#9CA3AF; margin-top:8px;">
                © Bimoora · Donde el amor deja memoria
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

		// Template HTML para el equipo
		const teamHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Nueva suscripción - Bimoora</title>
</head>
<body style="margin:0; padding:0; background:#FDFBFF;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Nuevo registro en la landing de Bimoora
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FDFBFF;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; overflow:hidden;
                 border:1px solid #E8D4F8; box-shadow:0 16px 48px rgba(168,156,255,0.20);">

          <tr>
            <td align="center" style="padding:22px; background:linear-gradient(90deg,#A89CFF 0%, #E8D4F8 55%, #FFC8DD 100%);">
              <a href="https://bimoora.com" target="_blank" style="text-decoration:none;">
                <img
                  src="https://i.ibb.co/mry8Hj3v/bimooralogo.jpg"
                  alt="Bimoora"
                  width="64"
                  style="display:block; margin:0 auto 10px auto; border-radius:14px;"
                />
              </a>
              <div style="font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:800; color:#1E1B4B;">
                Nueva suscripción — Bimoora
              </div>
              <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#1E1B4B; opacity:0.85; margin-top:4px;">
                Te notificarémos cuando la aplicacíon este lista.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:#FBF9FF; border-radius:18px; border:1px solid #E8D4F8;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#6B7280;">
                      Nuevo usuario registrado
                    </div>

                    <div style="height:10px;"></div>

                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:800; color:#1E1B4B;">
                      ${safeEmail}
                    </div>

                    <div style="height:18px;"></div>

                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#6B7280;">
                      Fecha de registro
                    </div>
                    <div style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:700; color:#1E1B4B;">
                      ${dateStr}
                    </div>

                    <div style="margin-top:18px;">
                      <a href="https://bimoora.com" target="_blank"
                        style="font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:800;
                               color:#A89CFF; text-decoration:underline;">
                        Visitar bimoora.com
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#9CA3AF; margin-top:16px;">
                Correo generado automáticamente desde la landing de Bimoora.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 22px; border-top:1px solid #F1E9FF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="left" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#9CA3AF;">
                    © Bimoora · Derechos Reservados.
                  </td>
                  <td align="right" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#9CA3AF;">
                    Donde el amor deja memoria
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

		// Enviar email al usuario
		const userEmailResult = await resend.emails.send({
			from: 'Soporte <soporte@suport.bimoora.com>',
			to: [email],
			subject: '¡Gracias por unirte a Bimoora!',
			html: userHtml,
		});

		if (userEmailResult.error) {
			console.error('Error enviando correo al usuario:', userEmailResult.error);
			return new Response(
				JSON.stringify({ 
					error: 'Error enviando correo al usuario',
					details: userEmailResult.error 
				}),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Enviar notificación al equipo
		try {
			const teamEmailResult = await resend.emails.send({
				from: 'Soporte <soporte@suport.bimoora.com>',
				to: [BIMOORA_TEAM_EMAIL],
				subject: 'Nueva suscripción — Bimoora',
				html: teamHtml,
			});

			if (teamEmailResult.error) {
				console.error('Error notificando al equipo:', teamEmailResult.error);
				// Continuar aunque falle el email al equipo
				return new Response(
					JSON.stringify({ 
						success: true, 
						message: '¡Gracias! Te notificaremos cuando lancemos.',
						warning: 'No se pudo notificar al equipo'
					}),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				);
			}
		} catch (teamEmailError) {
			console.error('Excepción al notificar al equipo:', teamEmailError);
			// No fallar si el email al equipo tiene problemas
		}

		return new Response(
			JSON.stringify({ 
				success: true, 
				message: '¡Gracias! Te notificaremos cuando lancemos.' 
			}),
			{ 
				status: 200, 
				headers: { 'Content-Type': 'application/json' } 
			}
		);
	} catch (error) {
		console.error('Error al enviar email:', error);
		return new Response(
			JSON.stringify({ 
				error: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.' 
			}),
			{ 
				status: 500, 
				headers: { 'Content-Type': 'application/json' } 
			}
		);
	}
};
