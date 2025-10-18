const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🎮 Mint NFT with Public Metadata");
  console.log("=================================");

  // Get the deployed contract
  const contractAddress = "0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375";
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach(contractAddress);

  console.log("📍 Contract Address:", contractAddress);

  // Get accounts
  const [owner] = await ethers.getSigners();
  console.log("👤 Owner:", owner.address);

  // Create metadata with a public image URL
  const gamePrompt = "A space adventure game with retro pixel graphics and electronic music";
  const timestamp = Date.now();
  
  // Use a public image URL that works
  const publicImageUrl = "https://gateway.pinata.cloud/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"; // This is a real working image
  
  const metadata = {
    name: `AI Game Genesis #${timestamp}`,
    description: `An AI-generated arcade game: "${gamePrompt}". This NFT represents the first screenshot captured from a custom game created by AI on Base network.`,
    image: publicImageUrl,
    external_url: "https://your-app.com",
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

  // For now, we'll use a data URI with the metadata
  const metadataJson = JSON.stringify(metadata);
  const dataUri = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;
  
  console.log("\n🎨 Creating NFT with public metadata...");
  console.log("📝 Game Prompt:", gamePrompt);
  console.log("🖼️ Image URL:", publicImageUrl);
  console.log("📄 Metadata URI:", dataUri.substring(0, 50) + "...");
  
  try {
    // Mint NFT to owner
    const recipientAddress = owner.address;
    console.log("👤 Recipient:", recipientAddress);
    
    const tx = await gameNFT.mintGameNFT(recipientAddress, dataUri);
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
      console.log("🖼️ Image URL:", publicImageUrl);
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
        imageUrl: publicImageUrl,
        metadataUri: dataUri,
        metadata: metadata,
        baseScanUrl: `https://basescan.org/tx/${receipt.transactionHash}`,
        contractAddress: contractAddress,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        './public-metadata-mint-result.json',
        JSON.stringify(mintResult, null, 2)
      );
      
      console.log("\n💾 Mint results saved to public-metadata-mint-result.json");
      console.log("\n✅ Public Metadata NFT Mint Complete!");
      console.log("🎯 This NFT should now show the image!");
      console.log("🔗 View on BaseScan:", `https://basescan.org/tx/${receipt.transactionHash}`);
      console.log("📱 Check your wallet - you should see the NFT image now!");
      
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
    console.log("\n✅ Public metadata NFT mint completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Mint failed:");
    console.error(error);
    process.exit(1);
  });
