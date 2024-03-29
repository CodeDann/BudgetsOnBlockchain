const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("ExpenseTracker", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ExpenseTracker = await ethers.getContractFactory("ExpenseTracker");
    const expensetracker = await ExpenseTracker.deploy();

    return { expensetracker, owner, otherAccount };
  }

  // single test to check if owner of the contract is the default account
  describe("Changing Expenses", function () {
    // it("Approving a non existent expense should fail with message", async function () {
    //   const { expensetracker, owner } = await loadFixture(deploy);

    //   expect(await expensetracker.approveExpense(1000)).to.be.revertedWith(
    //     "Expense does not exist in the system!"
    //   );
    // });

  });

  describe("Regulator Checks", function () {
    it("Approving a")

  }

});
