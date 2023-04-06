const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
const { setTimeout } = require('timers');
const { SocksProxyAgent } = require('socks-proxy-agent');
const colors = require('colors/safe');

const url = "https://polygon.llamarpc.com";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const assets = [
    {
        name: 'USDT',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        minBalance: 5
    },
    {
        name: 'DAI',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        decimals: 18,
        minBalance: 5
    },
    {
        name: 'USDC',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        decimals: 6,
        minBalance: 5
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

let randTokens = [];
let privateKeys = [];
let proxies = [];
let counter = 0;
let ipCheck = 0;
let randPrivateKey;
let account;
let wallet;
let timeoutTime;
let quote;
let proxy;

// parsing private keys and proxies from files
function parseData() {
    const data = fs.readFileSync('PrivateKeys.json')
    privateKeys.push(...JSON.parse(data));

    const proxyData = fs.readFileSync('proxy.txt').toString();
    proxies = proxyData.split('\n');
}

// function to take 2 random tokens out of a list
async function randomizeTokens(wallet) {
    let randTokenFrom = 0;
    let randTokenTo = 0;
    while (true) {
        randTokenTo = Math.floor(Math.random() * assets.length); // rand token between 3 options
        randTokenFrom = Math.floor(Math.random() * assets.length); // rand token between 3 options

        if (randTokenFrom === randTokenTo) {
            continue;
        }
        let balance;
        while (true) {
            try {
                balance = await tokenInstance(assets[randTokenFrom].address).methods.balanceOf(wallet).call();
                // console.log('Token is: ' + assets[randTokenFrom].name +', token balance is: ' + balance);
                // console.log('Min balance is: ' + assets[randTokenFrom].minBalance * (10 ** assets[randTokenFrom].decimals))
            } catch (err) {
                console.log(err.message);
                await new Promise((resolve) => {
                    setTimeout(resolve, 1_000)
                });
                continue;
            }
            break;
        }
        if (balance < (assets[randTokenFrom].minBalance * (10 ** assets[randTokenFrom].decimals))) {
            continue;
        } else {
            randTokens = [randTokenFrom, randTokenTo];
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

    proxy = new SocksProxyAgent('socks://' + proxies[randPrivateKey])

    console.log("Chosen wallet is: " + colors.cyan(account.address));
    console.log("Choses proxy is: " + colors.cyan(proxies[randPrivateKey]));
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
async function isEnoughAllowance(amount, tokenContract, myAddress, tokenDecimals) {
    if (await tokenInstance(tokenContract).methods.allowance(myAddress, '0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C').call() > amount * (10 ** tokenDecimals)) {
        return;
    } else if (tokenContract == "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" && await tokenInstance(tokenContract).methods.allowance(myAddress, '0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C').call() > 0) {

        const gasPrice = await web3.eth.getGasPrice();

        const txRevokeData = await tokenInstance(tokenContract).methods.approve('0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C', 0);

        const txRevoke = {
            to: tokenContract,
            data: txRevokeData.encodeABI(),
            gas: 150000,
            gasPrice: gasPrice
        }
        
        const txRevokeSend = await web3.eth.sendTransaction(txRevoke);

        console.log(`Revoke transaction sent, hash: ${txRevokeSend.transactionHash}`);

        const txData = await tokenInstance(tokenContract).methods.approve('0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C', BigInt(ethers.constants.MaxUint256));
        
        const tx = {
            to: tokenContract,
            data: txData.encodeABI(),
            gas: 150000,
            gasPrice: gasPrice
        };

        const txSend = await web3.eth.sendTransaction(tx); // claim signed tx sending

        console.log(`Approve transaction sent, hash: ${txSend.transactionHash}`);
        
    } else {
        const gasPrice = await web3.eth.getGasPrice();

        const txData = await tokenInstance(tokenContract).methods.approve('0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C', BigInt(ethers.constants.MaxUint256));
        
        const tx = {
            to: tokenContract,
            data: txData.encodeABI(),
            gas: 150000,
            gasPrice: gasPrice
        };

        const txSend = await web3.eth.sendTransaction(tx); // claim signed tx sending

        console.log(colors.rainbow(`Approve transaction sent, hash: ${txSend.transactionHash}`));
    }
}

async function main() {
    // parsing private keys from json file on first use
    if (privateKeys.length == 0) {
        parseData();
    }

    // take random wallet to swap
    randomozeWallet(); // take random private key and make account instance
    /*
    // one time IP check
    if (ipCheck == 0) {
        const myIp = await axios.get('https://api64.ipify.org',{
            httpsAgent: proxy,
            httpAgent: proxy
        });
        console.log("Current IP address is: " + myIp.data);
        ipCheck++;
    }
    */
    // take 2 random tokens to swap
    await randomizeTokens(account.address);
    // console.log('current allowance is: ' + await tokenInstance(assets[randTokens[0]].address).methods.allowance(account.address, '0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C').call());
    // console.log('min amount with decimals is: ' + assets[randTokens[0]].minBalance * (10 ** assets[randTokens[0]].decimals));

    
    const tokenBalance = await tokenInstance(assets[randTokens[0]].address).methods.balanceOf(account.address).call() / (10 ** assets[randTokens[0]].decimals); // tokenFrom balance
    console.log("New order from " +  colors.green(assets[randTokens[0]].name) + " to " + colors.blue(assets[randTokens[1]].name));
    console.log(`Token 'from' balance is: ` + colors.green(tokenBalance) + `, Amount to swap is: ` + colors.green(Math.floor(tokenBalance)));

    // Check if the token has enough allowance
    await isEnoughAllowance(Math.floor(tokenBalance), assets[randTokens[0]].address, account.address, assets[randTokens[0]].decimals);

    while (true) {
        try {
            quote = await axios.get('https://api.bebop.xyz/polygon/v1/quote', {
                params: {
                    buy_tokens: assets[randTokens[1]].name,
                    sell_tokens: assets[randTokens[0]].name,
                    sell_amounts: Math.floor(tokenBalance).toString(),
                    taker_address: wallet.address.toString()
                },
                httpsAgent: proxy,
                httpAgent: proxy
            });
        } catch (err) {
            console.log(err.message);
            await new Promise((res) => {
                setTimeout(res, 2_000);
            })
            continue;
        }
        break;
    }  
    const signature = await wallet._signTypedData(domain, types, quote.data.toSign);

    const order = await axios.post('https://api.bebop.xyz/polygon/v1/order',
        {
            "signature": signature,
            "quote_id": quote.data.quoteId,
        },
        {httpsAgent: proxy},
        {httpAgent: proxy}
    ).catch(error => {
        console.error(error);
    });
    console.log("Order status is: " + (order.data.status == "Success" ? colors.green(order.data.status) : colors.red(order.data.status)));

    if (order.data.status == 'Success') {
        counter++;
        console.log('Orders count is: ' + colors.yellow(counter));
        if (counter >= 100) {
            return console.log('100 orders were executed');
        }
    }
   
    // Random interval from 20 to 100 seconds
    setTimeout(main, timeoutTime = Math.random() * (40_000 - 5_000) + 5_000);
    console.log("Timeout time is set to: " + colors.yellow(Math.floor(timeoutTime / 1000)) + ' seconds.');
    console.log(" ");
}
main();
