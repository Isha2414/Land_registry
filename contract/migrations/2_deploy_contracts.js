const landregister = artifacts.require("./LandRegisterERC721.sol");

module.exports = function(deployer) {
    deployer.deploy(landregister);
};