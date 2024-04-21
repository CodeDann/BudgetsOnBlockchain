const { expect } = require("chai");

describe("ExpenseTracker", function () {
  const CouncilName = "Leeds City Council";
  const CouncilIdentifier = 1;
  const ProjectName = "Project Y";
  const ProjectIdentifier = 1;
  const ProjectBudget = 10000;
  const RegulatorAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  beforeEach(async function () {
    const ET = await ethers.getContractFactory("ExpenseTracker");
    [user1, user2, user3, user4] = await ethers.getSigners();

    expenseTracker = await ET.deploy(CouncilName, CouncilIdentifier, ProjectName, ProjectIdentifier, ProjectBudget, RegulatorAddress, user1.address);
  });

  it("shouldn't allow unknown payees to create an expense", async function () {
    // revert on unknown payee
    await expect(expenseTracker.connect(user1).createExpense(100, "Test", "1234")).to.be.revertedWith("Only known payees can create expenses! Please contact the council to be added to the list.")
  });
  it("should allow known payees to create an expense", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // create expense 
    await expenseTracker.connect(user2).createExpense(100, "Test", "1234");
  });


  // it("can create 10k expenses", async function () {

  //   // set custom timeout
  //   this.timeout(3000000);

  //   // add payee
  //   await expenseTracker.connect(user1).addPayee(user2.address);

  //   // create 100 expenses
  //   for (let i = 0; i < 10000; i++) {
  //     await expenseTracker.connect(user2).createExpense(Math.floor(Math.random() * 501).toString(), "Test", "1234");
  //   }
  // });
  // it("can create 1000 expenses", async function () {

  //   // set custom timeout
  //   this.timeout(300000);

  //   // add payee
  //   await expenseTracker.connect(user1).addPayee(user2.address);

  //   // create 100 expenses
  //   for (let i = 0; i < 1000; i++) {
  //     await expenseTracker.connect(user2).createExpense(100, "Test", "1234");
  //   }
  // });
  

});