require('dotenv').config({ path: '../.env.local' });

console.log("🧪 Testing Pinata Credentials");
console.log("=============================");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_SECRET_KEY;

console.log("📋 API Key:", pinataApiKey ? pinataApiKey.substring(0, 10) + "..." : "Not found");
console.log("📋 Secret Key:", pinataSecretKey ? pinataSecretKey.substring(0, 10) + "..." : "Not found");

if (!pinataApiKey || !pinataSecretKey) {
  console.log("❌ Pinata credentials not found!");
  console.log("Please add to your .env.local:");
  console.log("PINATA_API_KEY=your-pinata-api-key");
  console.log("PINATA_SECRET_KEY=your-pinata-secret-key");
  process.exit(1);
}

console.log("✅ Pinata credentials found!");

// Test the credentials by making a simple API call
const testPinata = async () => {
  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Pinata authentication successful!");
      console.log("📊 Response:", data);
    } else {
      console.log("❌ Pinata authentication failed!");
      console.log("Status:", response.status);
      console.log("Error:", await response.text());
    }
  } catch (error) {
    console.log("❌ Error testing Pinata:", error.message);
  }
};

testPinata();
