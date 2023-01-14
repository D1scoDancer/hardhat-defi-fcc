const { getNamedAccounts } = require("hardhat")

async function getWETH() {
    const deployer = await getNamedAccounts()
}

module.exports = { getWETH }
