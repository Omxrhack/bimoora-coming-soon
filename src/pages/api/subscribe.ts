import { Resend } from 'resend';
import type { APIRoute } from 'astro';

// Marcar este endpoint como server-rendered
export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
	console.error('RESEND_API_KEY no está configurada.');
}

const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
	try {
		// Verificar que la API key esté configurada
		if (!RESEND_API_KEY) {
			console.error('RESEND_API_KEY no está configurada');
			return new Response(
				JSON.stringify({ error: 'Error de configuración del servidor' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

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

		const { email } = data;

		// Validar email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return new Response(
				JSON.stringify({ error: 'Email inválido' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Enviar email de confirmación al usuario
		await resend.emails.send({
			from: 'Bimoora <onboarding@resend.dev>',
			to: [email],
			subject: '¡Gracias por unirte a Bimoora!',
			html: `
				<div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDFBFF;">
					<h1 style="color: #1E1B4B; font-size: 28px; margin-bottom: 20px;">¡Bienvenido a Bimoora!</h1>
					<p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
						Gracias por registrarte. Te notificaremos tan pronto como lancemos nuestra app.
					</p>
					<p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
						<strong style="color: #A89CFF;">Donde el amor deja memoria.</strong>
					</p>
					<p style="color: #9CA3AF; font-size: 14px; margin-top: 30px;">
						El equipo de Bimoora
					</p>
				</div>
			`,
		});

		// Opcional: Enviar notificación al equipo de Bimoora
		const teamEmail = import.meta.env.BIMOORA_TEAM_EMAIL || 'team@bimoora.com';
		await resend.emails.send({
			from: 'Bimoora <bimoora@bimoora.com>',
			to: [teamEmail],
			subject: 'Nueva suscripción - Bimoora',
			html: `
				<div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2 style="color: #1E1B4B;">Nueva suscripción</h2>
					<p style="color: #6B7280;">Email: <strong>${email}</strong></p>
					<p style="color: #6B7280;">Fecha: ${new Date().toLocaleString('es-ES')}</p>
				</div>
			`,
		});

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
