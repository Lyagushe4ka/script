const fs = require('fs');
const Web3 = require('web3');
const colors = require('colors/safe');
const ethers = require('ethers');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { assets, domain, types, erc20Abi } = require('./objects');

const url = "https://polygon.llamarpc.com";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

let accObjects = [];

// parsing private keys and proxies from files
function parseData() {
    if (fs.existsSync('txCount.json')) {
        const data = fs.readFileSync('PrivateKeys.txt').toString();
        const keys = data.split('\n');

        const txData = fs.readFileSync('txCount.json')
        accObjects = JSON.parse(txData);

        if (accObjects.length == keys.length) {
            return accObjects;
        } else {
            const proxyData = fs.readFileSync('Proxy.txt').toString();
            const proxyArr = proxyData.split('\n');

            for (let i = accObjects.length; i < keys.length; i++) {
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

            return accObjects;
        }
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

        return accObjects;
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
            break;
        }
        if (balance < (assets[randTokenFrom].minBalance * (10 ** assets[randTokenFrom].decimals))) {
            continue;
        } else {
            return [randTokenFrom, randTokenTo];
        }
    }
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

// function to make a token instance
function tokenInstance(contract) {
    return new web3.eth.Contract(erc20Abi, contract);
}

module.exports = {
    parseData,
    randomozeWallet,
    randomizeTokens,
    approveTokens,
    tokenInstance
}