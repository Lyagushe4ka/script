const Web3 = require('web3');

// RPC imporing
const url = ''; // YOUR_RPC {wss://.....} WEBSOCKET URL NEEDED!!!!
const web3 = new Web3(new Web3.providers.WebsocketProvider(url));

// wallet importing
const privateKey = ''; // YOUR_PRIVATE_KEY!!!!!
const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const blockNumber = 16890400; // claim start blockNumber [CHECK AGAIN]

// TX FEE = MAX ~ 10$
const gasPrice = web3.utils.toWei('10', 'gwei'); // 10 gwei set by default
const gasLimit = 6000000; // 6 * 10^6  limit set by default (60kk)

// DONT LOOK BELOW! YOU DONT NEED THIS INFORMATION!

// claim contract data
const claimContractAddress = '0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9'; // Claim contract address [CHECK AGAIN]
const claimContractAbi = [{
    "inputs": [{
        "internalType": "contract IERC20VotesUpgradeable",
        "name": "_token",
        "type": "address"
    }, {
        "internalType": "address payable",
        "name": "_sweepReceiver",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "_claimPeriodStart",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "_claimPeriodEnd",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "delegateTo",
        "type": "address"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "CanClaim",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "HasClaimed",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "newSweepReceiver",
        "type": "address"
    }],
    "name": "SweepReceiverSet",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Swept",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Withdrawal",
    "type": "event"
}, {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "delegatee",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "expiry",
        "type": "uint256"
    }, {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    }, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    }, {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }],
    "name": "claimAndDelegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "claimPeriodEnd",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "claimPeriodStart",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "claimableTokens",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address[]",
        "name": "_recipients",
        "type": "address[]"
    }, {
        "internalType": "uint256[]",
        "name": "_claimableAmount",
        "type": "uint256[]"
    }],
    "name": "setRecipients",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address payable",
        "name": "_sweepReceiver",
        "type": "address"
    }],
    "name": "setSweepReciever",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "sweep",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "sweepReceiver",
    "outputs": [{
        "internalType": "address payable",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "token",
    "outputs": [{
        "internalType": "contract IERC20VotesUpgradeable",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalClaimable",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}];
const claimContract = new web3.eth.Contract(claimContractAbi, claimContractAddress);

let txCreation = false;
let blockFound = false;
let claimSignedTx;

// subscribing to a blockNumber
const blockWaiting = web3.eth.subscribe('newBlockHeaders', async function(error ,blockHeader) {
    if (error) {
        console.error(error);
        return;
      }

    console.log(parseInt(blockHeader.l1BlockNumber ?? '0'), (blockHeader.number ?? '0'));

    if (!txCreation) {
        txCreation = true;

        // CLAIM TX
        const claimData = await claimContract.methods.claim(); // claim tx data

        const currentNonce = await web3.eth.getTransactionCount(account.address);

        const claimTx = {
            to: claimContractAddress,
            data: claimData.encodeABI(),
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: currentNonce,
        };

        claimSignedTx = await account.signTransaction(claimTx); // claim tx signing
    }

    // start of the script when the needed block is mined
    if (parseInt(blockHeader.l1BlockNumber ?? '0') >= blockNumber && !blockFound) {
        console.log('Needed block mined, starting to claim tokens')
        
        blockFound = true;

        const tx1 = await web3.eth.sendSignedTransaction(claimSignedTx.rawTransaction); // claim signed tx sending

        console.log(`Claim transaction sent, hash: ${tx1.transactionHash}`);
    }
})