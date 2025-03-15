
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ScholarshipContract.sol";

/**
 * @title ScholarshipFactory
 * @dev Contract for creating and managing scholarship contracts
 */
contract ScholarshipFactory {
    address public owner;
    ScholarshipContract[] public scholarships;
    mapping(address => ScholarshipContract[]) public sponsorScholarships;
    mapping(address => mapping(address => bool)) public studentApprovals;
    
    event ScholarshipCreated(address indexed sponsor, address contractAddress, string title);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new scholarship contract
     * @param _title Title of the scholarship
     * @param _description Description of the scholarship
     * @param _durationDays Duration of the scholarship in days
     * @return The address of the newly created contract
     */
    function createScholarship(
        string memory _title,
        string memory _description,
        uint256 _durationDays
    ) external returns (address) {
        ScholarshipContract newScholarship = new ScholarshipContract(
            msg.sender,
            _title,
            _description,
            _durationDays
        );
        
        scholarships.push(newScholarship);
        sponsorScholarships[msg.sender].push(newScholarship);
        
        emit ScholarshipCreated(msg.sender, address(newScholarship), _title);
        return address(newScholarship);
    }
    
    /**
     * @dev Get all scholarships
     * @return Array of scholarship contract addresses
     */
    function getAllScholarships() external view returns (ScholarshipContract[] memory) {
        return scholarships;
    }
    
    /**
     * @dev Get scholarships created by a specific sponsor
     * @param _sponsor Address of the sponsor
     * @return Array of scholarship contract addresses
     */
    function getScholarshipsBySponsor(address _sponsor) external view returns (ScholarshipContract[] memory) {
        return sponsorScholarships[_sponsor];
    }
    
    /**
     * @dev Get the count of all scholarships
     * @return Number of scholarships
     */
    function getScholarshipCount() external view returns (uint256) {
        return scholarships.length;
    }
}
