const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying GameNFT to Base Network");
  console.log("====================================");

  // Get the contract factory
  const GameNFT = await ethers.getContractFactory("GameNFT");
  
  console.log("📦 Deploying GameNFT contract to Base...");
  
  // Deploy the contract
  const gameNFT = await GameNFT.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await gameNFT.waitForDeployment();

  console.log("✅ GameNFT deployed successfully to Base!");
  console.log("📍 Contract Address:", await gameNFT.getAddress());
  console.log("🔗 Network:", await ethers.provider.getNetwork());
  
  // Get deployment transaction details
  const deploymentTx = gameNFT.deploymentTransaction();
  console.log("📋 Deployment Transaction:", deploymentTx.hash);
  console.log("⛽ Gas Used:", deploymentTx.gasLimit?.toString());
  console.log("💰 Gas Price:", ethers.formatUnits(deploymentTx.gasPrice || 0, "gwei"), "gwei");
  
  // Verify the contract owner
  const owner = await gameNFT.owner();
  console.log("👤 Contract Owner:", owner);
  
  // Get current token ID (should be 0 for fresh deployment)
  const currentTokenId = await gameNFT.getCurrentTokenId();
  console.log("🎯 Current Token ID:", currentTokenId.toString());
  
  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    contractAddress: await gameNFT.getAddress(),
    deploymentTx: deploymentTx.hash,
    network: network.name,
    chainId: Number(network.chainId),
    owner: owner,
    timestamp: new Date().toISOString(),
    environment: "production"
  };
  
  // Write to file for easy reference
  fs.writeFileSync(
    './base-deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to base-deployment-info.json");
  
  // Display next steps
  console.log("\n🎉 Deployment to Base Complete!");
  console.log("📝 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your .env file:");
  console.log(`   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${await gameNFT.getAddress()}`);
  console.log("3. Update your minter private key in .env:");
  console.log(`   NFT_MINTER_PRIVATE_KEY=your-base-private-key`);
  console.log("4. (Optional) Verify the contract:");
  console.log(`   npx hardhat verify --network base ${await gameNFT.getAddress()}`);
  console.log("5. Check on BaseScan:");
  console.log(`   https://basescan.org/address/${await gameNFT.getAddress()}`);
  console.log("\n⚠️  IMPORTANT:");
  console.log("- Make sure you have ETH on Base for gas fees");
  console.log("- Keep your private key secure");
  console.log("- Test on Base Sepolia testnet first if you want");
  
  return await gameNFT.getAddress();
}

// Handle errors
main()
  .then((address) => {
    console.log("\n✅ Deployment script completed successfully!");
    console.log(`📍 Contract deployed at: ${address}`);
    console.log("🎯 Ready for production NFT minting on Base!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
