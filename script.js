const API_URL = "https://api.1inch.io/v5.0/1/swap";
let userAddress = "";

// Connect to MetaMask
async function connectWallet() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAddress = accounts[0];
        document.getElementById("wallet-address").innerText = `Connected: ${userAddress}`;
    } else {
        alert("MetaMask not found!");
    }
}

// Perform Swap
async function swapTokens() {
    if (!userAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const amount = document.getElementById("amount").value;
    const fromToken = document.getElementById("fromToken").value;
    const toToken = document.getElementById("toToken").value;

    if (!amount) {
        alert("Enter an amount to swap.");
        return;
    }

    // Token Address Mapping
    const tokenAddresses = {
        "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "MATIC": "0x7D1AfA7B718fB893dB30A3aBc0Cfc608aACfeBB0"
    };

    const fromTokenAddress = tokenAddresses[fromToken];
    const toTokenAddress = tokenAddresses[toToken];

    // Call 1inch API for swap data
    const swapParams = {
        fromTokenAddress,
        toTokenAddress,
        amount: (amount * 1e18).toString(),
        fromAddress: userAddress,
        slippage: 1
    };

    try {
        const response = await fetch(`${API_URL}?${new URLSearchParams(swapParams)}`);
        const data = await response.json();

        // Execute transaction using Web3
        const web3 = new Web3(window.ethereum);
        await web3.eth.sendTransaction({
            from: userAddress,
            to: data.tx.to,
            data: data.tx.data,
            gas: data.tx.gas,
            gasPrice: data.tx.gasPrice,
            value: data.tx.value
        });

        document.getElementById("tx-status").innerText = "Swap Successful!";
    } catch (error) {
        console.error("Swap failed:", error);
        document.getElementById("tx-status").innerText = "Swap Failed!";
    }
}
