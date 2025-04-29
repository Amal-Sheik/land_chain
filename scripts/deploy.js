const hre = require("hardhat");

async function main() {
    const LandRecord = await hre.ethers.getContractFactory("LandRecord"); // Ensure contract name is correct
    const landRecord = await LandRecord.deploy();

    await landRecord.waitForDeployment(); // Correct function for deployment

    console.log("LandRecord deployed to:", await landRecord.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
