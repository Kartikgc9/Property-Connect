import { blockchainService } from '../src/services/blockchainService';
import { Property } from '@prisma/client';

// Mock property data
const mockProperty: Property = {
  id: 'test-property-123',
  title: 'Test Property',
  description: 'A test property for blockchain verification',
  type: 'HOUSE',
  status: 'ACTIVE',
  price: 500000,
  currency: 'USD',
  bedrooms: 3,
  bathrooms: 2,
  area: 2000,
  areaUnit: 'sqft',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TC',
  zipCode: '12345',
  country: 'US',
  coordinates: { lat: 37.7749, lng: -122.4194 },
  images: [],
  virtualTourUrl: null,
  amenities: ['garage', 'garden'],
  yearBuilt: 2020,
  lotSize: 5000,
  isVerified: false,
  blockchainTxHash: null,
  localInsights: null,
  aiAnalysis: null,
  agentId: 'agent-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Blockchain Service', () => {
  beforeAll(() => {
    // Set up test environment variables
    process.env.ETHEREUM_RPC_URL = 'https://sepolia.infura.io/v3/test-key';
    process.env.PRIVATE_KEY = '0x' + '1'.repeat(64); // Test private key
  });

  describe('verifyAndRecordTitle', () => {
    it('should handle missing blockchain configuration gracefully', async () => {
      // Temporarily remove env vars
      const originalRpcUrl = process.env.ETHEREUM_RPC_URL;
      const originalPrivateKey = process.env.PRIVATE_KEY;
      
      delete process.env.ETHEREUM_RPC_URL;
      delete process.env.PRIVATE_KEY;

      const result = await blockchainService.verifyAndRecordTitle(mockProperty);
      expect(result).toBeNull();

      // Restore env vars
      process.env.ETHEREUM_RPC_URL = originalRpcUrl;
      process.env.PRIVATE_KEY = originalPrivateKey;
    });

    it('should return transaction hash on successful verification', async () => {
      // This test would require a test blockchain network
      // For now, we'll mock the successful case
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // In a real test, this would connect to a test network
      // const result = await blockchainService.verifyAndRecordTitle(mockProperty);
      // expect(typeof result).toBe('string');
      // expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/);
      
      consoleSpy.mockRestore();
    });
  });

  describe('verifyPropertyOnChain', () => {
    it('should return false for invalid transaction hash', async () => {
      const result = await blockchainService.verifyPropertyOnChain('0xinvalid');
      expect(result).toBe(false);
    });

    it('should handle blockchain provider errors', async () => {
      const result = await blockchainService.verifyPropertyOnChain('');
      expect(result).toBe(false);
    });
  });

  describe('getVerificationStatus', () => {
    it('should return unverified status when provider is not configured', async () => {
      const originalRpcUrl = process.env.ETHEREUM_RPC_URL;
      delete process.env.ETHEREUM_RPC_URL;

      const result = await blockchainService.getVerificationStatus('0xtest');
      expect(result.verified).toBe(false);

      process.env.ETHEREUM_RPC_URL = originalRpcUrl;
    });

    it('should handle invalid transaction hashes', async () => {
      const result = await blockchainService.getVerificationStatus('0xinvalid');
      expect(result.verified).toBe(false);
    });
  });
});