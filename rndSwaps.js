const Web3 = require('web3');


const url = "";
const web3 = new Web3(new Web3.providers.HttpProvider(url));


const privateKeys = [
    "",
    ""
]

let account = [];

for (let i = 0; i < privateKeys.length; i++) {
    account.push(web3.eth.accounts.privateKeyToAccount('0x' + privateKeys[i]));
    web3.eth.accounts.wallet.add(account[i]);
}



const gasPrice = web3.utils.toWei('20', 'gwei');
const gasLimit = 600000; 


const Address = '0xAF0B0000f0210D0f421F0009C72406703B50506B';

const randAsset = [
    WETH,
    WMATIC,
    WBTC,
    USDT,
    DAI,
    BAL,
    USDC,
    LINK,
    AAVE,
    CRV,
    MKR,
    SAND,
    MATIC
]

const  decimals = {
    WETH: 18,
    WMATIC: 18,
    WBTC: 8,
    USDT: 6,
    DAI: 18,
    BAL: 18,
    USDC: 6,
    LINK: 18,
    AAVE: 18,
    CRV: 18,
    MKR: 18,
    SAND: 18,
    MATIC: 18,
}

const tokenList = {
    WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // >500
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    WBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // >500
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    BAL: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    LINK: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", // >50
    CRV: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
    MKR: "0x6f7C932e7684666C9fd1d44527765433e01fF61d", // >500
    SAND: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
    MATIC: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
}

const neededBalance = {
    WETH: 0.001,
    WMATIC: 0.1,
    WBTC: 0.0001,
    USDT: 0.1,
    DAI: 0.1,
    BAL: 0.1,
    USDC: 0.1,
    LINK: 0.1,
    AAVE: 0.01,
    CRV: 0.1,
    MKR: 0.001,
    SAND: 0.1,
    MATIC: 0.1
}

const minNumber = 10;
const maxNumber = 20;
var randAmount;
var randTokenFrom;
var randTokenTo;
var quoteQuantity;

async function randomizeTokens() {
    randTokenFrom = await Math.floor(Math.random() * 14) // rand token between 13 options
    randTokenTo = await Math.floor(Math.random() * 14) // rand token between 13 options
}

async function randomozeWallet() {
    randPrivateKey = await Math.floor(Math.random() * (account.length + 1))
    web3.eth.defaultAccount = account[randPrivateKey].address;
}

function tokenInstance(contract) {
    return web3.eth.Contract([
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
    ], contract);
}

async function bebopSign() {

    randomozeWallet(); // take random private key and make account instance
    console.log("Chosen wallet is:" + account.address);
    
    // take 2 random tokens && tokenFrom balance on this account should be > 0.01    
    while (randTokenFrom == randTokenTo && tokenInstance(tokenList[randAsset.randTokenFrom]).methods.balanceOf.call() > neededBalance[randAsset[randTokenFrom]] * 10^(decimals[randAsset[randTokenFrom]])) {
        randomizeTokens();
    }
    const tokenBalance =  tokenInstance(tokenList[randAsset.randTokenFrom]).methods.balanceOf.call() / 10^(decimals[randAsset[randTokenFrom]]); // tokenFrom balance
    const swapMin = neededBalance[randAsset[randTokenFrom]];
    const tokenFrom = tokenList[randAsset[randTokenFrom]]; // take tokenFrom contract
    const tokenTo = tokenList[randAsset[randTokenTo]]; // take tokenTo contract
    console.log("Token 'from' is:" + randAsset[randTokenFrom]);
    console.log("Token 'to' is:" + randAsset[randTokenTo]);


    randAmount = await Math.floor(Math.random() * (tokenBalance - swapMin + 1) + swapMin); // random amount of tokens to swap between maxNumber and minNumber
    console.log("Amount to swap is:" + randAmount);

    const quantityFrom = randAmount * 10^(decimals[randAsset[randTokenFrom]]); // amount to swap * decimals
    const quantityTo = quoteQuantity * 10^(decimals[randAsset[randTokenTo]]);

    const timestamp = (Date.now() / 1000).toFixed(0); // get current timestamp in seconds
    console.log("Current timestamp in seconds is:" + timestamp);

    const sendSign = await web3.eth.personal.sign({
        "expiry": timestamp.toString(),
        "taker_address": account.address,
        "maker_address": "0xAF0B0000f0210D0f421F0009C72406703B50506B",
        "base_token": tokenFrom.toString(),
        "quote_token": tokenTo.toString(),
        "base_quantity": quantityFrom.toString(),
        "quote_quantity": quantityTo.toString(),
        "receiver": account.address
    }, account);
    
    console.log("Sended signature:" + sendSign);

    setTimeout(doSomething, Math.random() * 10_000_000); // interval up to 2+ hours
}
bebopSign();


/*
async function main() {
    const currentNonce = await web3.eth.getTransactionCount(account.address);

    const claimTx = {
        to: Address,
        data: '',
        gas: gasLimit,
        gasPrice: gasPrice,
        nonce: currentNonce,
    };

    claimSignedTx = await account.signTransaction(claimTx); // claim tx signing


    const tx1 = await web3.eth.sendSignedTransaction(claimSignedTx.rawTransaction); // claim signed tx sending

    console.log(`Claim transaction sent, hash: ${tx1.transactionHash}`);
}
main();

*/