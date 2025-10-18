const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Starting GameNFT contract deployment...");

  // Get the contract factory
  const GameNFT = await ethers.getContractFactory("GameNFT");
  
  console.log("📦 Deploying GameNFT contract...");
  
  // Deploy the contract
  const gameNFT = await GameNFT.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await gameNFT.waitForDeployment();

  console.log("✅ GameNFT deployed successfully!");
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
  
  // Get current token ID (should be 1 for first mint)
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
    timestamp: new Date().toISOString()
  };
  
  // Write to file for easy reference
  fs.writeFileSync(
    './deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to deployment-info.json");
  
  // Display next steps
  console.log("\n🎉 Deployment Complete!");
  console.log("📝 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your .env file:");
  console.log(`   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${await gameNFT.getAddress()}`);
  console.log("3. (Optional) Verify the contract:");
  console.log(`   npm run verify`);
  console.log("4. Check on BaseScan:");
  console.log(`   https://basescan.org/address/${await gameNFT.getAddress()}`);
  
  return await gameNFT.getAddress();
}

// Handle errors
main()
  .then((address) => {
    console.log("\n✅ Deployment script completed successfully!");
    console.log(`📍 Contract deployed at: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
