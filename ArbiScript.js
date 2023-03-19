const Web3 = require('web3');
const { Spot } = require('@binance/connector');

// RPC imporing
const url = ''; // YOUR_RPC !!!WEBSOCKET!!!
const web3 = new Web3(new Web3.providers.WebsocketProvider(url));

// Binance api
const apiKey = ''; // YOUR_API_KEY
const apiSecret = ''; // YOUR_API_SECRET
const client = new Spot(apiKey, apiSecret);

// wallet importing
const privateKey = ''; // YOUR_PRIVATE_KEY
const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// claim contract data
const claimContractAddress = '0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9';
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

// ARB token contract data
const arbiContract = new web3.eth.Contract([
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
], "0x912ce59144191c1204e64559fe8253a0e49e6548");

const tradingPair = 'ARBUSDT'; // CEX_TOKEN_PAIR
const orderSide = 'SELL'; // CEX_ORDER_SIDE
const orderType = 'MARKET'; // CEX_ORDER_TYPE
const quantity = 1625; // CEX_TOKENS_AMOUNT (for order)

const cexWallet = ''; // YOUR_CEX_ADDRESS
const amount = 1625; // YOUR_TOKENS_AMOUNT (to transfer to cex)

const blockNumber = 16890400; // claim start blockNumber

// subscribing to a blockNumber
const blockWaiting = web3.eth.subscribe('newBlockHeaders', async function(error ,blockHeader) {
    if (error) {
        console.error(error);
        return;
      }

    console.log(parseInt(blockHeader.l1BlockNumber ?? '0'));

    // start of the script when the needed block is mined
    if (parseInt(blockHeader.l1BlockNumber ?? '0') === blockNumber) {
        blockWaiting.unsubscribe();
        console.log('Needed block mined, starting to claim tokens')
        
        const main = async function() {
            // Claiming tokens from the claimContract
            const claimData = await claimContract.methods.claim(); // claim tx data

            const claimTx = {
                to: '0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9', // Claim contract address
                data: claimData.encodeABI(),
                gas: await claimData.estimateGas(),
                gasPrice: await web3.eth.getGasPrice(),
                nonce: await web3.eth.getTransactionCount(account.address),
            };
            console.log('Claim transaction created.');

            const claimSignedTx = await account.signTransaction(claimTx); // claim tx signing
            console.log('Claim transaction signed');

            const claimTxReceipt = await web3.eth.sendSignedTransaction(claimSignedTx.rawTransaction); // claim signed tx sending
            console.log(`Claim transaction sent, hash: ${claimTxReceipt.transactionHash}`);

            // Depositing tokens to CEX account
            const transferData = await arbiContract.methods.transfer(cexWallet, web3.utils.toWei(amount, 'ether')); // deposit tx data
            
            const tx = {
                to: '0x912ce59144191c1204e64559fe8253a0e49e6548', // arbi token address
                data: transferData.encodeABI(),
                gas: await transferData.estimateGas(),
                gasPrice: await web3.eth.getGasPrice(),
                nonce: await web3.eth.getTransactionCount(account.address),
            };
            console.log('Deposit transaction created.');
        
            const signedTx = await account.signTransaction(tx); // deposit tx signing
            console.log('Deposit transaction signed.');
        
            const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction); // deposit signed tx sending
            console.log(`Deposit transaction sent, hash: ${txReceipt.transactionHash}`);
        
            // checking token balance on cex account with an interval of 15 seconds
            const notZeroBalance = setInterval(async function checkBalance() {
                const accountInfo = await client.account();
                console.log(accountInfo.data.balances.find(item => item.asset === 'ARB').free);
                
                // making trade order when token balance > 10
                if (accountInfo.data.balances.find(item => item.asset === 'ARB').free > 10) {
                    const orderExecute = await client.newOrder(tradingPair, orderSide, orderType, {quantity: quantity});
        
                    console.log('Trade order executed')
                    console.log(orderExecute);
        
                    clearTimeout(notZeroBalance);
        
                    process.exit()
                }
            }, 15000);
        }
        main();
    }
})