require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.8.10" }],
    },
    networks: {
        hardhat: {
            forking: {
                url: QUICKNODE_RPC_URL,
            },
        },
    },
}
