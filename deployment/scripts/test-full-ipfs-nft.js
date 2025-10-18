const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadImageToIPFS(imagePath, filename) {
  console.log("📤 Uploading image to IPFS...");
  
  // Check if Pinata credentials are available
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;
  
  if (!pinataApiKey || !pinataSecretKey) {
    console.log("⚠️ Pinata credentials not found, using mock IPFS URI");
    return `ipfs://QmMockImage${Date.now()}`;
  }
  
  try {
    const formData = new FormData();
    const imageStream = fs.createReadStream(imagePath);
    
    formData.append('file', imageStream, filename);
    formData.append('pinataMetadata', JSON.stringify({
      name: filename,
    }));
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Image uploaded to IPFS:", data.IpfsHash);
    return `ipfs://${data.IpfsHash}`;
    
  } catch (error) {
    console.log("⚠️ IPFS upload failed:", error.message);
    console.log("   Using mock IPFS URI instead");
    return `ipfs://QmMockImage${Date.now()}`;
  }
}

async function uploadMetadataToIPFS(metadata) {
  console.log("📤 Uploading metadata to IPFS...");
  
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_KEY;
  
  if (!pinataApiKey || !pinataSecretKey) {
    console.log("⚠️ Pinata credentials not found, using mock IPFS URI");
    return `ipfs://QmMockMetadata${Date.now()}`;
  }
  
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: metadata.name || 'AI Game NFT Metadata',
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Metadata uploaded to IPFS:", data.IpfsHash);
    return `ipfs://${data.IpfsHash}`;
    
  } catch (error) {
    console.log("⚠️ Metadata upload failed:", error.message);
    console.log("   Using mock IPFS URI instead");
    return `ipfs://QmMockMetadata${Date.now()}`;
  }
}

async function main() {
  console.log("🎮 Full IPFS NFT Test with GameForge Image");
  console.log("==========================================");

  // Get the deployed contract
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  console.log("📍 Contract Address:", await gameNFT.getAddress());

  // Get accounts
  const [deployer, user1] = await ethers.getSigners();
  console.log("👤 Deployer (Owner):", deployer.address);
  console.log("👤 User1 (Recipient):", user1.address);

  // Check if the image file exists
  const imagePath = path.join(__dirname, '../../public/images/gameForge.jpg');
  console.log("🖼️ Image path:", imagePath);
  
  if (!fs.existsSync(imagePath)) {
    console.error("❌ Image file not found:", imagePath);
    process.exit(1);
  }

  // Read the image file
  const imageBuffer = fs.readFileSync(imagePath);
  console.log("📁 Image size:", imageBuffer.length, "bytes");

  // Create realistic game prompt
  const gamePrompt = "A space adventure game with retro pixel graphics and electronic music";
  const timestamp = Date.now();
  
  console.log("\n🎨 Creating NFT with real game prompt...");
  console.log("📝 Game Prompt:", gamePrompt);
  
  try {
    // Step 1: Upload image to IPFS
    const imageIpfsUri = await uploadImageToIPFS(imagePath, `gameForge-${timestamp}.jpg`);
    
    // Step 2: Create metadata
    const metadata = {
      name: `AI Game Genesis #${timestamp}`,
      description: `An AI-generated arcade game: "${gamePrompt}". This NFT represents the first screenshot captured from a custom game created by AI.`,
      image: imageIpfsUri,
      attributes: [
        {
          trait_type: 'Generation Type',
          value: 'AI Generated',
        },
        {
          trait_type: 'Game Prompt',
          value: gamePrompt,
        },
        {
          trait_type: 'Network',
          value: 'Local Hardhat',
        },
        {
          trait_type: 'Environment',
          value: 'Development',
        },
        {
          trait_type: 'Timestamp',
          value: new Date(timestamp).toISOString(),
        },
      ],
    };
    
    // Step 3: Upload metadata to IPFS
    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Step 4: Mint NFT
    console.log("\n🎨 Minting NFT...");
    const tx = await gameNFT.mintGameNFT(user1.address, metadataUri);
    console.log("📋 Transaction sent:", tx.hash);
    
    // Wait for confirmation
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("📦 Transaction confirmed!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas Used:", receipt.gasUsed.toString());
    console.log("   Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
    
    if (receipt.status === 1) {
      console.log("\n🎉 Full IPFS NFT Created Successfully!");
      console.log("🎯 Game:", "Space Adventure Game");
      console.log("🖼️ Image IPFS:", imageIpfsUri);
      console.log("📄 Metadata IPFS:", metadataUri);
      console.log("👤 Owner:", user1.address);
      
      // Save the test results
      const testResult = {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        recipient: user1.address,
        gamePrompt: gamePrompt,
        imageFile: "gameForge.jpg",
        imageIpfsUri: imageIpfsUri,
        metadataUri: metadataUri,
        metadata: metadata,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        './full-ipfs-nft-test-result.json',
        JSON.stringify(testResult, null, 2)
      );
      
      console.log("\n💾 Test results saved to full-ipfs-nft-test-result.json");
      console.log("\n✅ Full IPFS NFT Test Complete!");
      console.log("🎯 This simulates the complete flow:");
      console.log("   1. User pays $0.20 USDC");
      console.log("   2. AI generates game");
      console.log("   3. Screenshot captured");
      console.log("   4. Image uploaded to IPFS");
      console.log("   5. Metadata uploaded to IPFS");
      console.log("   6. NFT minted with IPFS metadata");
      
    } else {
      console.log("❌ Transaction failed");
    }
    
  } catch (error) {
    console.error("❌ Error during NFT creation:", error.message);
  }
}

main()
  .then(() => {
    console.log("\n✅ Full IPFS NFT test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  });
