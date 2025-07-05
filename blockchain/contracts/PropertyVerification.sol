// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PropertyVerification is Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _propertyIds;
    
    struct Property {
        uint256 id;
        string propertyHash;
        address owner;
        string title;
        string location;
        uint256 price;
        bool isVerified;
        bool isActive;
        uint256 createdAt;
        uint256 verifiedAt;
        address verifiedBy;
    }
    
    struct Agent {
        address agentAddress;
        string licenseNumber;
        string name;
        bool isVerified;
        bool isActive;
        uint256 registeredAt;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(address => Agent) public agents;
    mapping(address => bool) public verifiedAgents;
    mapping(string => bool) public propertyHashes;
    
    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string propertyHash);
    event PropertyVerified(uint256 indexed propertyId, address indexed verifiedBy);
    event AgentRegistered(address indexed agentAddress, string licenseNumber);
    event AgentVerified(address indexed agentAddress);
    event PropertyUpdated(uint256 indexed propertyId, address indexed owner);
    event PropertyDeactivated(uint256 indexed propertyId);
    
    modifier onlyVerifiedAgent() {
        require(agents[msg.sender].isVerified, "Only verified agents can perform this action");
        require(agents[msg.sender].isActive, "Agent account is not active");
        _;
    }
    
    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].owner == msg.sender, "Only property owner can perform this action");
        _;
    }
    
    constructor() {
        _propertyIds.increment(); // Start from 1
    }
    
    function registerProperty(
        string memory propertyHash,
        string memory title,
        string memory location,
        uint256 price
    ) external whenNotPaused returns (uint256) {
        require(bytes(propertyHash).length > 0, "Property hash cannot be empty");
        require(!propertyHashes[propertyHash], "Property hash already exists");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(price > 0, "Price must be greater than 0");
        
        uint256 propertyId = _propertyIds.current();
        _propertyIds.increment();
        
        properties[propertyId] = Property({
            id: propertyId,
            propertyHash: propertyHash,
            owner: msg.sender,
            title: title,
            location: location,
            price: price,
            isVerified: false,
            isActive: true,
            createdAt: block.timestamp,
            verifiedAt: 0,
            verifiedBy: address(0)
        });
        
        propertyHashes[propertyHash] = true;
        
        emit PropertyRegistered(propertyId, msg.sender, propertyHash);
        
        return propertyId;
    }
    
    function verifyProperty(uint256 propertyId) external onlyVerifiedAgent whenNotPaused {
        require(properties[propertyId].id != 0, "Property does not exist");
        require(properties[propertyId].isActive, "Property is not active");
        require(!properties[propertyId].isVerified, "Property is already verified");
        
        properties[propertyId].isVerified = true;
        properties[propertyId].verifiedAt = block.timestamp;
        properties[propertyId].verifiedBy = msg.sender;
        
        emit PropertyVerified(propertyId, msg.sender);
    }
    
    function updateProperty(
        uint256 propertyId,
        string memory title,
        string memory location,
        uint256 price
    ) external onlyPropertyOwner(propertyId) whenNotPaused {
        require(properties[propertyId].isActive, "Property is not active");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(price > 0, "Price must be greater than 0");
        
        properties[propertyId].title = title;
        properties[propertyId].location = location;
        properties[propertyId].price = price;
        properties[propertyId].isVerified = false; // Reset verification
        properties[propertyId].verifiedAt = 0;
        properties[propertyId].verifiedBy = address(0);
        
        emit PropertyUpdated(propertyId, msg.sender);
    }
    
    function deactivateProperty(uint256 propertyId) external onlyPropertyOwner(propertyId) whenNotPaused {
        require(properties[propertyId].isActive, "Property is already inactive");
        
        properties[propertyId].isActive = false;
        
        emit PropertyDeactivated(propertyId);
    }
    
    function registerAgent(
        string memory licenseNumber,
        string memory name
    ) external whenNotPaused {
        require(bytes(licenseNumber).length > 0, "License number cannot be empty");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!agents[msg.sender].isActive, "Agent already registered");
        
        agents[msg.sender] = Agent({
            agentAddress: msg.sender,
            licenseNumber: licenseNumber,
            name: name,
            isVerified: false,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        emit AgentRegistered(msg.sender, licenseNumber);
    }
    
    function verifyAgent(address agentAddress) external onlyOwner whenNotPaused {
        require(agents[agentAddress].isActive, "Agent is not registered");
        require(!agents[agentAddress].isVerified, "Agent is already verified");
        
        agents[agentAddress].isVerified = true;
        verifiedAgents[agentAddress] = true;
        
        emit AgentVerified(agentAddress);
    }
    
    function deactivateAgent(address agentAddress) external onlyOwner whenNotPaused {
        require(agents[agentAddress].isActive, "Agent is not active");
        
        agents[agentAddress].isActive = false;
        agents[agentAddress].isVerified = false;
        verifiedAgents[agentAddress] = false;
    }
    
    // View functions
    function getProperty(uint256 propertyId) external view returns (Property memory) {
        return properties[propertyId];
    }
    
    function getAgent(address agentAddress) external view returns (Agent memory) {
        return agents[agentAddress];
    }
    
    function isAgentVerified(address agentAddress) external view returns (bool) {
        return agents[agentAddress].isVerified && agents[agentAddress].isActive;
    }
    
    function isPropertyVerified(uint256 propertyId) external view returns (bool) {
        return properties[propertyId].isVerified && properties[propertyId].isActive;
    }
    
    function getPropertyCount() external view returns (uint256) {
        return _propertyIds.current() - 1;
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        super.transferOwnership(newOwner);
    }
}
