import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Check SMTP Configurations
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
      });

      return res.status(200).json({ success: true, message: 'Email sent via SMTP', messageId: info.messageId });
    } catch (error) {
      console.error('SMTP sending error:', error);
      return res.status(500).json({ error: 'SMTP Error: ' + error.message });
    }
  }

  // 2. Check Resend API configurations
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || 'onboarding@resend.dev';

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: resendFrom,
          to,
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: data.message || 'Failed to send email' });
      }

      return res.status(200).json({ success: true, message: 'Email sent via Resend API', data });
    } catch (error) {
      console.error('Resend sending error:', error);
      return res.status(500).json({ error: 'Resend Error: ' + error.message });
    }
  }

  // 3. Neither configured
  return res.status(400).json({ 
    error: 'E-posta gönderim ayarları eksik. Lütfen SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS veya RESEND_API_KEY değişkenlerini tanımlayın.' 
  });
}
