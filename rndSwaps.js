const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');

const url = "wss://polygon-mainnet.g.alchemy.com/v2/C2D5jSmRUdd6po6BYXTo0sbd0OShgwIA";
const web3 = new Web3(new Web3.providers.WebsocketProvider(url));


const privateKeys = [
    "",
    ""
]

const gasPrice = web3.utils.toWei('20', 'gwei');
const gasLimit = 600000; 

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

const assets = [
    {
        name: 'WETH',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        decimals: 18,
        minBalance: 0.001
    },
    {
        name: 'WMATIC',
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'WBTC',
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        decimals: 8,
        minBalance: 0.0001
    },
    {
        name: 'USDT',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        minBalance: 0.1
    },
    {
        name: 'DAI',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'BAL',
        address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'USDC',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        decimals: 6,
        minBalance: 0.1
    },
    {
        name: 'LINK',
        address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'AAVE',
        address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        decimals: 18,
        minBalance: 0.01
    },
    {
        name: 'CRV',
        address: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'MKR',
        address: '0x6f7C932e7684666C9fd1d44527765433e01fF61d',
        decimals: 18,
        minBalance: 0.001
    },
    {
        name: 'SAND',
        address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
        decimals: 18,
        minBalance: 0.1
    },
    {
        name: 'MATIC',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        minBalance: 0.1
    },
]

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

const domain = {
    name: 'BebopAggregationContract',
    version: '1',
    chainId: 137,
    verifyingContract: "0xbeb09beb09e95e6febf0d6eeb1d0d46d1013cc3c"
};

const types = {
    "AggregateOrder": [
        {
            "name": "expiry",
            "type": "uint256"
        },
        {
            "name": "taker_address",
            "type": "address"
        },
        {
            "name": "maker_addresses",
            "type": "address[]"
        },
        {
            "name": "maker_nonces",
            "type": "uint256[]"
        },
        {
            "name": "taker_tokens",
            "type": "address[][]"
        },
        {
            "name": "maker_tokens",
            "type": "address[][]"
        },
        {
            "name": "taker_amounts",
            "type": "uint256[][]"
        },
        {
            "name": "maker_amounts",
            "type": "uint256[][]"
        },
        {
            "name": "receiver",
            "type": "address"
        }
    ]
}

let randAmount;
let randTokenFrom;
let randTokenTo;
let randPrivateKey;
let account;
let wallet;
let timeoutTime;

// function to take 2 random tokens out of a list
async function randomizeTokens() {
    randTokenFrom = await Math.floor(Math.random() * (assets.length + 1)) // rand token between 13 options
    randTokenTo = await Math.floor(Math.random() * (assets.length + 1)) // rand token between 13 options
}

//function to take a random private key and make a wallet instance out of it
async function randomozeWallet() {
    randPrivateKey = await Math.floor(Math.random() * (privateKeys.length + 1))
    account = web3.eth.accounts.privateKeyToAccount('0x' + privateKeys[randPrivateKey]);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    wallet = new ethers.Wallet(privateKeys[randPrivateKey]);
}

// function to make a token instance
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

// function to check if its enough allowance to make a trade
// if not - make an approval x2 from the trade size
function isEnoughAllowance(amount, tokenContract, myAddress) {
    if (tokenInstance(tokenContract).methods.allowance(myAddress, Address).call() > amount) {
        return;
    } else {
        let newAmount = amount * 2;
        tokenInstance(tokenContract).methods.approve(Address, newAmount).send(myAddress);
    }
}


async function main() {

    randomozeWallet(); // take random private key and make account instance
    console.log("Chosen wallet is:" + account.address);
    
    // take 2 random tokens && tokenFrom balance on this account should be > 0.01    
    while (randTokenFrom == randTokenTo && tokenInstance(assets[randTokenFrom].address).methods.balanceOf.call() > assets[randTokenFrom].minBalance * 10 ^ assets[randTokenFrom].decimals) {
        randomizeTokens();
    }
    const tokenBalance =  tokenInstance(assets[randTokenFrom].address).methods.balanceOf.call() / 10 ^ assets[randTokenFrom].decimals; // tokenFrom balance
    const swapMin = assets[randTokenFrom].minBalance;
    const tokenFrom = assets[randTokenFrom].address; // take tokenFrom contract
    const tokenTo = assets[randTokenTo].address; // take tokenTo contract
    console.log("Token 'from' is:" +  assets[randTokenFrom].name);
    console.log("Token 'to' is:" +  assets[randTokenTo].name);


    randAmount = await Math.floor(Math.random() * (tokenBalance - swapMin + 1) + swapMin); // random amount of tokens to swap between maxNumber and minNumber
    console.log("Amount to swap is:" + randAmount);

    isEnoughAllowance(randAmount, assets[randTokenFrom].address, account.address);

    const quote = await axios.get('https://api.bebop.xyz/polygon/v1/quote', {
        params: {
            buy_tokens: assets[randTokenTo].name,
            sell_tokens: assets[randTokenFrom].name,
            sell_amounts: randAmount.toString(),
            taker_address: wallet.address.toString()
        }
    });
    console.log(quote.data.buyTokens);
    console.log(quote.data.toSign);

    const signature = await wallet._signTypedData(domain, types, quote.data.toSign);
    console.log(signature);

    const order = await axios.post('https://api.bebop.xyz/polygon/v1/order', {
        "signature": signature,
        "quote_id": quote.data.quoteId
    }).catch(error => {
        console.error(error);
      });
    console.log(order.status);
    console.log(order.txHash);
   
    setTimeout(main, timeoutTime = Math.random() * 10_000_000); // interval up to 2+ hours
    console.log("Timeout time is set to:" + timeoutTime);
}
main();


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