const { expect } = require("chai");

describe("ExpenseTracker", function () {
  const CouncilName = "Leeds City Council";
  const CouncilIdentifier = 1;
  const ProjectName = "Project Y";
  const ProjectIdentifier = 1;
  const ProjectBudget = 10000;

  beforeEach(async function () {
    const ET = await ethers.getContractFactory("ExpenseTracker");
    const CR = await ethers.getContractFactory("CouncilProjectRegulation");

    [user1, user2, user3, user4] = await ethers.getSigners();

    cpRegulation = await CR.deploy();
    const RegulatorAddress = cpRegulation.target;

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
  it("should only allow the approver to approve an expense", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // create expense 
    await expenseTracker.connect(user2).createExpense(100, "Test", "1234");

    // revert on expense approval by non-approver
    await expect(expenseTracker.connect(user2).approveExpense(1)).to.be.revertedWith("Only the approver can call this function!");
  });
  it("should allow the approver to approve an expense", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // create expense
    await expenseTracker.connect(user2).createExpense(100, "Test", "1234");

    // approve
    await expenseTracker.connect(user1).approveExpense(1);
  });

  it("should allow the approver to reject an expense", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // create expense 
    await expenseTracker.connect(user2).createExpense(100, "Test", "1234");

    //reject 
    await expenseTracker.connect(user1).rejectExpense(1);
  });
  it("should only allow the approver to add a payee", async function () {
    await expenseTracker.connect(user1).addPayee(user2.address);

    // revert on payee addition by non-approver
    await expect(expenseTracker.connect(user2).addPayee(user3.address)).to.be.revertedWith("Only the approver can call this function!");
  });
  it("should only allow the approver to remove a payee", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // revert on payee removal by non-approver
    await expect(expenseTracker.connect(user2).removePayee(user2.address)).to.be.revertedWith("Only the approver can call this function!");
  });
  it(" should create 10 expenses, reject 5, approve 5", async function () {
    // add payee
    await expenseTracker.connect(user1).addPayee(user2.address);

    // create 10 expenses
    for (let i = 0; i < 10; i++) {
      await expenseTracker.connect(user2).createExpense(100, "Test", "1234");
      if( i < 5){
        await expenseTracker.connect(user1).rejectExpense(i+1);
      } else {
        await expenseTracker.connect(user1).approveExpense(i+1);
      }
    }
  });
  it(" should add 10 payees then remove 10", async function () {
    // add 10 payees
    for (let i = 0; i < 10; i++) {
      await expenseTracker.connect(user1).addPayee(user2.address);
    }
    // remove 10 payees
    for (let i = 0; i < 10; i++) {
      await expenseTracker.connect(user1).removePayee(user2.address);
    }
  });

  // it("should release a Regualtory Flag when a problematic expense is approved", async function () {
  //   // add payee
  //   await expenseTracker.connect(user1).addPayee(user2.address);

  //   // create expense 
  //   await expenseTracker.connect(user2).createExpense(5000, "Test", "1234");

  //   // approve expense
  //   await expenseTracker.connect(user1).approveExpense(1);

});



