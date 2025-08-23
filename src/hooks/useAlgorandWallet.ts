import { useState, useEffect } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect({
  chainId: 416002, // TestNet
});

// Algorand TestNet configuration with fallback
const algodToken = "";
const algodServer = "https://testnet-api.algonode.cloud";
const algodPort = 443;

let algodClient: algosdk.Algodv2;

try {
  algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
} catch (error) {
  console.warn('Algorand client initialization warning:', error);
  // Create a minimal client for demo purposes
  algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", 443);
}

export interface AlgorandAccount {
  address: string;
  balance: number;
  isConnected: boolean;
}

export function useAlgorandWallet() {
  const [account, setAccount] = useState<AlgorandAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing connection
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        connectAccount(accounts[0]);
      }
    }).catch(console.error);
  }, []);

  const connectAccount = async (address: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(address).do();

      // Safely handle BigInt conversion
      let balanceInAlgos = 0;
      try {
        if (typeof accountInfo.amount === 'bigint') {
          balanceInAlgos = Number(accountInfo.amount) / 1000000;
        } else {
          balanceInAlgos = accountInfo.amount / 1000000;
        }
      } catch (conversionError) {
        console.warn('Balance conversion warning:', conversionError);
        balanceInAlgos = 0;
      }

      setAccount({
        address,
        balance: balanceInAlgos,
        isConnected: true
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching account info:', err);
      setAccount({
        address,
        balance: 0,
        isConnected: true
      });
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        await connectAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect to Pera Wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    peraWallet.disconnect();
    setAccount(null);
    setError(null);
  };

  const refreshBalance = async () => {
    if (account?.address) {
      await connectAccount(account.address);
    }
  };

  // Function to create lottery ticket transaction
  const createLotteryTransaction = async (
    lotteryAppId: number,
    numbers: number[]
  ): Promise<algosdk.Transaction | null> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const params = await algodClient.getTransactionParams().do();
      
      // Create application call transaction for lottery ticket
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: account.address,
        appIndex: lotteryAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from("buy_ticket")),
          new Uint8Array(new Uint32Array(numbers).buffer)
        ],
        suggestedParams: params,
      });

      return appCallTxn;
    } catch (error) {
      console.error('Error creating lottery transaction:', error);
      return null;
    }
  };

  // Function to sign and send transaction
  const signAndSendTransaction = async (
    transaction: algosdk.Transaction
  ): Promise<string | null> => {
    try {
      const signedTxn = await peraWallet.signTransaction([{ txn: transaction }]);
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      return txId;
    } catch (error) {
      console.error('Error signing/sending transaction:', error);
      throw error;
    }
  };

  return {
    account,
    isConnecting,
    error,
    connect,
    disconnect,
    refreshBalance,
    createLotteryTransaction,
    signAndSendTransaction,
    algodClient
  };
}
