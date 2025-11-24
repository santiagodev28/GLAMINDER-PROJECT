import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


/* Inicializar MailerSend */
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

/* Helper general de envío */
async function sendEmail({ to, subject, html }) {
  try {
    console.log(`📧 [MailerSend] Enviando a: ${to}`);
    
    const sentFrom = new Sender("noreply@trial-0p7kx4xjz8pg9yjr.mlsender.net", "Glaminder");
    const recipients = [new Recipient(to, to.split('@')[0])];
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);

    const result = await mailerSend.email.send(emailParams);
    
    console.log('✅ [MailerSend] Email enviado');
    return { 
      success: true, 
      messageId: result.body?.messageId || 'sent',
      provider: 'mailersend'
    };
    
  } catch (error) {
    console.error('❌ [MailerSend] Error:', error.message);
    throw error;
  }
}

/* Test MailerSend */
export const testMailerSendConnection = async () => {
  try {
    if (!process.env.MAILERSEND_API_KEY) {
      throw new Error('MAILERSEND_API_KEY no configurado');
    }
    
    const result = await sendVerificationEmail(
      'shurtado308@gmail.com',
      'https://example.com/verify/test',
      'Test User'
    );
    
    return {
      success: true,
      message: 'MailerSend funcionando',
      result: result
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

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
        
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #D1A04D 0%, #B8903D 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Glaminder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Tu plataforma de belleza</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">¡Hola ${nombre}! 👋</h2>
            
            <p style="color: #555; line-height: 1.8; margin: 0 0 25px 0;">
              ¡Bienvenido/a a <strong>Glaminder</strong>! Para activar tu cuenta, haz clic en el botón:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationURL}" 
                 style="display: inline-block; 
                        padding: 16px 32px; 
                        background: linear-gradient(135deg, #D1A04D 0%, #B8903D 100%);
                        color: white; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;">
                ✨ Verificar mi cuenta
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Si no puedes hacer clic, copia este enlace: <br>
                <span style="word-break: break-all; color: #D1A04D; font-size: 12px;">
                  ${verificationURL}
                </span>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © 2025 Glaminder - Este enlace expira en 24 horas
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
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">🔐 Glaminder</h1>
          <p style="margin: 5px 0 0 0;">Recuperación de contraseña</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333;">Restablecer contraseña</h2>
          <p>Haz clic para crear una nueva contraseña:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetURL}" 
               style="display: inline-block; 
                      padding: 15px 30px; 
                      background: #dc3545;
                      color: white; 
                      text-decoration: none; 
                      border-radius: 8px;">
              🔑 Cambiar contraseña
            </a>
          </div>
          
          <p style="color: #dc3545; font-weight: bold;">⚠️ Expira en 1 hora</p>
        </div>
      </div>
    `
  });
};

export const sendPasswordChangeEmail = async (email, nombre, ipAddress) => {
  return sendEmail({
    to: email,
    subject: "✅ Contraseña actualizada - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✅ Glaminder</h1>
        </div>
        <div style="padding: 20px; background: white;">
          <h2>Hola ${nombre},</h2>
          <p>Tu contraseña fue actualizada exitosamente.</p>
          <p><strong>IP:</strong> ${ipAddress || 'No disponible'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  });
};
