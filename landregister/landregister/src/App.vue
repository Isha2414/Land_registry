<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Web3 from 'web3'
import LandRegisterABI from "./components/icons/LandRegisterERC721.json";
import modal from './components/modal.vue';
import truncateEthAddress from 'truncate-eth-address'

const metamaskisinstalled = ref(false)
const buttontext = ref("Connect Metamask")
const toconnect = ref(true)
const address = ref()
const landBalance = ref(false);
const landOwner = ref(false);
const landTransfer = ref(false);
const landApproval = ref(false);
const newLand = ref(false);
const submitted = ref(false);
var landRegister: any;
var account: any;
var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const isAdmin = ref(false)

async function startapp() {
  var contractAddress = "0xBB25baDa2EB6ccd46618CbF3C3E20d88F2E1d264"; // change this with the contract address
  landRegister = new web3.eth.Contract((LandRegisterABI as any).abi, contractAddress);

  (window as any).ethereum.on('accountsChanged', function(accounts: any) {
    account = accounts[0];
    location.reload()
  })
}

onMounted(() => {
  metamaskisinstalled.value = typeof (window as any).ethereum !== 'undefined'
  if (metamaskisinstalled.value === false) {
    alert("Install Metamask")
  }

})

function getLandsByOwner(owner: any) {
  return landRegister.methods._getLandsByOwner(owner).call();
}

const lands = ref()
async function displayLands(ids: any) {
  var landsArr: any[] = [];
  for (var id of ids) {
    await landRegister.methods.lands(Number(id)).call() //getting the land details per id
      .then((land: any) => {
        landsArr.push({
          'landId': land.landId,
          'squereMeters': land.mQ,
          'coordinates': web3.utils.hexToUtf8(land.coords)
        })
      }
      )
  }
  return lands.value = landsArr;
}

async function connect() {
  const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
  account = accounts[0]
  toconnect.value = false
  address.value = account // connect Metamask and getting the user account
  startapp()
  getLandsByOwner(account) // getting all the lands owned by the current user and then display them
    .then((ids: any) => displayLands(ids))
    .catch((err: any) => {
      if (err.code == -32602) {
      alert("Inavalid values retry")
    } else {
      alert("Iternal error")
    }
  })
  const admin = await landRegister.methods.owner().call() // checking if the connected user is the contract owner
  if (admin.toLowerCase() === account.toLowerCase()) {
    isAdmin.value = true;
  } else {
    isAdmin.value = false;
  }
}

const owner = ref();
const owned = ref(0);
async function balanceof() {
  await landRegister.methods.balanceOf(owner.value).call()
    .then((val: any) => owned.value = val)
    .catch((err: any) => {
      if (err.code == -32602) {
      alert("Inavalid values retry")
    } else {
      alert("Iternal error")
    }
    })
}

const landid = ref()
const addr = ref('')
function ownerof() {
  landRegister.methods.ownerOf(landid.value).call()
    .then((owneraddr: any) => {
      addr.value = owneraddr;
      landid.value = null;
    })
    .catch((err: any) => {
      alert("error")
    })
}

const tAddr = ref()
const tId = ref()
const fromaddr =ref()
async function safe_transfer() {
  await landRegister.methods.safeTransferFrom(fromaddr.value, tAddr.value, tId.value).send({ from: address.value })
    .then('receipt', function (receipt: any) {
      alert(`Land with id: ${tId.value} tranfered to ${truncateEthAddress(tAddr.value)}`)
      tAddr.value = null;
      tId.value = null;
      fromaddr.value = null;
    })
    .catch((err: any) => {
      if (err.code == -32602) {
      alert("Inavalid values retry")
    } else {
      alert("Iternal error")
    }
    })
}


const to = ref()
const tokenId = ref()
async function _approve() {
  try {
    await landRegister.methods.approve(to.value, tokenId.value).send({ from: address.value })
  } catch (err: any) {
      if (err.code == -32602) {
      alert("Inavalid values retry")
    } else {
      alert("Iternal error")
    }
    }
  }


const mQ = ref();
const coordinates = ref();
async function new_land() {
  try{
    await landRegister.methods._newLand(mQ.value, web3.utils.asciiToHex(coordinates.value)).send({from: address.value})
    mQ.value = null;
    coordinates.value = null;
  } catch (err: any) {
    if (err.code == -32602) {
      alert("Inavalid values retry")
    } else {
      alert("Iternal error")
    }
  }
}


</script>

<template>
  <div class="grid-container">
    <div class="header menu" style="text-align: right; font-size: 16px;">
      <h1 style="color: white; padding-top: 5px;">
        Land Registry
      </h1>
    </div>
    <div class="header right" id="head" style="text-align: left">
      <ul>
        <li v-if="isAdmin" style="display: inline;"><button class="button-5" @click="newLand = true">New Land</button></li>
        <li style="display: inline;"><button class="button-5">About</button></li>
        <li v-if="toconnect" style="display:inline; padding-left:50px;"><button class="button-5"
            v-if="metamaskisinstalled" @click="connect">{{
            buttontext }}</button></li>
        <li v-else="toconnect"
          style="display:inline; color: white; font-size: medium; margin-left: 50px; padding: auto;">Connected as: {{
          truncateEthAddress(address) }}</li>
      </ul>
    </div>
  </div>
  <div class="wrapper">
    <aside style="width: fit-content; margin: 0; padding: 0;">
      <div class="menu-container">
        <ul class="menu-item">
          <li id="menu-list"><button class="button-5" @click="landBalance = true">Land Balance</button></li>
          <li id="menu-list"><button class="button-5" @click="landOwner = true">Land Owner</button></li>
          <li id="menu-list"><button class="button-5" @click="landTransfer = true">Land Transfer</button></li>
          <li id="menu-list"><button class="button-5" @click="landApproval = true">Land Approval</button></li>
        </ul>
      </div>
    </aside>
    <main class="container">
      <h2 style="margin: 10px; padding: 10px; color: white;" v-if="toconnect == false">Your Lands :</h2>
      <ul class="item" v-for="land of lands">
        <li>Land ID: {{land.landId}}</li>
        <li>Land mQ: {{land.squereMeters}}</li>
        <li>Land Coordinates: {{land.coordinates}}</li>
      </ul>
    </main>
  </div>
  <Teleport to="body" v-if="toconnect == false">
    <modal :show="landBalance" @close="landBalance = false, submitted = false">
      <template #header>
        <h3>Land Balance</h3>
      </template>
      <template #body>
        <form @submit.prevent="balanceof">
          <label for="address">Address:</label><br>
          <input id="address" v-model="owner"><br>
          <input type="submit" value="Submit" @click="submitted = true" class="button-5"
            style="padding: 5px; margin-top: 10px; float: right;">
        </form>
        <div v-if="submitted">The address {{ truncateEthAddress(owner) }} has {{owned}} lands </div>
      </template>
    </modal>
    <modal :show="landOwner" @close="landOwner = false, submitted = false">
      <template #header>
        <h3>Land Owner</h3>
      </template>
      <template #body>
        <form @submit.prevent="ownerof">
          <label for="id">Id:</label><br>
          <input id="id" v-model="landid"><br>
          <input type="submit" value="Submit" @click="submitted = true" class="button-5"
            style="padding: 5px; margin-top: 10px; float: right;">
        </form>
        <div v-if="submitted">The Land with id: {{ landid }} is owned by {{ truncateEthAddress(addr) }}</div>
      </template>
    </modal>
    <modal :show="landTransfer" @close="landTransfer = false, submitted = false">
      <template #header>
        <h3>Land Transfer</h3>
      </template>
      <template #body>
        <form @submit.prevent="safe_transfer">
          <label for="fromAddr">Land Owner address:</label><br>
          <input id="fromAddr" v-model="fromaddr"><br>
          <label for="tAddr">Target address:</label><br>
          <input id="tAddr" v-model="tAddr"><br>
          <label for="tId">Target Id:</label><br>
          <input id="tId" v-model="tId"><br>
          <input type="submit" value="Submit" @click="submitted = true" class="button-5"
            style="padding: 5px; margin-top: 10px; float: right;">
        </form>
      </template>
    </modal>
    <modal :show="landApproval" @close="landApproval = false, submitted = false">
      <template #header>
        <h3>Land Approval</h3>
      </template>
      <template #body>
        <form @submit.prevent="_approve">
          <label for="tAddr">Target address to approve:</label><br>
          <input id="tAddr" v-model="to"><br>
          <label for="tId">Target Id to approve:</label><br>
          <input id="tId" v-model="tokenId"><br>
          <input type="submit" value="Submit" @click="submitted = true" class="button-5"
            style="padding: 5px; margin-top: 10px; float: right;">
        </form>
      </template>
    </modal>
    <modal :show="newLand" @close="newLand = false, submitted = false">
      <template #header>
        <h3>New land</h3>
      </template>
      <template #body>
        <form @submit.prevent="new_land">
          <label for="mQ">Squere meters of your land:</label><br>
          <input id="mQ" placeholder="> 0" v-model="mQ"><br>
          <label for="tId">Land coordinates:</label><br>
          <input id="tId" pattern="\(([-]{0,1})([0-9]{2}).([0-9]{4}), ([-]{0,1})([0-9]{2}).([0-9]{4})\)" placeholder="ex.(50.0000, -20.0000)" v-model="coordinates"><br>
          <input type="submit" value="Submit" @click="submitted = true" class="button-5"
            style="padding: 5px; margin-top: 10px; float: right;">
        </form>
      </template>
    </modal>
  </Teleport>
</template>

