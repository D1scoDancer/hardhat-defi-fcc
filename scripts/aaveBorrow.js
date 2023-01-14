const { getWETH } = require("./getWETH")

async function main() {
    await getWETH()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
