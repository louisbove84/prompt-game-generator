const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config({ path: '../.env.local' });

async function uploadToIPFS() {
  console.log("📤 Uploading to IPFS");
  console.log("===================");

  // Check if Pinata credentials are available
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;
  
  if (!pinataApiKey || !pinataSecretKey) {
    console.log("❌ Pinata credentials not found!");
    console.log("Please add to your .env.local:");
    console.log("PINATA_API_KEY=your-pinata-api-key");
    console.log("PINATA_SECRET_KEY=your-pinata-secret-key");
    return null;
  }

  const imagePath = path.join(__dirname, '../../public/images/gameForge.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.log("❌ Image file not found:", imagePath);
    return null;
  }

  console.log("🖼️ Image path:", imagePath);
  console.log("📁 Image size:", fs.statSync(imagePath).size, "bytes");

  try {
    // Upload image to IPFS
    console.log("\n📤 Step 1: Uploading image to IPFS...");
    
    const imageFormData = new FormData();
    const imageStream = fs.createReadStream(imagePath);
    
    imageFormData.append('file', imageStream, 'gameForge.jpg');
    imageFormData.append('pinataMetadata', JSON.stringify({
      name: 'gameForge.jpg',
    }));
    
    const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: imageFormData,
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Image upload failed: ${imageResponse.status}`);
    }
    
    const imageData = await imageResponse.json();
    const imageIpfsHash = imageData.IpfsHash;
    console.log("✅ Image uploaded to IPFS:", imageIpfsHash);
    console.log("🔗 Image URL: https://gateway.pinata.cloud/ipfs/" + imageIpfsHash);
    
    // Create metadata
    console.log("\n📄 Step 2: Creating metadata...");
    
    const timestamp = Date.now();
    const metadata = {
      name: `AI Game Genesis #${timestamp}`,
      description: `An AI-generated arcade game: "A space adventure game with retro pixel graphics and electronic music". This NFT represents the first screenshot captured from a custom game created by AI on Base network.`,
      image: `ipfs://${imageIpfsHash}`,
      external_url: "https://your-app.com",
      attributes: [
        {
          trait_type: 'Generation Type',
          value: 'AI Generated',
        },
        {
          trait_type: 'Game Prompt',
          value: 'A space adventure game with retro pixel graphics and electronic music',
        },
        {
          trait_type: 'Network',
          value: 'Base',
        },
        {
          trait_type: 'Environment',
          value: 'Production',
        },
        {
          trait_type: 'Timestamp',
          value: new Date(timestamp).toISOString(),
        },
      ],
    };
    
    console.log("📄 Metadata created:", JSON.stringify(metadata, null, 2));
    
    // Upload metadata to IPFS
    console.log("\n📤 Step 3: Uploading metadata to IPFS...");
    
    const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `AI Game Genesis #${timestamp} Metadata`,
        },
      }),
    });
    
    if (!metadataResponse.ok) {
      throw new Error(`Metadata upload failed: ${metadataResponse.status}`);
    }
    
    const metadataData = await metadataResponse.json();
    const metadataIpfsHash = metadataData.IpfsHash;
    console.log("✅ Metadata uploaded to IPFS:", metadataIpfsHash);
    console.log("🔗 Metadata URL: https://gateway.pinata.cloud/ipfs/" + metadataIpfsHash);
    
    // Save results
    const results = {
      imageIpfsHash: imageIpfsHash,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
      metadataIpfsHash: metadataIpfsHash,
      metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
      metadataUri: `ipfs://${metadataIpfsHash}`,
      metadata: metadata,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      './ipfs-upload-results.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log("\n💾 Results saved to ipfs-upload-results.json");
    console.log("\n🎉 IPFS Upload Complete!");
    console.log("📄 Use this metadata URI for your NFT:");
    console.log(`   ipfs://${metadataIpfsHash}`);
    
    return results;
    
  } catch (error) {
    console.error("❌ IPFS upload failed:", error.message);
    return null;
  }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  console.log("❌ Fetch is not available. Installing node-fetch...");
  const { default: fetch } = require('node-fetch');
  global.fetch = fetch;
}

uploadToIPFS()
  .then((results) => {
    if (results) {
      console.log("\n✅ IPFS upload completed successfully!");
      console.log("🎯 Ready to mint NFT with real IPFS metadata!");
    } else {
      console.log("\n❌ IPFS upload failed!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload failed:");
    console.error(error);
    process.exit(1);
  });
