const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.1")

async function getWETH() {
    const { deployer } = await getNamedAccounts()

    const IWeth = await ethers.getContractAt(
        "IWeth",
        // "0x8B7FB00ABb67ba04CE894B9E2769fe24A8409a6a", // goerli
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // mainnet
        deployer
    )
    const tx = await IWeth.deposit({ value: AMOUNT })
    await tx.wait(1)

    const wethBalance = await IWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWETH }
