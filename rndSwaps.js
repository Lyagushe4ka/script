const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');

const url = "https://polygon.llamarpc.com";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

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
    }
]

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
let randTokens = [];
let privateKeys = [];
let randPrivateKey;
let account;
let wallet;
let timeoutTime;

function parsePrivateKeys() {
    const data = fs.readFileSync('PrivateKeys.json')
    privateKeys.push(...JSON.parse(data));
}

// function to take 2 random tokens out of a list
async function randomizeTokens(wallet) {
    let randTokenFrom = 0;
    let randTokenTo = 0;
    randTokenTo = Math.floor(Math.random() * assets.length); // rand token between 13 options
    while (true) {
        randTokenFrom = Math.floor(Math.random() * assets.length); // rand token between 13 options

        if (randTokenFrom === randTokenTo) {
            continue;
        }
        let balance;
        console.log(assets[randTokenFrom].name);
        while (true) {
            try {
                balance = await tokenInstance(assets[randTokenFrom].address).methods.balanceOf(wallet).call();
            } catch (err) {
                console.log(err.message);
                await new Promise((resolve) => {
                    setTimeout(resolve, 1_000)
                })
                continue;
            }
            break;
        }
        if (balance < (assets[randTokenFrom].minBalance * (10 ** assets[randTokenFrom].decimals))) {
            continue;
        } else {
            randTokens.push(randTokenFrom, randTokenTo);
            break;
        }
    }
}

//function to take a random private key and make a wallet instance out of it
function randomozeWallet() {
    randPrivateKey = Math.floor(Math.random() * privateKeys.length)
    account = web3.eth.accounts.privateKeyToAccount('0x' + privateKeys[randPrivateKey]);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    wallet = new ethers.Wallet('0x' + privateKeys[randPrivateKey]);
}

// function to make a token instance
function tokenInstance(contract) {
    return new web3.eth.Contract([
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
// if not - make an approval to MaxUint256
async function isEnoughAllowance(amount, tokenContract, myAddress) {
    if (await tokenInstance(tokenContract).methods.allowance(myAddress, '0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C').call() > amount * (10 ** assets[randTokens[0]].decimals)) {
        return;
    } else {
        const txData = await tokenInstance(tokenContract).methods.approve('0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C', BigInt(ethers.constants.MaxUint256));
        
        const tx = {
            to: tokenContract,
            data: txData.encodeABI(),
            gas: 150000
        };

        const txSign = await web3.eth.accounts.signTransaction(tx, '0x' + privateKeys[randPrivateKey]); // claim tx signing

        const txSend = await web3.eth.sendSignedTransaction(txSign.rawTransaction); // claim signed tx sending

        console.log(`Approve transaction sent, hash: ${txSend.transactionHash}`);
        
    }
}


async function main() {
    // parsing private keys from json file on first use
    if (privateKeys.length == 0) {
        parsePrivateKeys();
    }

    // take random wallet to swap
    randomozeWallet(); // take random private key and make account instance
    console.log("Chosen wallet is: " + account.address);
    
    // take 2 random tokens to swap
    await randomizeTokens(account.address);
    console.log('token from contract is" ' + assets[randTokens[0]].address);
    console.log('token from decimals is: ' + assets[randTokens[0]].decimals);
    console.log('current allowance is: ' + await tokenInstance(assets[randTokens[0]].address).methods.allowance(account.address, '0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C').call());
    console.log('Balance with decimals is: ' + await tokenInstance(assets[randTokens[0]].address).methods.balanceOf(account.address).call());
    console.log('min amount with decimals is: ' + assets[randTokens[0]].minBalance * (10 ** assets[randTokens[0]].decimals));

    
    const tokenBalance = await tokenInstance(assets[randTokens[0]].address).methods.balanceOf(account.address).call() / (10 ** assets[randTokens[0]].decimals); // tokenFrom balance
    const swapMin = assets[randTokens[0]].minBalance;
    console.log("Token 'from' is:" +  assets[randTokens[0]].name);
    console.log("Token 'to' is:" +  assets[randTokens[1]].name);
    console.log("Token 'from' balance is: " + tokenBalance);

    // Randomoze token amout to swap from minAmount to token balance on account
    randAmount = Math.random() * (tokenBalance - swapMin) + swapMin; // random amount of tokens to swap between maxNumber and minNumber
    console.log("Amount to swap is: " + randAmount);

    // Check if the token has enough allowance
    await isEnoughAllowance(randAmount, assets[randTokens[0]].address, account.address);

    const quote = await axios.get('https://api.bebop.xyz/polygon/v1/quote', {
        params: {
            buy_tokens: assets[randTokens[1]].name,
            sell_tokens: assets[randTokens[0]].name,
            sell_amounts: randAmount.toString(),
            taker_address: wallet.address.toString()
        }
    });
    console.log(quote.data);
    console.log(quote.data.expiry, Date.now() / 1000);

    const signature = await wallet._signTypedData(domain, types, quote.data.toSign);
    console.log(signature);

    await new Promise((res) => setTimeout(res, 80_000))

    const order = await axios.post('https://api.bebop.xyz/polygon/v1/order', {
        "signature": signature,
        "quote_id": quote.data.quoteId
    }).catch(error => {
        console.error(error);
    });
    console.log(order.data);
   
    // Random interval up to 10 minutes
    setTimeout(main, timeoutTime = 600_000);
    console.log("Timeout time is set to: " + Math.floor(timeoutTime / 60000) + ' minutes.');
}
main();
