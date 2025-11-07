import nodemailer from 'nodemailer';

// Configurar el transporte de nodemailer
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
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