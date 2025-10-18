const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing local NFT minting...");

  // Get the deployed contract
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  console.log("📍 Contract Address:", await gameNFT.getAddress());

  // Get the default account (Hardhat account #0)
  const [deployer, user1] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User1:", user1.address);

  // Test metadata URI
  const testMetadataUri = "ipfs://QmTestMetadata123456789";
  
  console.log("🎨 Minting test NFT...");
  
  try {
    // Mint NFT to user1
    const tx = await gameNFT.mintGameNFT(user1.address, testMetadataUri);
    console.log("📋 Transaction:", tx.hash);
    
    // Wait for confirmation
    await tx.wait();
    
    // Get the token ID
    const currentTokenId = await gameNFT.getCurrentTokenId();
    console.log("🎯 Current Token ID:", currentTokenId.toString());
    
    // Check token owner
    const tokenOwner = await gameNFT.ownerOf(currentTokenId);
    console.log("👤 Token Owner:", tokenOwner);
    
    // Check token URI
    const tokenURI = await gameNFT.tokenURI(currentTokenId);
    console.log("🔗 Token URI:", tokenURI);
    
    console.log("✅ NFT minting test successful!");
    
  } catch (error) {
    console.error("❌ NFT minting failed:", error.message);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Local NFT test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  });
