import fetch from "node-fetch";

/* Helper general de envío con fetch */
async function sendEmail({ to, subject, html }) {
  try {
    console.log(`📧 [MailerSend-Fetch] Enviando a: ${to}`);
    console.log(`📧 [MailerSend-Fetch] API Key: ${process.env.MAILERSEND_API_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
    
    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MAILERSEND_API_KEY}`
      },
      body: JSON.stringify({
        from: {
          email: "no-reply@trial-0p7kx4xjz8pg9yjr.mlsender.net",
          name: "Glaminder"
        },
        to: [
          { email: to }
        ],
        subject: subject,
        html: html
      })
    });

    console.log(`🔍 [MailerSend-Fetch] Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ [MailerSend-Fetch] Error response:`, errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ [MailerSend-Fetch] Email enviado exitosamente:', data);
    
    return {
      success: true,
      messageId: data.message_id || data.id || 'sent',
      provider: 'mailersend-fetch',
      fullResponse: data
    };
    
  } catch (error) {
    console.error('❌ [MailerSend-Fetch] Error:', error.message);
    throw error;
  }
}

/* Test MailerSend con fetch */
export const testMailerSendConnection = async () => {
  try {
    console.log('🧪 [Test] Iniciando test con node-fetch...');
    
    if (!process.env.MAILERSEND_API_KEY) {
      throw new Error('MAILERSEND_API_KEY no configurado');
    }
    
    const result = await sendVerificationEmail(
      'shurtado308@gmail.com',
      'https://example.com/verify/test123',
      'Test User'
    );
    
    return {
      success: true,
      message: 'MailerSend con node-fetch funcionando correctamente',
      result: result
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message,
      stack: error.stack
    };
  }
};

/* Función de test directo */
export async function sendTestEmail(to, subject, html) {
  console.log(`📧 [sendTestEmail] Test directo para: ${to}`);
  
  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MAILERSEND_API_KEY}`
    },
    body: JSON.stringify({
      from: {
        email: "no-reply@trial-0p7kx4xjz8pg9yjr.mlsender.net",
        name: "Glaminder"
      },
      to: [
        { email: to }
      ],
      subject,
      html
    })
  });

  console.log(`🔍 [sendTestEmail] Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [sendTestEmail] Error:', errorText);
    throw new Error(`Failed to send: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ [sendTestEmail] Success:', data);
  return data;
}

/* Verificación de correo */
export const sendVerificationEmail = async (email, verificationURL, nombre) => {
  console.log(`📧 [sendVerificationEmail] Preparando para: ${email}`);
  
  return sendEmail({
    to: email,
    subject: "Verifica tu cuenta en Glaminder",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu cuenta - Glaminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #D1A04D 0%, #B8903D 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✨ Glaminder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Tu plataforma de belleza</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${nombre}! 👋</h2>
            
            <p style="color: #555; line-height: 1.8; margin: 0 0 25px 0; font-size: 16px;">
              ¡Bienvenido/a a <strong>Glaminder</strong>! Para activar tu cuenta y comenzar a usar nuestros servicios, necesitas verificar tu correo electrónico.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationURL}" 
                 style="display: inline-block; 
                        padding: 18px 35px; 
                        background: linear-gradient(135deg, #D1A04D 0%, #B8903D 100%);
                        color: white; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(209, 160, 77, 0.3);">
                ✨ Verificar mi cuenta ahora
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #D1A04D;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                🔗 ¿No puedes hacer clic en el botón?
              </p>
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                Copia y pega este enlace en tu navegador:
              </p>
              <p style="word-break: break-all; color: #D1A04D; font-size: 12px; margin: 0; background: white; padding: 10px; border-radius: 4px;">
                ${verificationURL}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">
              ⏰ <strong>Este enlace expira en 24 horas</strong>
            </p>
            <p style="color: #888; font-size: 12px; margin: 0;">
              Si no te registraste en Glaminder, puedes ignorar este correo.<br>
              © 2025 Glaminder - Todos los derechos reservados
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `
  });
};

/* Recuperación de contraseña */
export const sendResetEmail = async (email, resetURL) => {
  return sendEmail({
    to: email,
    subject: "🔐 Restablecer contraseña - Glaminder",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 35px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Glaminder</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Recuperación de contraseña</p>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Restablecer tu contraseña</h2>
            <p style="color: #555; line-height: 1.6; margin: 0 0 25px 0;">
              Has solicitado restablecer tu contraseña de Glaminder. Haz clic en el botón para crear una nueva:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="display: inline-block; 
                        padding: 16px 32px; 
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        color: white; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;">
                🔑 Cambiar mi contraseña
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;">
              <p style="color: #856404; font-size: 14px; margin: 0; font-weight: bold;">
                ⚠️ Este enlace expira en 1 hora por seguridad.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  });
};

export const sendPasswordChangeEmail = async (email, nombre, ipAddress) => {
  return sendEmail({
    to: email,
    subject: "✅ Contraseña actualizada - Glaminder",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: white;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Glaminder</h1>
          <p style="margin: 8px 0 0 0;">Contraseña actualizada</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Hola ${nombre},</h2>
          <p style="color: #555; line-height: 1.6;">
            Tu contraseña de Glaminder ha sido actualizada exitosamente.
          </p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666;"><strong>📅 Fecha:</strong> ${new Date().toLocaleString()}</p>
            ${ipAddress ? `<p style="margin: 5px 0 0 0; color: #666;"><strong>🌐 IP:</strong> ${ipAddress}</p>` : ""}
          </div>
        </div>
      </div>
    `
  });
};

export const sendAccountDeletionEmail = async (email, nombre) => {
  return sendEmail({
    to: email,
    subject: "⚠️ Cuenta eliminada - Glaminder",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #dc3545; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">⚠️ Glaminder</h1>
          <p style="margin: 5px 0 0 0;">Cuenta eliminada</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>Hola ${nombre},</h2>
          <p>Tu cuenta ha sido eliminada según tu solicitud.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  });
};

export const sendEmailChangeEmail = async (oldEmail, newEmail, nombre) => {
  return sendEmail({
    to: oldEmail,
    subject: "📧 Email actualizado - Glaminder",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #17a2b8; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">📧 Glaminder</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>Hola ${nombre},</h2>
          <p>Tu email ha sido actualizado:</p>
          <p><strong>Anterior:</strong> ${oldEmail}</p>
          <p><strong>Nuevo:</strong> ${newEmail}</p>
        </div>
      </div>
    `
  });
};
