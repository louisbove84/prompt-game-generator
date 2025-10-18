require('dotenv').config({ path: '../.env.local' });
const fs = require('fs');
const path = require('path');

async function uploadToPinata() {
  console.log("📤 Simple Pinata Upload");
  console.log("=======================");

  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;

  if (!pinataApiKey || !pinataSecretKey) {
    console.log("❌ Pinata credentials not found!");
    return;
  }

  const imagePath = path.join(__dirname, '../../public/images/gameForge.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.log("❌ Image file not found:", imagePath);
    return;
  }

  console.log("🖼️ Image path:", imagePath);
  console.log("📁 Image size:", fs.statSync(imagePath).size, "bytes");

  try {
    // Read the image file as buffer
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Create form data manually
    const boundary = '----formdata-' + Math.random().toString(16);
    const formData = [];
    
    // Add file
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="file"; filename="gameForge.jpg"');
    formData.push('Content-Type: image/jpeg');
    formData.push('');
    formData.push(imageBuffer.toString('binary'));
    
    // Add pinata metadata
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="pinataMetadata"');
    formData.push('Content-Type: application/json');
    formData.push('');
    formData.push(JSON.stringify({
      name: 'gameForge.jpg',
    }));
    
    formData.push(`--${boundary}--`);
    
    const body = formData.join('\r\n');
    
    console.log("\n📤 Uploading image to Pinata...");
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: Buffer.from(body, 'binary'),
    });
    
    console.log("📊 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Upload failed:", errorText);
      return;
    }
    
    const data = await response.json();
    const imageIpfsHash = data.IpfsHash;
    
    console.log("✅ Image uploaded to IPFS:", imageIpfsHash);
    console.log("🔗 Image URL: https://gateway.pinata.cloud/ipfs/" + imageIpfsHash);
    
    // Create metadata
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
    
    console.log("\n📄 Creating metadata...");
    console.log("📄 Metadata:", JSON.stringify(metadata, null, 2));
    
    // Upload metadata to Pinata
    console.log("\n📤 Uploading metadata to Pinata...");
    
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
      const errorText = await metadataResponse.text();
      console.log("❌ Metadata upload failed:", errorText);
      return;
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
      './pinata-upload-results.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log("\n💾 Results saved to pinata-upload-results.json");
    console.log("\n🎉 Pinata Upload Complete!");
    console.log("📄 Use this metadata URI for your NFT:");
    console.log(`   ipfs://${metadataIpfsHash}`);
    
    return results;
    
  } catch (error) {
    console.error("❌ Pinata upload failed:", error.message);
    return null;
  }
}

uploadToPinata()
  .then((results) => {
    if (results) {
      console.log("\n✅ Pinata upload completed successfully!");
      console.log("🎯 Ready to mint NFT with real IPFS metadata!");
    } else {
      console.log("\n❌ Pinata upload failed!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload failed:");
    console.error(error);
    process.exit(1);
  });
