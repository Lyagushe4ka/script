const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');
const colors = require('colors/safe');
const { assets, domain, types, erc20Abi } = require('./objects');
const { parseData } = require('./functions');

const url = "https://polygon.llamarpc.com";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

let accObjects = [];

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
            } catch (err) {
                console.log(err.message);
                await new Promise((resolve) => {
                    setTimeout(resolve, 1_000)
                });
                continue;
            }
            break;а
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
    return new web3.eth.Contract(erc20Abi, contract);
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
    let check = false;
    if (!check) {
        parseData();
        check = true;
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
    // Random interval from 3 to 21 seconds
    const  timeoutTime = Math.random() * (21_000 - 3_000) + 3_000;
    setTimeout(main, timeoutTime);
    console.log("Timeout time is set to: " + colors.yellow(Math.floor(timeoutTime / 1000)) + ' seconds.');
    console.log(" ");
}

process.on('SIGINT', function() {
    console.log('Caught interrupt signal');

    const saveAccObject = JSON.stringify(accObjects, null, 2);
    fs.writeFileSync('txCount.json', saveAccObject);
  
    process.exit();
});

main().catch(error => {
    const saveAccObject = JSON.stringify(accObjects, null, 2);
    fs.writeFileSync('txCount.json', saveAccObject);
    })