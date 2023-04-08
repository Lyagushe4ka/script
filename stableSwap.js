const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
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

let accObjects = [];
const txCount = {};

// parsing private keys and proxies from files
function parseData() {
    if (fs.existsSync('txCount.json')) {
        const txData = fs.readFileSync('txCount.json')
        accObjects = JSON.parse(txData);
    } else {
        const data = fs.readFileSync('PrivateKeys.txt').toString();
        const keys = data.split('\n');
        console.log(keys);
        const proxyData = fs.readFileSync('Proxy.txt').toString();
        const proxyArr = proxyData.split('\n');
        console.log(proxyArr);
        
        for (let i = 0; i < keys.length; i++) {
            const acc = web3.eth.accounts.privateKeyToAccount(keys[i]);
            accObjects[i] = {
                key: keys[i],
                address: acc.address,
                proxy: proxyArr[i],
                txCount: 0,
                hasFinished: false
            } 
        }
        const accObjectsString = JSON.stringify(accObjects, null, 2);
        fs.writeFileSync('txCount.json', accObjectsString);
    }
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
            return [randTokenFrom, randTokenTo];
        }
    }
}

//function to take a random private key and make a wallet instance out of it
function randomozeWallet() {
    let randPrivateKey
    while (true) {
        randPrivateKey = Math.floor(Math.random() * accObjects.length)

        if(accObjects[randPrivateKey].hasFinished == true) {
            continue;
        } else {
            break;
        }
    }

    const account = web3.eth.accounts.privateKeyToAccount(accObjects[randPrivateKey].key);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const wallet = new ethers.Wallet(accObjects[randPrivateKey].key);

    const proxy = new SocksProxyAgent('socks://' + accObjects[randPrivateKey].proxy)

    console.log("Chosen wallet is: " + colors.cyan(account.address));
    console.log("Choses proxy is: " + colors.cyan(accObjects[randPrivateKey].proxy));
    return  {
        account,
        wallet,
        proxy
    }
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
async function approveTokens(amount, tokenContract, myAddress, tokenDecimals) {
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
    if (accObjects.length == 0) {
        parseData();
    }

    // take random wallet to swap
    const { account, wallet, proxy } = randomozeWallet();
    
    // take 2 random tokens to swap
    const rndTokens = await randomizeTokens(account.address);

    let balanceOf;
    while (true) {
        try {
            balanceOf = await tokenInstance(assets[rndTokens[0]].address).methods.balanceOf(account.address).call();
        } catch (err) {
            console.log(err.message);
            await new Promise((resolve) => {
                setTimeout(resolve, 1_000)
            });
            continue;
        }
        break;
    }
    
    const tokenBalance = balanceOf / (10 ** assets[rndTokens[0]].decimals); // tokenFrom balance
    console.log("New order from " +  colors.green(assets[rndTokens[0]].name) + " to " + colors.blue(assets[rndTokens[1]].name));
    console.log(`Token 'from' balance is: ` + colors.green(tokenBalance) + `, Amount to swap is: ` + colors.green(Math.floor(tokenBalance)));

    // Check if the token has enough allowance
    await approveTokens(Math.floor(tokenBalance), assets[rndTokens[0]].address, account.address, assets[rndTokens[0]].decimals);

    let quote;
    while (true) {
        try {
            quote = await axios.get('https://api.bebop.xyz/polygon/v1/quote', {
                params: {
                    buy_tokens: assets[rndTokens[1]].name,
                    sell_tokens: assets[rndTokens[0]].name,
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
    console.log("Order status is: " + (order.data.status == "Success" ? colors.green(order.data.status) : colors.red(order.data)));

    // Increment orders count and check if 100 orders for the wallet were made
    // If 100 orders for wallet were made -> wallet object gets removed from the accObjects
    // If no acc objects left -> script stops
    if (order.data.status == 'Success') {
        for (let i = 0; i < accObjects.length; i++) {
            if (accObjects[i].address == account.address) {
                accObjects[i].txCount++;
                console.log('Orders count for wallet: ' + colors.cyan(account.address) + ' is: ' + colors.yellow(accObjects[i].txCount));

                if (accObjects[i].txCount >= 100) {
                    console.log('100 orders were executed for wallet: ' + colors.red(account.address));

                    // delete wallet from choosing it after 100 orders made
                    for (let i = 0; i < accObjects.length; i++) {
                        if (accObjects[i].address == account.address) {
                            accObjects[i].hasFinished = true;
                            console.log(colors.red(`Wallet was deleted from the list`))
                        }

                        // check if there are wallet left with less than 100 orders
                        for (let i = 0; i < accObjects.length; i++) {
                            if (accObjects[i].hasFinished == false) {
                                break;
                            } else if (i != accObjects.length - 1) {
                                continue;
                            } else {
                                const saveAccObject = JSON.stringify(accObjects, null, 2);
                                fs.writeFileSync('txCount.json', saveAccObject);

                                return console.log(colors.bgRed('All wallets have 100 orders'));
                            }
                        }
                    }
                }
            }
        }
    }
   
    let timeoutTime
    // Random interval from 3 to 21 seconds
    setTimeout(main, timeoutTime = Math.random() * (21_000 - 3_000) + 3_000);
    console.log("Timeout time is set to: " + colors.yellow(Math.floor(timeoutTime / 1000)) + ' seconds.');
    console.log(" ");
}

main().catch(error => {
    const saveAccObject = JSON.stringify(accObjects, null, 2);
    fs.writeFileSync('txCount.json', saveAccObject);
    })
