require('dotenv').config();
const twilio = require('twilio');

// Create Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// List of recipients from environment variables
const recipients = [
  process.env.TO_SMS_1,
  process.env.TO_SMS_2,
  // Add more like process.env.TO_SMS_3 if needed
];

// Message to send
const alertMessage = '🚨 Alert: Website content has changed!';

// Send to each number
recipients.forEach((number) => {
  if (number) {
    client.messages
      .create({
        body: alertMessage,
        from: process.env.FROM_SMS,
        to: number.trim(),
      })
      .then((msg) =>
        console.log(`✅ SMS sent to ${number.trim()} — SID: ${msg.sid}`)
      )
      .catch((err) =>
        console.error(`❌ Failed to send to ${number.trim()}:`, err.message)
      );
  }
});
