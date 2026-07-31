import { ContactPayload } from '../types/contact.types.js'

export const getAdminNotificationHtml = (data: ContactPayload): string => {
  const submissionTime = new Date().toUTCString()
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Inquiry</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; color: #e5e5e5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0e0e0e; border: 1px solid #222; border-radius: 16px; padding: 32px; }
    .header { border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 700; color: #ffffff; margin: 0; text-transform: uppercase; tracking: 1px; }
    .accent { color: #990000; }
    .field-group { margin-bottom: 18px; }
    .label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1.5px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #ffffff; line-height: 1.5; }
    .box { background-color: #141414; border: 1px solid #222; border-radius: 12px; padding: 16px; margin-top: 20px; }
    .footer { margin-top: 32px; font-size: 11px; color: #555; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">🚀 New Project <span class="accent">Inquiry</span></h1>
    </div>
    
    <div class="field-group">
      <div class="label">Full Name</div>
      <div class="value">${data.fullName}</div>
    </div>

    <div class="field-group">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:${data.email}" style="color: #990000; text-decoration: none;">${data.email}</a></div>
    </div>

    ${data.company ? `
    <div class="field-group">
      <div class="label">Company</div>
      <div class="value">${data.company}</div>
    </div>` : ''}

    <div class="field-group">
      <div class="label">Project Type</div>
      <div class="value">${data.projectType}</div>
    </div>

    ${data.budget ? `
    <div class="field-group">
      <div class="label">Estimated Budget</div>
      <div class="value">${data.budget}</div>
    </div>` : ''}

    <div class="field-group">
      <div class="label">Project Details</div>
      <div class="box value">${data.projectDetails.replace(/\n/g, '<br/>')}</div>
    </div>

    <div class="footer">
      Submitted at: ${submissionTime} • Abdul Hanan Portfolio Backend
    </div>
  </div>
</body>
</html>
`
}
