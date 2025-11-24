import Brevo from "@getbrevo/brevo";

/* Inicializar cliente global de Brevo */
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

/* Helper general de envío */
async function sendEmail({ to, subject, html }) {
  try {
    const email = new Brevo.SendSmtpEmail();
    email.sender = {
      name: "Glaminder",
      email: "no-reply@brevo.com"
    };

    email.to = [{ email: to }];
    email.subject = subject;
    email.htmlContent = html;

    const result = await apiInstance.sendTransacEmail(email);

    console.log("[Brevo] Email enviado:", result.messageId);
  } catch (error) {
    console.error("[Brevo] Error enviando email:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////
///  EMAILS ESPECÍFICOS
////////////////////////////////////////////////////////

/* Recuperación de contraseña */
export const sendResetEmail = async (email, resetURL) => {
  return sendEmail({
    to: email,
    subject: "Recuperación de contraseña - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Recuperación de Contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #D1A04D; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `
  });
};

/* Verificación de correo */
export const sendVerificationEmail = async (email, verificationURL, nombre) => {
  return sendEmail({
    to: email,
    subject: "Verifica tu correo electrónico - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">¡Bienvenido a Glaminder, ${nombre}!</h2>
        <p>Para completar tu registro, verifica tu correo haciendo clic en:</p>
        <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; background-color: #D1A04D; color: white; text-decoration: none; border-radius: 5px;">Verificar Correo</a>
        <p>Enlace válido por 24 horas.</p>
        <p>Si no creaste esta cuenta, ignora este correo.</p>
      </div>
    `
  });
};

/* Eliminación de cuenta */
export const sendAccountDeletionEmail = async (email, nombre) => {
  return sendEmail({
    to: email,
    subject: "Cuenta eliminada - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Cuenta Eliminada</h2>
        <p>Hola ${nombre}, tu cuenta ha sido eliminada exitosamente.</p>
        <p>Si no solicitaste esta acción, contacta soporte inmediatamente.</p>
      </div>
    `
  });
};

/* Cambio de contraseña */
export const sendPasswordChangeEmail = async (email, nombre, ipAddress) => {
  return sendEmail({
    to: email,
    subject: "Contraseña cambiada - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Contraseña Cambiada</h2>
        <p>Hola ${nombre}, tu contraseña ha sido modificada.</p>

        <div style="background-color:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CO")}</p>
          ${ipAddress ? `<p><strong>IP:</strong> ${ipAddress}</p>` : ""}
        </div>

        <p>Si no realizaste este cambio, contacta soporte inmediatamente.</p>
      </div>
    `
  });
};

/* Cambio de email */
export const sendEmailChangeEmail = async (oldEmail, newEmail, nombre) => {
  return sendEmail({
    to: oldEmail,
    subject: "Correo electrónico cambiado - Glaminder",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Correo Electrónico Cambiado</h2>
        <p>Hola ${nombre}, tu correo asociado ha sido actualizado.</p>

        <div style="background-color:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Anterior:</strong> ${oldEmail}</p>
          <p><strong>Nuevo:</strong> ${newEmail}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CO")}</p>
        </div>

        <p>Si no fuiste tú, contacta soporte inmediatamente.</p>
      </div>
    `
  });
};
