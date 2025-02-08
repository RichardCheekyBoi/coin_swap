const API_URL = "https://api.1inch.io/v5.0/1/swap";

// Perform Swap without Connecting a Wallet
async function swapTokens() {
    const walletAddress = document.getElementById("walletAddress").value;
    const amount = document.getElementById("amount").value;
    const fromToken = document.getElementById("fromToken").value;
    const toToken = document.getElementById("toToken").value;

    if (!walletAddress || !amount) {
        alert("Please enter a wallet address and amount.");
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
        fromAddress: walletAddress,
        slippage: 1
    };

    try {
        const response = await fetch(`${API_URL}?${new URLSearchParams(swapParams)}`);
        const data = await response.json();

        // Display Swap Data
        console.log("Swap Data:", data);
        document.getElementById("tx-status").innerText = "Swap request sent! Check your wallet.";
    } catch (error) {
        console.error("Swap failed:", error);
        document.getElementById("tx-status").innerText = "Swap Failed!";
    }
}
