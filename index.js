const axios = require("axios");
const fs = require("fs");

const targetUrl = "https://updatecheckscripttest.neocities.org/";  // 👈 replace with the site you want to monitor
const lastFile = "last_content.txt";

async function checkWebsite() {
  try {
    const res = await axios.get(targetUrl);
    const current = res.data;
    let previous = "";

    if (fs.existsSync(lastFile)) {
      previous = fs.readFileSync(lastFile, "utf-8");
    }

    if (previous !== current) {
      console.log("🔔 Website changed!");
      await sendWhatsAppAlert("🚨 Website has changed!");
      fs.writeFileSync(lastFile, current);
    } else {
      console.log("✅ No changes detected.");
    }
  } catch (err) {
    console.error("❌ Error checking website:", err.message);
  }
}

async function sendWhatsAppAlert(message) {
  const phone = process.env.PHONE;     // from Render
  const apiKey = process.env.API_KEY;  // from CallMeBot
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  
  try {
    await axios.get(url);
    console.log("📲 WhatsApp alert sent.");
  } catch (err) {
    console.error("❌ Failed to send WhatsApp alert:", err.message);
  }
}

checkWebsite();
