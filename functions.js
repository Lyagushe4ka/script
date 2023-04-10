// parsing private keys and proxies from files
function parseData() {
    if (fs.existsSync('txCount.json')) {
        const data = fs.readFileSync('PrivateKeys.txt').toString();
        const keys = data.split('\n');

        const txData = fs.readFileSync('txCount.json')
        accObjects = JSON.parse(txData);

        if (accObjects.length == keys.length) {
            return;
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
    }
}

module.exports = {
    parseData
}