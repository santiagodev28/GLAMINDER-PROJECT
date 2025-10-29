import nodemailer from 'nodemailer';

// Configurar el transporte de nodemailer

export const sendResetEmail = async (email, resetURL) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetURL}`
  };

  await transporter.sendMail(message);
};