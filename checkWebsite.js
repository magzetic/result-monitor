require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// ✅ Replace this with the page you want to monitor:
const URL_TO_MONITOR = 'https://updatecheckscripttest.neocities.org';
const FILE_PATH = 'last_snapshot.txt';

async function sendSMSAlert(message) {
  const recipients = [process.env.TO_SMS_1, process.env.TO_SMS_2];
  for (const number of recipients) {
    if (number) {
      try {
        const msg = await client.messages.create({
          body: message,
          from: process.env.FROM_SMS,
          to: number.trim()
        });
        console.log(`✅ SMS sent to ${number.trim()} — SID: ${msg.sid}`);
      } catch (err) {
        console.error(`❌ Failed to send SMS to ${number.trim()}:`, err.message);
      }
    }
  }
}

async function checkForChanges() {
  try {
    const response = await axios.get(URL_TO_MONITOR);
    const currentContent = response.data;

    let previousContent = '';
    if (fs.existsSync(FILE_PATH)) {
      previousContent = fs.readFileSync(FILE_PATH, 'utf-8');
    }

    if (currentContent !== previousContent) {
      console.log('🔔 Change detected!');
      await sendSMSAlert('🚨 Alert: The website content has changed!');
      fs.writeFileSync(FILE_PATH, currentContent);
    } else {
      console.log('✅ No change detected.');
    }

  } catch (error) {
    console.error('❌ Error checking website:', error.message);
  }
}

checkForChanges();
