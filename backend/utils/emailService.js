import nodemailer from 'nodemailer';

/* Configurar transporter con Gmail */
const getTransporter = () => {
  console.log('📧 Configurando transporter Gmail...');
  
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 segundos
    greetingTimeout: 30000, // 30 segundos  
    socketTimeout: 60000 // 60 segundos
  });
};

export { getTransporter };

/* Helper general de envío */
async function sendEmail({ to, subject, html }) {
  try {
    console.log(`📧 [Gmail] Iniciando envío a: ${to}`);
    console.log(`📧 [Gmail] Asunto: ${subject}`);
    
    const transporter = getTransporter();
    
    // Verificar conexión antes de enviar
    console.log('🔍 [Gmail] Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ [Gmail] Conexión SMTP verificada correctamente');
    
    const mailOptions = {
      from: {
        name: 'Glaminder',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: subject,
      html: html,
      // Headers adicionales para mejor deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    console.log('📤 [Gmail] Enviando email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [Gmail] Email enviado exitosamente:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });
    
    return { 
      success: true, 
      messageId: result.messageId,
      accepted: result.accepted 
    };
    
  } catch (error) {
    console.error('❌ [Gmail] Error enviando email:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

////////////////////////////////////////////////////////
///  EMAILS ESPECÍFICOS
////////////////////////////////////////////////////////

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
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
        
        <!-- Container principal -->
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #D1A04D 0%, #B8903D 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Glaminder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Tu plataforma de belleza</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${nombre}! 👋</h2>
            
            <p style="color: #555; line-height: 1.8; margin: 0 0 25px 0; font-size: 16px;">
              ¡Bienvenido/a a <strong>Glaminder</strong>! Estamos emocionados de tenerte con nosotros.
            </p>
            
            <p style="color: #555; line-height: 1.8; margin: 0 0 30px 0; font-size: 16px;">
              Para completar tu registro y comenzar a disfrutar de todos nuestros servicios de belleza, necesitas verificar tu correo electrónico.
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
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(209, 160, 77, 0.3);
                        transition: all 0.3s ease;">
                ✨ Verificar mi cuenta
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                ¿No puedes hacer clic en el botón?
              </p>
              <p style="color: #666; font-size: 14px; margin: 0;">
                Copia y pega este enlace en tu navegador:
              </p>
              <p style="word-break: break-all; color: #D1A04D; font-size: 12px; margin: 10px 0 0 0; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #D1A04D;">
                ${verificationURL}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">
              ⏰ <strong>Este enlace es válido por 24 horas</strong>
            </p>
            <p style="color: #888; font-size: 12px; margin: 0 0 15px 0;">
              Si no creaste esta cuenta en Glaminder, puedes ignorar este correo de forma segura.
            </p>
            
            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2025 Glaminder - Todos los derechos reservados<br>
                Este es un correo automático, por favor no respondas a esta dirección.
              </p>
            </div>
          </div>
          
        </div>
      </body>
      </html>
    `
  });
};

/* Recuperación de contraseña */
export const sendResetEmail = async (email, resetURL) => {
  console.log(`📧 [sendResetEmail] Preparando para: ${email}`);
  
  return sendEmail({
    to: email,
    subject: "🔐 Restablecer contraseña - Glaminder",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña - Glaminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Glaminder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Recuperación de contraseña</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Restablecer tu contraseña</h2>
            
            <p style="color: #555; line-height: 1.6; margin: 0 0 25px 0;">
              Has solicitado restablecer tu contraseña de Glaminder. Haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="display: inline-block; 
                        padding: 16px 32px; 
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        color: white; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);">
                🔑 Cambiar mi contraseña
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; font-weight: bold;">
                ⚠️ Importante: Este enlace expira en 1 hora por seguridad.
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              Enlace directo: <br>
              <span style="word-break: break-all; color: #dc3545; font-size: 12px;">
                ${resetURL}
              </span>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura.<br>
              Tu contraseña no será cambiada hasta que accedas al enlace de arriba.
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `
  });
};

/* Cambio de contraseña notificación */
export const sendPasswordChangeEmail = async (email, nombre, ipAddress) => {
  console.log(`📧 [sendPasswordChangeEmail] Notificando a: ${email}`);
  
  return sendEmail({
    to: email,
    subject: "✅ Contraseña actualizada - Glaminder",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">✅ Glaminder</h1>
          <p style="margin: 5px 0 0 0;">Contraseña actualizada</p>
        </div>
        
        <div style="padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hola ${nombre},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Tu contraseña ha sido actualizada exitosamente en tu cuenta de Glaminder.
          </p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666;"><strong>📅 Fecha:</strong> ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
            ${ipAddress ? `<p style="margin: 5px 0 0 0; color: #666;"><strong>🌐 IP:</strong> ${ipAddress}</p>` : ""}
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>🔒 ¿No fuiste tú?</strong> Si no realizaste este cambio, contacta nuestro soporte inmediatamente.
            </p>
          </div>
        </div>
        
      </body>
      </html>
    `
  });
};

/* Eliminación de cuenta */
export const sendAccountDeletionEmail = async (email, nombre) => {
  console.log(`📧 [sendAccountDeletionEmail] Notificando a: ${email}`);
  
  return sendEmail({
    to: email,
    subject: "⚠️ Cuenta eliminada - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">⚠️ Glaminder</h1>
          <p style="margin: 0;">Cuenta eliminada</p>
        </div>
        
        <div style="padding: 30px; border: 1px solid #ddd;">
          <h2>Hola ${nombre},</h2>
          <p>Tu cuenta de Glaminder ha sido eliminada exitosamente según tu solicitud.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CO")}</p>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #721c24; margin: 0;">
              <strong>⚠️ Importante:</strong> Si no solicitaste esta acción, contacta soporte inmediatamente.
            </p>
          </div>
        </div>
      </div>
    `
  });
};

/* Cambio de email */
export const sendEmailChangeEmail = async (oldEmail, newEmail, nombre) => {
  console.log(`📧 [sendEmailChangeEmail] Notificando cambio: ${oldEmail} -> ${newEmail}`);
  
  return sendEmail({
    to: oldEmail,
    subject: "📧 Correo electrónico actualizado - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #17a2b8; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">📧 Glaminder</h1>
          <p style="margin: 0;">Email actualizado</p>
        </div>
        
        <div style="padding: 30px; border: 1px solid #ddd;">
          <h2>Hola ${nombre},</h2>
          <p>Tu dirección de correo electrónico ha sido actualizada en Glaminder.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📧 Email anterior:</strong> ${oldEmail}</p>
            <p style="margin: 5px 0 0 0;"><strong>📧 Nuevo email:</strong> ${newEmail}</p>
            <p style="margin: 5px 0 0 0;"><strong>📅 Fecha:</strong> ${new Date().toLocaleString("es-CO")}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px;">
            <p style="color: #856404; margin: 0;">
              <strong>🔒 Nota de seguridad:</strong> Si no realizaste este cambio, contacta soporte inmediatamente.
            </p>
          </div>
        </div>
      </div>
    `
  });
};
