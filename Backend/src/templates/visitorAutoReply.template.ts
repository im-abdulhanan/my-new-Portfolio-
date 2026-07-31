export const getVisitorAutoReplyHtml = (fullName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Inquiry Confirmation</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; color: #e5e5e5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0e0e0e; border: 1px solid #222; border-radius: 16px; padding: 32px; }
    .header { border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 24px; }
    .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; text-transform: uppercase; }
    .accent { color: #990000; }
    .content { font-size: 15px; color: #cccccc; line-height: 1.6; }
    .signature { margin-top: 32px; border-top: 1px solid #222; padding-top: 20px; }
    .name { font-size: 16px; font-weight: 700; color: #ffffff; }
    .role { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">INQUIRY <span class="accent">RECEIVED</span></h1>
    </div>
    
    <div class="content">
      <p>Hi ${fullName},</p>
      <p>Thank you for reaching out.</p>
      <p>I have received your project inquiry and will review your details carefully. You can expect a response from me within <strong>24–48 hours</strong>.</p>
      <p>Looking forward to discussing your vision.</p>
    </div>

    <div class="signature">
      <div class="name">Abdul Hanan</div>
      <div class="role">Senior Creative Engineer & Full Stack Developer</div>
    </div>
  </div>
</body>
</html>
`
}
