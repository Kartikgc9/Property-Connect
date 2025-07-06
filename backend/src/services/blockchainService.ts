import { Property } from '@prisma/client';
import { logger } from '../middleware/logger';
import { ethers } from 'ethers';

// This service acts as a thin layer around the Ethereum JSON-RPC provider (Infura / Alchemy)
// For the MVP we just record a hash of the property ID on-chain for immutability.

const providerUrl = process.env.ETHEREUM_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS; // Optional – if using a custom contract

let wallet: ethers.Wallet | null = null;
let provider: ethers.JsonRpcProvider | null = null;

if (providerUrl && privateKey) {
  try {
    provider = new ethers.JsonRpcProvider(providerUrl);
    wallet = new ethers.Wallet(privateKey, provider);
    logger.info('Blockchain service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize blockchain service', error);
  }
}

export const blockchainService = {
  /**
   * Generates a simple hash for the property and writes it to the blockchain.
   * On success the tx hash is stored back to the DB (outside of this service).
   */
  async verifyAndRecordTitle(property: Property): Promise<string | null> {
    if (!wallet || !provider) {
      logger.warn('Blockchain wallet not configured – skipping on-chain verification');
      return null;
    }

    try {
      // Check network connection
      await provider.getNetwork();
      
      // Encode property ID and timestamp into calldata (cheap on-chain footprint)
      const propertyData = {
        id: property.id,
        title: property.title,
        address: property.address,
        timestamp: Date.now()
      };
      
      const data = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(propertyData)));

      // Send 0 ETH transaction with data to self (acts as permanent notary)
      const tx = await wallet.sendTransaction({
        to: wallet.address,
        data,
        gasLimit: 21000 + Math.ceil(data.length / 2) * 16, // Base gas + data gas
      });

      logger.info(`Submitted title verification tx ${tx.hash} for property ${property.id}`);

      // Optionally wait for confirmation – we do it in background
      tx.wait().then((receipt) => {
        if (receipt) {
          logger.info(`Tx ${tx.hash} confirmed in block ${receipt.blockNumber}`);
        }
      }).catch((error) => {
        logger.error(`Tx ${tx.hash} failed confirmation`, error);
      });

      return tx.hash;
    } catch (err) {
      logger.error('Blockchain tx failed', err);
      throw err;
    }
  },

  /**
   * Verify a property exists on blockchain by transaction hash
   */
  async verifyPropertyOnChain(txHash: string): Promise<boolean> {
    if (!provider) {
      logger.warn('Blockchain provider not configured');
      return false;
    }

    try {
      const tx = await provider.getTransaction(txHash);
      return tx !== null;
    } catch (error) {
      logger.error('Failed to verify property on blockchain', error);
      return false;
    }
  },

  /**
   * Get blockchain verification status
   */
  async getVerificationStatus(txHash: string): Promise<{ verified: boolean; blockNumber?: number; confirmations?: number }> {
    if (!provider) {
      return { verified: false };
    }

    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        return { verified: true, confirmations: 0 };
      }

      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        return { verified: true, confirmations: 0 };
      }

      const currentBlock = await provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber + 1;

      return {
        verified: true,
        blockNumber: receipt.blockNumber,
        confirmations
      };
    } catch (error) {
      logger.error('Failed to get verification status', error);
      return { verified: false };
    }
  }
};