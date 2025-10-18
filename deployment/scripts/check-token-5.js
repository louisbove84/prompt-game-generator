const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Token #5 Details");
  console.log("============================");

  // Get the deployed contract
  const contractAddress = "0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375";
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.attach(contractAddress);

  console.log("📍 Contract Address:", contractAddress);

  try {
    // Check Token #5 specifically
    console.log("\n🎯 Checking Token #5...");
    
    const tokenOwner = await gameNFT.ownerOf(5);
    console.log("👤 Token #5 Owner:", tokenOwner);
    
    const tokenURI = await gameNFT.tokenURI(5);
    console.log("🔗 Token #5 URI:", tokenURI);
    
    // Try to fetch the metadata
    console.log("\n📄 Fetching Token #5 Metadata...");
    
    if (tokenURI.startsWith('ipfs://')) {
      const ipfsHash = tokenURI.replace('ipfs://', '');
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      console.log("📄 Metadata URL:", metadataUrl);
      
      try {
        const response = await fetch(metadataUrl);
        if (response.ok) {
          const metadata = await response.json();
          console.log("✅ Metadata fetched successfully!");
          console.log("📝 Name:", metadata.name);
          console.log("📝 Description:", metadata.description);
          console.log("🖼️ Image:", metadata.image);
          console.log("🏷️ Attributes:", metadata.attributes?.length || 0);
        } else {
          console.log("❌ Could not fetch metadata:", response.status);
        }
      } catch (error) {
        console.log("❌ Error fetching metadata:", error.message);
      }
    } else if (tokenURI.startsWith('data:')) {
      console.log("📄 Using data URI (embedded metadata)");
      const base64Data = tokenURI.split(',')[1];
      const metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString());
      console.log("✅ Metadata extracted!");
      console.log("📝 Name:", metadata.name);
      console.log("📝 Description:", metadata.description);
      console.log("🖼️ Image:", metadata.image);
      console.log("🏷️ Attributes:", metadata.attributes?.length || 0);
    }
    
  } catch (error) {
    console.log("❌ Error checking Token #5:", error.message);
  }
}

main()
  .then(() => {
    console.log("\n✅ Token #5 check completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Check failed:");
    console.error(error);
    process.exit(1);
  });
