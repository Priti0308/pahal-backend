// This file is used to test the Brevo email functionality
require('dotenv').config();
const { sendAcceptanceEmail } = require('./utils/emailService');

// Test sending an email
async function testEmail() {
  console.log('Starting email test...');
  console.log('BREVO_API_KEY configured:', !!process.env.BREVO_API_KEY);
  console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL);
  
  const recipientInfo = {
    email: 'test@example.com', // Replace with your actual test email
    name: 'Test User',
    teamName: 'Test Team'
  };
  
  const eventInfo = {
    title: 'Test Event',
    date: new Date().toLocaleDateString(),
    time: '10:00 AM',
    venue: 'Test Venue'
  };
  
  try {
    console.log('Sending test email...');
    await sendAcceptanceEmail(recipientInfo, eventInfo);
    console.log('Email test completed');
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail().then(() => console.log('Test complete'));
