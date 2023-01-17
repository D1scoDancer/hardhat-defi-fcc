const { getNamedAccounts, ethers } = require("hardhat")
const { getWETH, AMOUNT } = require("./getWETH")

async function main() {
    await getWETH()
    const { deployer } = await getNamedAccounts()

    const lendingPool = await getLendingPool(deployer)
    console.log(`Lending Pool address: ${lendingPool.address}`)

    /* Deposit */
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    /* Approve */
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing..")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    let { availableBorrowETH, totalDeptETH } = await getBorrowUserData(lendingPool, deployer)
    const daiPrice = await getDaiPrice()
    /* Borrow Time! */
    // getUserAccountData(): how much we can borrow, how much collateral we have, etc..
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )

    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`DAI/ETH price is: ${price.toString()}`)
    return price
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)

    console.log(`totalCollateralETH: ${totalCollateralETH}`)
    console.log(`totalDeptETH: ${totalDebtETH}`)
    console.log(`availableBorrowETH: ${availableBorrowsETH}`)

    return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(deployer) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        deployer
    )

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, deployer)

    return lendingPool
}

async function approveERC20(erc20Address, spenderAddress, amounToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)

    const tx = await erc20Token.approve(spenderAddress, amounToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
