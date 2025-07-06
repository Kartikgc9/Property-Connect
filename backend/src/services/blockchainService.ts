import { Property } from '@prisma/client';
import { logger } from '../middleware/logger';
import { ethers } from 'ethers';

// This service acts as a thin layer around the Ethereum JSON-RPC provider (Infura / Alchemy)
// For the MVP we just record a hash of the property ID on-chain for immutability.

const providerUrl = process.env.ETHEREUM_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS; // Optional – if using a custom contract

let wallet: ethers.Wallet | null = null;
if (providerUrl && privateKey) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  wallet = new ethers.Wallet(privateKey, provider);
}

export const blockchainService = {
  /**
   * Generates a simple hash for the property and writes it to the blockchain.
   * On success the tx hash is stored back to the DB (outside of this service).
   */
  async verifyAndRecordTitle(property: Property) {
    if (!wallet) {
      logger.warn('Blockchain wallet not configured – skipping on-chain verification');
      return;
    }

    try {
      // Encode property ID and timestamp into calldata (cheap on-chain footprint)
      const data = ethers.hexlify(ethers.toUtf8Bytes(`${property.id}:${Date.now()}`));

      // Send 0 ETH transaction with data to self (acts as permanent notary)
      const tx = await wallet.sendTransaction({
        to: wallet.address,
        data,
      });

      logger.info(`Submitted title verification tx ${tx.hash} for property ${property.id}`);

      // Optionally wait for confirmation – we do it in background
      tx.wait().then(() => {
        logger.info(`Tx ${tx.hash} confirmed`);
      });

      return tx.hash;
    } catch (err) {
      logger.error('Blockchain tx failed', err);
      throw err;
    }
  },
};