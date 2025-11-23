import nodemailer from 'nodemailer';

// Configurar el transporte de nodemailer - MEJORADO
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT), // 2525
    secure: false, // obligatorio para 2525
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};



export const sendResetEmail = async (email, resetURL) => {
  const transporter = getTransporter();

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña - Glaminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Recuperación de Contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #D1A04D; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, verificationURL, nombre) => {
  const transporter = getTransporter();

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifica tu correo electrónico - Glaminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">¡Bienvenido a Glaminder, ${nombre}!</h2>
        <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
        <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; background-color: #D1A04D; color: white; text-decoration: none; border-radius: 5px;">Verificar Correo</a>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Si no creaste esta cuenta, ignora este correo.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar correo de verificación:', error);
    throw error;
  }
};

// Enviar correo de confirmación de eliminación de cuenta
export const sendAccountDeletionEmail = async (email, nombre) => {
  const transporter = getTransporter();

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Cuenta eliminada - Glaminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Cuenta Eliminada</h2>
        <p>Hola ${nombre},</p>
        <p>Te informamos que tu cuenta en Glaminder ha sido eliminada exitosamente.</p>
        <p>Si no solicitaste esta acción, por favor contacta inmediatamente con nuestro equipo de soporte.</p>
        <p>Gracias por haber sido parte de Glaminder.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar correo de eliminación de cuenta:', error);
    throw error;
  }
};

// Enviar correo de confirmación de cambio de contraseña
export const sendPasswordChangeEmail = async (email, nombre, ipAddress, userAgent) => {
  const transporter = getTransporter();

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Contraseña cambiada - Glaminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Contraseña Cambiada</h2>
        <p>Hola ${nombre},</p>
        <p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Detalles del cambio:</strong></p>
          <p style="margin: 5px 0; font-size: 14px;">Fecha: ${new Date().toLocaleString('es-CO')}</p>
          ${ipAddress ? `<p style="margin: 5px 0; font-size: 14px;">IP: ${ipAddress}</p>` : ''}
        </div>
        <p>Si no realizaste este cambio, por favor contacta inmediatamente con nuestro equipo de soporte y cambia tu contraseña.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar correo de cambio de contraseña:', error);
    throw error;
  }
};

// Enviar correo de confirmación de cambio de email
export const sendEmailChangeEmail = async (oldEmail, newEmail, nombre) => {
  const transporter = getTransporter();

  const message = {
    from: process.env.EMAIL_USER,
    to: oldEmail,
    subject: 'Correo electrónico cambiado - Glaminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D1A04D;">Correo Electrónico Cambiado</h2>
        <p>Hola ${nombre},</p>
        <p>Te informamos que el correo electrónico asociado a tu cuenta ha sido cambiado.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Correo anterior:</strong> ${oldEmail}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Correo nuevo:</strong> ${newEmail}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
        </div>
        <p>Si no realizaste este cambio, por favor contacta inmediatamente con nuestro equipo de soporte.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar correo de cambio de email:', error);
    throw error;
  }
};