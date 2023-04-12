const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
const { SocksProxyAgent } = require('socks-proxy-agent');
const colors = require('colors/safe');
const { assets, domain, types, erc20Abi } = require('./objects');
const { parseData, randomozeWallet, randomizeTokens, approveTokens, tokenInstance } = require('./functions');

const url = "https://polygon.llamarpc.com";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

let accObjects;

async function main() {
    // parsing private keys from json file on first use
    let check = false;
    if (!check) {
        accObjects = parseData();
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

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);

    const saveAccObject = JSON.stringify(accObjects, null, 2);
    fs.writeFileSync('txCount.json', saveAccObject);

    process.exit();
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Caught exception: ${err}\n Exception origin: ${origin}`)

    const saveAccObject = JSON.stringify(accObjects, null, 2);
    fs.writeFileSync('txCount.json', saveAccObject);

    process.exit();
});

main();

// function to check proxy connection is stable with taking proxies from the txt file
async function proxyChecker() {

}
