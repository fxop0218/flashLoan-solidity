const { expect, assert } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")
const hre = require("hardhat")
const { DAI, DAT_WHALE, POOL_ADDRESS_PROVIDER } = require("../helper-hardhat-config")

describe("Deploy a flash loan", () => {
    it("Should take a flash loan and be able to return it", async () => {
        // Get contract
        const flashLoanContract = await ethers.getContractFactory("FlashLoan")
        // Deploy contract
        const flashLoanExemple = await flashLoanContract.deploy(POOL_ADDRESS_PROVIDER)
        await flashLoanExemple.deployed()

        // Get token contract
        const token = await ethers.getContractAt("IERC20", DAI)
        const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000") // Pase ether amount to wei
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAT_WHALE],
        })

        // Get signer account in this case whael account
        const signer = await ethers.getSigner(DAT_WHALE) // get dai_whale account (only in fork test net)
        await token.connect(signer).transfer(flashLoanExemple.address, BALANCE_AMOUNT_DAI) // ttransfer to our contract 2000 DAI from the DAI_WHALE
        const transaction = await flashLoanExemple.createFlashLoan(DAI, 1000) // Borrow 1000 dai in a flash loan with no upfront collateral
        await transaction.wait(1)
        const remainingBalance = await token.balanceOf(flashLoanExemple.address) // Check the current balance
        expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true
    })
})
