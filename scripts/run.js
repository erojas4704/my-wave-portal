const main = async () => {
    const [_, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(`Contract balance: ${hre.ethers.utils.formatEther(contractBalance)}`);
    console.log(`Contract deployed WavePortal at ${waveContract.address}`);

    let waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave("A message");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(`Contract balance after ${hre.ethers.utils.formatEther(contractBalance)}`);


    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();
    
    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(`Contract balance after ${hre.ethers.utils.formatEther(contractBalance)}`);
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();
    
    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    waveTxn = await waveContract.wave("No rando!");
    await waveTxn.wait();
    waveTxn = await waveContract.wave("No rando!");
    await waveTxn.wait();

    console.log(`Final balance  ${hre.ethers.utils.formatEther(contractBalance)}`);


    waveCount = await waveContract.getTotalWaves();
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain();