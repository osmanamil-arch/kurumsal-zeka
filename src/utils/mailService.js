export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'E-posta gönderilemedi.');
    }
    return result;
  } catch (error) {
    console.error('Email sending helper error:', error);
    throw error;
  }
};
