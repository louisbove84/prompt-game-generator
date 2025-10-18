const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🎮 Mint NFT with Your Real Image");
  console.log("=================================");

  // Get the deployed contract
  const contractAddress = "0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375";
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach(contractAddress);

  console.log("📍 Contract Address:", contractAddress);

  // Get accounts
  const [owner] = await ethers.getSigners();
  console.log("👤 Owner:", owner.address);

  // Read the upload results
  let uploadResults;
  try {
    uploadResults = JSON.parse(fs.readFileSync('./pinata-upload-results.json', 'utf8'));
  } catch (error) {
    console.error("❌ Could not read pinata-upload-results.json");
    console.error("Please run the upload script first!");
    process.exit(1);
  }

  const metadataUri = uploadResults.metadataUri;
  const imageUrl = uploadResults.imageUrl;
  
  console.log("\n🎨 Creating NFT with your real image...");
  console.log("🖼️ Your Image URL:", imageUrl);
  console.log("📄 Metadata URI:", metadataUri);
  
  try {
    // Mint NFT to owner
    const recipientAddress = owner.address;
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
      console.log("\n🎉 NFT Minted Successfully with Your Real Image!");
      console.log("🎯 Game:", "Space Adventure Game");
      console.log("🖼️ Your Image:", imageUrl);
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
        gamePrompt: "A space adventure game with retro pixel graphics and electronic music",
        imageUrl: imageUrl,
        metadataUri: metadataUri,
        metadata: uploadResults.metadata,
        baseScanUrl: `https://basescan.org/tx/${receipt.transactionHash}`,
        contractAddress: contractAddress,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        './real-image-mint-result.json',
        JSON.stringify(mintResult, null, 2)
      );
      
      console.log("\n💾 Mint results saved to real-image-mint-result.json");
      console.log("\n✅ Real Image NFT Mint Complete!");
      console.log("🎯 This NFT now uses YOUR actual gameForge.jpg image!");
      console.log("🔗 View on BaseScan:", `https://basescan.org/tx/${receipt.transactionHash}`);
      console.log("📱 Check your wallet - you should see YOUR image now!");
      console.log("🖼️ Your Image:", imageUrl);
      
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
    console.log("\n✅ Real image NFT mint completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Mint failed:");
    console.error(error);
    process.exit(1);
  });
