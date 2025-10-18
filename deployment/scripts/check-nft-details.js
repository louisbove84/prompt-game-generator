const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking NFT Details on Base Network");
  console.log("=======================================");

  // Get the deployed contract
  const contractAddress = "0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375";
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach(contractAddress);

  console.log("📍 Contract Address:", contractAddress);

  // Get contract details
  const [owner] = await ethers.getSigners();
  console.log("👤 Contract Owner:", owner.address);

  try {
    // Check if token 1 exists
    console.log("\n🎯 Checking Token #1...");
    
    const tokenOwner = await gameNFT.ownerOf(1);
    console.log("👤 Token #1 Owner:", tokenOwner);
    
    const tokenURI = await gameNFT.tokenURI(1);
    console.log("🔗 Token #1 URI:", tokenURI);
    
    // Check contract name and symbol
    const name = await gameNFT.name();
    const symbol = await gameNFT.symbol();
    console.log("📝 Contract Name:", name);
    console.log("🏷️ Contract Symbol:", symbol);
    
    // Check total supply (current token ID)
    const currentTokenId = await gameNFT.getCurrentTokenId();
    console.log("🎯 Current Token ID:", currentTokenId.toString());
    
    // Check owner's balance
    const balance = await gameNFT.balanceOf(owner.address);
    console.log("💰 Owner Balance:", balance.toString());
    
    console.log("\n✅ NFT Details Retrieved Successfully!");
    console.log("🎯 The NFT exists and is properly minted!");
    
  } catch (error) {
    console.log("❌ Error checking NFT details:", error.message);
    
    if (error.message.includes("ERC721: invalid token ID")) {
      console.log("💡 Token #1 doesn't exist yet. Let's check what tokens do exist.");
      
      // Check current token ID
      try {
        const currentTokenId = await gameNFT.getCurrentTokenId();
        console.log("🎯 Current Token ID:", currentTokenId.toString());
        
        if (currentTokenId > 0) {
          const tokenOwner = await gameNFT.ownerOf(currentTokenId);
          console.log(`👤 Token #${currentTokenId} Owner:`, tokenOwner);
          
          const tokenURI = await gameNFT.tokenURI(currentTokenId);
          console.log(`🔗 Token #${currentTokenId} URI:`, tokenURI);
        }
      } catch (error2) {
        console.log("❌ Could not get current token ID:", error2.message);
      }
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ NFT check completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Check failed:");
    console.error(error);
    process.exit(1);
  });
