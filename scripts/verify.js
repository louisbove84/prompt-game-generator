import { run } from "hardhat";
import fs from 'fs';

async function main() {
  console.log("🔍 Verifying GameNFT contract on BaseScan...");

  // Read deployment info
  let deploymentInfo;
  
  try {
    deploymentInfo = JSON.parse(fs.readFileSync('./deployment-info.json', 'utf8'));
  } catch (error) {
    console.error("❌ Could not read deployment-info.json");
    console.error("Make sure you've deployed the contract first!");
    process.exit(1);
  }

  const contractAddress = deploymentInfo.contractAddress;
  const network = deploymentInfo.network;
  
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: ${network}`);
  
  try {
    console.log("⏳ Verifying contract...");
    
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // GameNFT has no constructor arguments
    });
    
    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on BaseScan: https://basescan.org/address/${contractAddress}`);
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️ Contract is already verified!");
      console.log(`🔗 View on BaseScan: https://basescan.org/address/${contractAddress}`);
    } else {
      console.error("❌ Verification failed:");
      console.error(error.message);
      
      // Try manual verification command
      console.log("\n🛠️ You can try manual verification:");
      console.log(`npx hardhat verify --network ${network} ${contractAddress}`);
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ Verification script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });
