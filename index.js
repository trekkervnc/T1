const fetch = require("node-fetch");
const walletAddress = "5ndLnEYqSFiA5yUFHo6LVZ1eWc6Rhh11K5CfJNkoHEPs"; // Wallet address
const apiKey = "7ec0218a-ee4c-4f61-8d29-0f6ee4a1bfd1"; // API key
const base_url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${apiKey}`;
let url = base_url;

let lastSignature = null; // Keeps track of the most recent transaction signature


// Function to parse the latest wallet transaction
const parseWallet = async () => {
  try {
    // Fetch transaction data from the API
    const response = await fetch(url);
    const data = await response.json();

    // Check if there are any transactions
    if (data && data.length > 0) {
      const latestTransaction = data[0]; // Get the latest transaction (first in the array)

      // Check if this transaction is new
      if (latestTransaction.signature !== lastSignature) {
        lastSignature = latestTransaction.signature; // Update the last seen signature
        console.log("New Wallet Transaction Detected!");
        console.log("Latest Wallet Transaction Description: ");
        
        // Extract and display the transaction description
        extractTransactionDescription(latestTransaction);
      } else {
        console.log("No new transactions.");
      }
    } else {
      console.log("No transactions found for this wallet.");
    }
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
  }
};

// Function to extract and display transaction description details
const extractTransactionDescription = (transaction) => {
  if (transaction.description && transaction.description.trim() !== '') {
    const description = transaction.description.trim();
    const descriptionLines = description.split(" "); // Split the description into individual words/lines

    // Display each line of the description
    descriptionLines.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });
  } else {
    console.log("No description available for this transaction.");
  }
};

// Continuous monitoring function
const monitorWallet = () => {
  console.log("Starting to monitor wallet address for new transactions...");
  setInterval(parseWallet, 5000); // Poll the API every 5 seconds
};

// Start monitoring the wallet
monitorWallet();
