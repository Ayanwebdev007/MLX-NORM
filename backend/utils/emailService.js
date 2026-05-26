import { Resend } from 'resend';

// Lazy initialization of Resend client to prevent race conditions during ES6 module hoisting
let resendClient = null;
let isInitialized = false;

const initializeResend = () => {
  if (isInitialized) return;
  
  const apiKey = process.env.RESEND_API_KEY;
  const isApiKeyConfigured = apiKey && apiKey !== 're_your_api_key_here' && apiKey.startsWith('re_');
  
  if (isApiKeyConfigured) {
    resendClient = new Resend(apiKey);
  }
  
  isInitialized = true;
};

/**
 * Sends a submission success email to the owner of the application.
 * Falls back to console logging if Resend is not configured.
 * 
 * @param {string} toEmail - The email address of the owner.
 * @param {string} registrationNumber - The 16-digit unique registration number.
 * @param {string} ownerName - The name of the owner.
 */
export const sendSubmissionSuccessEmail = async (toEmail, registrationNumber, ownerName) => {
  initializeResend();
  const senderEmail = process.env.ADMIN_EMAIL_SENDER || 'info@mlxdirect.com';
  const subject = `Application Submitted Successfully - Reg No: ${registrationNumber}`;
  
  // Premium HTML Email Template matching the green and slate branding
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Application Submitted Successfully</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 30px 10px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          }
          .header {
            background: linear-gradient(135deg, #16a34a, #15803d);
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
            color: #0f172a;
          }
          .message {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 24px;
          }
          .reg-box {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 28px 0;
          }
          .reg-box-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #166534;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .reg-number {
            font-family: "Courier New", Courier, monospace;
            font-size: 22px;
            font-weight: 700;
            color: #15803d;
            letter-spacing: 0.15em;
          }
          .status-badge {
            display: inline-block;
            background-color: #fef3c7;
            border: 1px solid #fde68a;
            color: #92400e;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 4px 10px;
            border-radius: 9999px;
            margin-top: 6px;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>MLX NORM Portal</h1>
              <p>Compliance & Verification Authority</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${ownerName || 'Applicant'},</div>
              <div class="message">
                We are pleased to inform you that your application for the <strong>MLX NORM Compliance Registration</strong> has been successfully received and submitted for review.
              </div>
              
              <div class="reg-box">
                <div class="reg-box-label">Your Unique Registration Number</div>
                <div class="reg-number">${registrationNumber}</div>
                <div class="status-badge">Status: Pending Review</div>
              </div>
              
              <div class="message">
                Our verification officers will now inspect your submitted article descriptions, owner credentials, and scientist specifications. You will receive further updates via email once your application undergoes review.
              </div>
              <div class="message" style="margin-bottom: 0;">
                If you have any questions or need to make corrections, please access the customer portal using your registered credentials.
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification. Please do not reply directly to this email.</p>
              <p>&copy; ${new Date().getFullYear()} MLX NORM Portal. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resendClient) {
    console.log('\n=================== RESEND DEV FALLBACK LOG ===================');
    console.log(`[Email Mock] Success email triggered.`);
    console.log(`[Recipient]: ${toEmail}`);
    console.log(`[Sender]: ${senderEmail}`);
    console.log(`[Subject]: ${subject}`);
    console.log(`[Registration Number]: ${registrationNumber}`);
    console.log(`[Owner Name]: ${ownerName}`);
    console.log('---------------------------------------------------------------');
    console.log('NOTE: Configure a valid RESEND_API_KEY in backend/.env to send real emails.');
    console.log('===============================================================\n');
    return { success: true, mocked: true };
  }

  try {
    const data = await resendClient.emails.send({
      from: `MLX NORM Portal <${senderEmail}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    
    console.log(`[Resend Success] Email sent successfully to ${toEmail}. ID: ${data.id || (data.data && data.data.id)}`);
    return { success: true, mocked: false, data };
  } catch (error) {
    console.error(`[Resend Error] Failed to send email to ${toEmail}:`, error.message || error);
    throw error;
  }
};
