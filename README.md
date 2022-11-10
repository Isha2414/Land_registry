# Land Registry
 
Land Registry is a simple frontend connected with ethereum via smart contract for registering Real esate property.

[Presentation](https://www.canva.com/design/DAFRib5xryc/iGh66d-hIX_JVKT2VsImSg/view?utm_content=DAFRib5xryc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink)
## The Idea
The idea was to made an easy platform to manage the property of citizens in a free and fast way without paying for registering a property or transfer a property
in the notary offices

## What i used?

- Solidity
- Truffle
- Ganache
- Vuejs
- Metamask
- Web3js

## How it works? 

So i built the system to rappresent the property like **NFT** (there is a **ERC721** implementation of the base contract you can check it in the contracts folder),
and inside of the **NFT** there is a set of data:
- ID
- Squere meteres of the proprety
- Geographic coordinates encoded as Bytes32

![Screenshot 2022-11-09 110026](https://user-images.githubusercontent.com/78274772/200800190-dc6b243e-10db-4f19-8b58-0dfec5b3a9e2.png)

### *Functionalties*:
**Metamask** integration for the account system.

ERC721 function implementation like:

- Land Balance 
- Land Owner 
- Land Transfer
- Land Approval

![Screenshot 2022-11-09 111931](https://user-images.githubusercontent.com/78274772/200804151-6d2b35ee-f015-4fb4-84bc-267ec63c2765.png)

Each button is connect to a function in the contract io order is *balanceOf*, *ownerOf*, *safeTransferFrom*, *approval*.
Allowing you to make the basic function of ERC721 standard like transfer your land to another user or check who is the owner of land.

## Installation

- Install Metamask
- Install [Ganache](https://trufflesuite.com/ganache/) and run it
- Add ganache on metamask
- Import the first account of ganache in metamask
- Install Truffle on *contract* folder and then run the tests folder
```sh
npm install -g truffle
truffle test
```
- Add *truffle-config.js* to ganache to import the project
- Deploy the contract to ganache
```sh
truffle deploy
```
- Add the contract address to *App.vue* on line 24
- On *landregister* folder 
```sh
npm install
npm run dev
```
That's it now play around with the site... enjoy

## Preview of the site

![Screenshot 2022-11-09 113554](https://user-images.githubusercontent.com/78274772/200807727-e191c371-04a5-4381-8316-82c7b2ffc259.png)

