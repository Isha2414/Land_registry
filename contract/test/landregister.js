const LandRegister = artifacts.require("LandRegisterERC721");
const utils = require("./utils.js")
const landsprototypes = [
  {
    _mQ: 200,
    _coords:
      "0x2838302e303030302c202d35302e303030302900000000000000000000000000",
  },
  {
    _mQ: 342,
    _coords:
      "0x2834352e303030302c202d32302e303030302900000000000000000000000000",
  },
];

contract("LandRegisterERC721", (accounts) => {
  let [alice, bob] = accounts;
  beforeEach(async () => {
    contractInstance = await LandRegister.deployed();
  });
  it("should be able to create a new Land", async () => {
    const result = await contractInstance._newLand(
      landsprototypes[0]._mQ,
      landsprototypes[0]._coords,
      { from: accounts[0] }
    );
    assert.equal(result.receipt.status, true);
    //console.log(result.logs[0].args._id)
  });
  it("should retrun the correct balance of lands", async () => {
    const result = await contractInstance.balanceOf(accounts[0], {
      from: accounts[0],
    });
    assert.equal(result, 1);
  });
  it("should not create new land with same coordinates", async () => {
    await utils.shouldRevert(
      contractInstance._newLand(
      landsprototypes[0]._mQ,
      landsprototypes[0]._coords,
      { from: accounts[0] }
    ))
  });
  it("should not create new land with 0 mQ", async () => {
    await utils.shouldRevert(
      contractInstance._newLand(
      0,
      (0, 0),
      { from: accounts[0] }
    ))
  });
  it("should be able to get the owner address of a given land id", async () => {
    const result = await contractInstance.ownerOf(0, { from: accounts[0] });
    assert.equal(result, accounts[0]);
  });
  context("transfer with no approval", async () => {
    it("require from address is not 0", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(
          "0x0000000000000000000000000000000000000000",
          accounts[0],
          0,
          { from: accounts[0] }
        )
      )
    });
    it("require to address is not 0", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(
          accounts[0],
          "0x0000000000000000000000000000000000000000",
          0,
          { from: accounts[0] }
      ))
    });
    it("require tokenId to exists", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(accounts[0], accounts[1], 99999, {from: accounts[0]})
      )
    });
    it("require from address to be the owner of the token ID", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(accounts[1], accounts[0], 0, {from: accounts[1]})
      )
    })
    it("require the sender to be the owner or the approved one", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(accounts[0], accounts[1], 0, {from: accounts[1]})
      )
    })
    it("require from address is not to address", async () => {
      await utils.shouldRevert(
        contractInstance.safeTransferFrom(accounts[0], accounts[0], 0, {from: accounts[0]})
      )
    })
    it("should transfer a Land", async () => {
      await contractInstance.safeTransferFrom(accounts[0], accounts[1], 0, {from: accounts[0]})
      const newOwner = await contractInstance.ownerOf(0);
      assert.equal(newOwner, accounts[1]);
    })
  });
  context("transfer with approve", async() => {
    it("require sander is the owner of the land", async () => {
      await utils.shouldRevert(contractInstance.approve(accounts[0], 0, {from: accounts[0]}))
    })
    it("require tokenId to exists", async () => {
      await utils.shouldRevert(
        contractInstance.approve(accounts[0], 99999, {from: accounts[1]})
      )
    });
    it("should approve an address", async () => {
     const result = await contractInstance.approve(accounts[0], 0, {from: accounts[1]})
     const approved = result.logs[0].args.approved
     assert.equal(approved, accounts[0])
    })
    it("should allow approved address to take ownership", async() => {
      await contractInstance.safeTransferFrom(accounts[1], accounts[0], 0, {from: accounts[0]})
      const newOwner = await contractInstance.ownerOf(0)
      assert.equal(newOwner, accounts[0])
    })
  });
});
