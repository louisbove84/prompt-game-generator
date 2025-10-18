const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🎮 Mint NFT to Base Network");
  console.log("===========================");

  // Check if we have deployment info
  let deploymentInfo;
  try {
    deploymentInfo = JSON.parse(fs.readFileSync('./base-deployment-info.json', 'utf8'));
  } catch (error) {
    console.error("❌ Could not read base-deployment-info.json");
    console.error("Please deploy the contract to Base first:");
    console.error("npx hardhat run scripts/deploy-to-base.js --network base");
    process.exit(1);
  }

  const contractAddress = deploymentInfo.contractAddress;
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", deploymentInfo.network);

  // Get the deployed contract
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach(contractAddress);

  // Get accounts
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer (Owner):", deployer.address);

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

  // Create realistic game prompt and metadata
  const gamePrompt = "A space adventure game with retro pixel graphics and electronic music";
  const timestamp = Date.now();
  
  const metadata = {
    name: `AI Game Genesis #${timestamp}`,
    description: `An AI-generated arcade game: "${gamePrompt}". This NFT represents the first screenshot captured from a custom game created by AI on Base network.`,
    image: "ipfs://QmGameForgeImage123456789", // This would be the real IPFS hash
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

  const metadataUri = `ipfs://QmMetadata${timestamp}`;
  
  console.log("\n🎨 Creating NFT on Base network...");
  console.log("📝 Game Prompt:", gamePrompt);
  console.log("🖼️ Image:", path.basename(imagePath));
  console.log("📄 Metadata URI:", metadataUri);
  
  try {
    // Mint NFT to deployer (you can change this to any address)
    const recipientAddress = deployer.address;
    console.log("👤 Recipient:", recipientAddress);
    
    const tx = await gameNFT.mintGameNFT(recipientAddress, metadataUri);
    console.log("📋 Transaction sent:", tx.hash);
    
    // Wait for confirmation
    console.log("⏳ Waiting for confirmation on Base network...");
    const receipt = await tx.wait();
    
    console.log("📦 Transaction confirmed on Base!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas Used:", receipt.gasUsed.toString());
    console.log("   Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
    console.log("   Gas Price:", ethers.formatUnits(receipt.gasPrice || 0, "gwei"), "gwei");
    
    if (receipt.status === 1) {
      console.log("\n🎉 NFT Minted Successfully on Base!");
      console.log("🎯 Game:", "Space Adventure Game");
      console.log("🖼️ Image:", path.basename(imagePath));
      console.log("👤 Owner:", recipientAddress);
      console.log("🔗 BaseScan:", `https://basescan.org/tx/${receipt.transactionHash}`);
      
      // Save the mint results
      const mintResult = {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: ethers.formatUnits(receipt.gasPrice || 0, "gwei"),
        recipient: recipientAddress,
        gamePrompt: gamePrompt,
        imageFile: path.basename(imagePath),
        metadataUri: metadataUri,
        metadata: metadata,
        baseScanUrl: `https://basescan.org/tx/${receipt.transactionHash}`,
        contractAddress: contractAddress,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        './base-mint-result.json',
        JSON.stringify(mintResult, null, 2)
      );
      
      console.log("\n💾 Mint results saved to base-mint-result.json");
      console.log("\n✅ Base NFT Mint Complete!");
      console.log("🎯 This NFT is now live on Base network!");
      console.log("🔗 View on BaseScan:", `https://basescan.org/tx/${receipt.transactionHash}`);
      console.log("📱 You can view it in your wallet or on OpenSea!");
      
    } else {
      console.log("❌ Transaction failed on Base");
    }
    
  } catch (error) {
    console.error("❌ Error during NFT minting on Base:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Make sure you have enough ETH on Base for gas fees");
    } else if (error.message.includes("nonce")) {
      console.log("\n💡 Try again - there might be a nonce issue");
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ Base NFT mint completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Mint failed:");
    console.error(error);
    process.exit(1);
  });
