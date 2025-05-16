// Import Sendinblue API SDK (now Brevo)
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure API key authorization
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Create an instance of TransactionalEmailsApi
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Pahal Event Team';

/**
 * Sends an acceptance email using Brevo with detailed event information.
 * @param {object} recipientInfo - Information about the recipient.
 * @param {string} recipientInfo.email - Recipient's email address.
 * @param {string} recipientInfo.name - Recipient's name (e.g., team leader's name).
 * @param {string} recipientInfo.teamName - The name of the team.
 * @param {object} eventInfo - Detailed information about the event.
 * @param {string} eventInfo.title - The title of the event.
 * @param {Date|string} eventInfo.date - The date of the event.
 * @param {string} [eventInfo.time] - The time of the event (optional).
 * @param {string} [eventInfo.venue] - The venue of the event (optional).
 * @param {string} [eventInfo.detailsLink] - A link to the event details page (optional).
 */
const sendAcceptanceEmail = async (recipientInfo, eventInfo) => {
  if (!process.env.BREVO_API_KEY) {
    console.error('Brevo API Key is not set. Email not sent.');
    return;
  }
  
  if (!SENDER_EMAIL || !SENDER_EMAIL.includes('@')) {
    console.error('Brevo Sender Email (BREVO_SENDER_EMAIL) is not configured correctly in environment variables. Email not sent.');
    return;
  }
    // Create a new SendSmtpEmail instance
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  let formattedEventDate = '';
  if (eventInfo.date) {
    try {
      // If eventInfo.date is already a string (which it likely is from your Event model), 
      // use it directly or try to format it
      formattedEventDate = eventInfo.date;
      
      // Only try to convert to Date if it's not already well formatted
      if (eventInfo.date.indexOf('/') === -1 && eventInfo.date.indexOf('-') === -1) {
        formattedEventDate = new Date(eventInfo.date).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }
    } catch (e) {
      console.warn('Could not format event date:', eventInfo.date);
      formattedEventDate = eventInfo.date.toString(); // fallback
    }
  }

  const subject = `Registration Accepted for ${eventInfo.title}!`;
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 20px auto; }
          .header { font-size: 24px; color: #4CAF50; margin-bottom: 20px; }
          .content p { margin-bottom: 10px; }
          .event-details { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 15px; }
          .event-details strong { color: #555; }
          .footer { margin-top: 20px; font-size: 0.9em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">          <div class="header">Registration Confirmed!</div>
          <div class="content">
            <p>Dear ${recipientInfo.name || recipientInfo.teamName || 'Participant'},</p>
            <p>Congratulations! Your team "<strong>${recipientInfo.teamName}</strong>" has been successfully registered and accepted for the event "<strong>${eventInfo.title}</strong>".</p>
            
            <div class="event-details">
              <p><strong>Team Name:</strong> ${recipientInfo.teamName}</p>
              <p><strong>Team Leader:</strong> ${recipientInfo.name || 'Not specified'}</p>
              <p><strong>Event:</strong> ${eventInfo.title}</p>
              ${formattedEventDate ? `<p><strong>Date:</strong> ${formattedEventDate}</p>` : ''}
              ${eventInfo.time ? `<p><strong>Time:</strong> ${eventInfo.time}</p>` : ''}
              ${eventInfo.venue ? `<p><strong>Venue:</strong> ${eventInfo.venue}</p>` : ''}
            </div>

            <p>We are excited to have your team participate!</p>
            ${eventInfo.detailsLink ? `<p>For more details about the event, please visit: <a href="${eventInfo.detailsLink}">${eventInfo.detailsLink}</a></p>` : ''}
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br/>The ${SENDER_NAME}</p>
          </div>
        </div>
      </body>
    </html>`;

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: recipientInfo.email, name: recipientInfo.name || recipientInfo.teamName }];
  
  try {
    // API client is already configured at the top of the file
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Brevo acceptance email sent successfully to ${recipientInfo.email}. Message ID: ${data.messageId || JSON.stringify(data)}`);
  } catch (error) {
    console.error(`Error sending Brevo acceptance email to ${recipientInfo.email}:`, error.response ? error.response.body || error.response.text : error.message);
  }
};

module.exports = { sendAcceptanceEmail };
