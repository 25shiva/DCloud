const hre = require("hardhat");

async function main() {

  await hre.run('compile');
  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  // await upload.deployed();
  await upload.deploymentTransaction().wait();

  console.log("Contract deployed to:", upload.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
