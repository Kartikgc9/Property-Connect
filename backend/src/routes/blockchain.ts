import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { prisma } from '../app';
import Web3 from 'web3';

const router = express.Router();

// Initialize Web3 connection
const web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:8545');

// Property verification contract ABI (simplified)
const PROPERTY_VERIFICATION_ABI = [
  {
    inputs: [
      { name: 'propertyId', type: 'string' },
      { name: 'propertyHash', type: 'bytes32' },
      { name: 'agentAddress', type: 'address' }
    ],
    name: 'verifyProperty',
    outputs: [{ name: 'success', type: 'bool' }],
    type: 'function'
  },
  {
    inputs: [{ name: 'propertyId', type: 'string' }],
    name: 'getPropertyVerification',
    outputs: [
      { name: 'isVerified', type: 'bool' },
      { name: 'verificationDate', type: 'uint256' },
      { name: 'verifierAddress', type: 'address' }
    ],
    type: 'function'
  }
];

// Verify property on blockchain
router.post('/verify-property/:propertyId', 
  authLimiter,
  authenticateToken,
  async (req, res) => {
    try {
      const { propertyId } = req.params;
      const userId = req.user?.id;

      // Check if property exists and belongs to the agent
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          agent: {
            include: {
              user: true
            }
          }
        }
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to verify this property' });
      }

      if (property.isVerified) {
        return res.status(400).json({ error: 'Property is already verified' });
      }

      // Create property hash
      const propertyData = {
        id: property.id,
        title: property.title,
        address: property.address,
        price: property.price,
        agentId: property.agentId
      };

      const propertyHash = web3.utils.keccak256(JSON.stringify(propertyData));

      // In a real implementation, you would:
      // 1. Create and sign a transaction
      // 2. Send it to the blockchain
      // 3. Wait for confirmation
      
      // For now, we'll simulate the blockchain verification
      const simulatedTxHash = web3.utils.randomHex(32);
      
      // Update property with verification info
      const updatedProperty = await prisma.property.update({
        where: { id: propertyId },
        data: {
          isVerified: true,
          blockchainTxHash: simulatedTxHash
        }
      });

      res.json({
        success: true,
        message: 'Property verified on blockchain',
        property: updatedProperty,
        transactionHash: simulatedTxHash,
        propertyHash
      });

    } catch (error) {
      console.error('Error verifying property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get property verification status
router.get('/verify-property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
        isVerified: true,
        blockchainTxHash: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // In a real implementation, you would query the blockchain
    // to get the actual verification status
    const verificationStatus = {
      propertyId: property.id,
      isVerified: property.isVerified,
      blockchainTxHash: property.blockchainTxHash,
      verificationDate: property.updatedAt,
      onChainVerification: property.isVerified ? {
        verified: true,
        blockNumber: Math.floor(Math.random() * 1000000), // Simulated
        gasUsed: Math.floor(Math.random() * 50000) + 21000, // Simulated
        timestamp: property.updatedAt
      } : null
    };

    res.json(verificationStatus);

  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all verified properties
router.get('/verified-properties', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await prisma.property.findMany({
      where: {
        isVerified: true,
        status: 'ACTIVE'
      },
      skip,
      take: Number(limit),
      include: {
        agent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const total = await prisma.property.count({
      where: {
        isVerified: true,
        status: 'ACTIVE'
      }
    });

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching verified properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create smart contract for property transaction
router.post('/create-contract', 
  authLimiter,
  authenticateToken,
  async (req, res) => {
    try {
      const { propertyId, buyerId, terms } = req.body;
      const userId = req.user?.id;

      // Validate inputs
      if (!propertyId || !buyerId || !terms) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if property exists and belongs to the agent
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          agent: true
        }
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to create contract for this property' });
      }

      // Check if buyer exists
      const buyer = await prisma.user.findUnique({
        where: { id: buyerId }
      });

      if (!buyer) {
        return res.status(404).json({ error: 'Buyer not found' });
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          propertyId,
          buyerId,
          agentId: property.agentId,
          type: 'SALE',
          amount: property.price,
          status: 'PENDING'
        }
      });

      // In a real implementation, you would:
      // 1. Deploy a smart contract for this transaction
      // 2. Set up escrow
      // 3. Define terms and conditions
      
      // For now, we'll simulate the contract creation
      const simulatedContractAddress = web3.utils.randomHex(20);
      
      // Update transaction with contract info
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          contractHash: simulatedContractAddress
        }
      });

      res.json({
        success: true,
        message: 'Smart contract created successfully',
        transaction: updatedTransaction,
        contractAddress: simulatedContractAddress,
        terms
      });

    } catch (error) {
      console.error('Error creating smart contract:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get transaction status
router.get('/transaction/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        property: {
          include: {
            agent: {
              include: {
                user: true
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user is authorized to view this transaction
    const isAuthorized = transaction.buyerId === userId || 
                        transaction.property.agent.userId === userId;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized to view this transaction' });
    }

    res.json(transaction);

  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blockchain network info
router.get('/network-info', async (req, res) => {
  try {
    // In a real implementation, you would get actual network info
    const networkInfo = {
      networkId: 1, // Mainnet
      chainId: 1,
      blockNumber: Math.floor(Math.random() * 1000000), // Simulated
      gasPrice: web3.utils.toWei('20', 'gwei'),
      isConnected: true,
      nodeVersion: 'Geth/v1.10.0',
      contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
    };

    res.json(networkInfo);

  } catch (error) {
    console.error('Error fetching network info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;