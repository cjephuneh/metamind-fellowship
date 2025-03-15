
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ScholarshipContract.sol";
import "./ScholarshipEscrow.sol";

/**
 * @title ScholarshipMarketplace
 * @dev Contract for listing, searching, and applying to scholarships
 */
contract ScholarshipMarketplace {
    address public owner;
    uint256 public platformFee; // Fee in basis points (1/100 of 1%)
    
    struct ScholarshipListing {
        address contractAddress;
        address sponsor;
        string title;
        string description;
        string category;
        uint256 amount;
        uint256 deadline;
        uint256 createdAt;
        uint8 minGPA;
        bool isEscrow;
        bool isActive;
    }
    
    struct Application {
        address student;
        string statement;
        string[] documentHashes;
        uint256 submittedAt;
        bool approved;
    }
    
    // Array of all scholarship listings
    ScholarshipListing[] public scholarships;
    
    // Mapping from scholarship index to student applications
    mapping(uint256 => Application[]) public applications;
    
    // Mapping from student address to scholarship indices they've applied to
    mapping(address => uint256[]) public studentApplications;
    
    // Mapping from address to verified status
    mapping(address => bool) public verifiedSponsors;
    
    // Mapping from category to scholarship indices
    mapping(string => uint256[]) public scholarshipsByCategory;
    
    // Events
    event ScholarshipListed(uint256 indexed index, address contractAddress, address sponsor, string title);
    event ApplicationSubmitted(uint256 indexed scholarshipIndex, address student);
    event ApplicationApproved(uint256 indexed scholarshipIndex, address student);
    event PlatformFeeUpdated(uint256 newFee);
    event SponsorVerified(address sponsor);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validScholarshipIndex(uint256 _index) {
        require(_index < scholarships.length, "Invalid scholarship index");
        _;
    }
    
    /**
     * @dev Initialize the marketplace
     * @param _platformFee Initial platform fee in basis points
     */
    constructor(uint256 _platformFee) {
        owner = msg.sender;
        platformFee = _platformFee;
    }
    
    /**
     * @dev List a scholarship on the marketplace
     * @param _contractAddress Address of the scholarship or escrow contract
     * @param _title Title of the scholarship
     * @param _description Description of the scholarship
     * @param _category Category of the scholarship (e.g., "STEM", "Arts")
     * @param _amount Total amount of the scholarship
     * @param _deadline Application deadline timestamp
     * @param _minGPA Minimum GPA requirement
     * @param _isEscrow Whether the contract is an escrow contract
     */
    function listScholarship(
        address _contractAddress,
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _amount,
        uint256 _deadline,
        uint8 _minGPA,
        bool _isEscrow
    ) external {
        // Ensure contract exists (simplified check)
        require(_contractAddress != address(0), "Invalid contract address");
        
        // Platform fee payment
        uint256 feeAmount = (_amount * platformFee) / 10000;
        require(msg.value >= feeAmount, "Insufficient platform fee");
        
        // Add scholarship listing
        scholarships.push(ScholarshipListing({
            contractAddress: _contractAddress,
            sponsor: msg.sender,
            title: _title,
            description: _description,
            category: _category,
            amount: _amount,
            deadline: _deadline,
            createdAt: block.timestamp,
            minGPA: _minGPA,
            isEscrow: _isEscrow,
            isActive: true
        }));
        
        // Add to category mapping
        scholarshipsByCategory[_category].push(scholarships.length - 1);
        
        // Transfer platform fee to contract owner
        payable(owner).transfer(feeAmount);
        
        // Refund excess payment
        if (msg.value > feeAmount) {
            payable(msg.sender).transfer(msg.value - feeAmount);
        }
        
        emit ScholarshipListed(scholarships.length - 1, _contractAddress, msg.sender, _title);
    }
    
    /**
     * @dev Submit an application for a scholarship
     * @param _scholarshipIndex Index of the scholarship
     * @param _statement Personal statement
     * @param _documentHashes Array of document hashes (e.g., IPFS hashes)
     */
    function applyForScholarship(
        uint256 _scholarshipIndex,
        string memory _statement,
        string[] memory _documentHashes
    ) external validScholarshipIndex(_scholarshipIndex) {
        ScholarshipListing storage listing = scholarships[_scholarshipIndex];
        
        require(listing.isActive, "Scholarship is not active");
        require(block.timestamp < listing.deadline, "Application deadline has passed");
        
        // Check if student has already applied
        bool alreadyApplied = false;
        for (uint i = 0; i < studentApplications[msg.sender].length; i++) {
            if (studentApplications[msg.sender][i] == _scholarshipIndex) {
                alreadyApplied = true;
                break;
            }
        }
        require(!alreadyApplied, "Already applied to this scholarship");
        
        // Create application
        applications[_scholarshipIndex].push(Application({
            student: msg.sender,
            statement: _statement,
            documentHashes: _documentHashes,
            submittedAt: block.timestamp,
            approved: false
        }));
        
        // Add to student's applications
        studentApplications[msg.sender].push(_scholarshipIndex);
        
        emit ApplicationSubmitted(_scholarshipIndex, msg.sender);
    }
    
    /**
     * @dev Approve a student's application
     * @param _scholarshipIndex Index of the scholarship
     * @param _applicationIndex Index of the application
     */
    function approveApplication(
        uint256 _scholarshipIndex,
        uint256 _applicationIndex
    ) external validScholarshipIndex(_scholarshipIndex) {
        ScholarshipListing storage listing = scholarships[_scholarshipIndex];
        require(msg.sender == listing.sponsor, "Only sponsor can approve applications");
        
        require(_applicationIndex < applications[_scholarshipIndex].length, "Invalid application index");
        Application storage application = applications[_scholarshipIndex][_applicationIndex];
        
        require(!application.approved, "Application already approved");
        application.approved = true;
        
        emit ApplicationApproved(_scholarshipIndex, application.student);
    }
    
    /**
     * @dev Set a new platform fee
     * @param _newFee New fee in basis points
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    /**
     * @dev Verify a sponsor
     * @param _sponsor Address of the sponsor to verify
     */
    function verifySponsor(address _sponsor) external onlyOwner {
        verifiedSponsors[_sponsor] = true;
        emit SponsorVerified(_sponsor);
    }
    
    /**
     * @dev Deactivate a scholarship listing
     * @param _scholarshipIndex Index of the scholarship
     */
    function deactivateScholarship(uint256 _scholarshipIndex) external validScholarshipIndex(_scholarshipIndex) {
        ScholarshipListing storage listing = scholarships[_scholarshipIndex];
        require(msg.sender == listing.sponsor || msg.sender == owner, "Not authorized");
        
        listing.isActive = false;
    }
    
    /**
     * @dev Get all scholarships
     * @return Array of scholarship listings
     */
    function getAllScholarships() external view returns (ScholarshipListing[] memory) {
        return scholarships;
    }
    
    /**
     * @dev Get scholarships by category
     * @param _category Category to filter by
     * @return Array of scholarship indices in the category
     */
    function getScholarshipsByCategory(string memory _category) external view returns (uint256[] memory) {
        return scholarshipsByCategory[_category];
    }
    
    /**
     * @dev Get applications for a scholarship
     * @param _scholarshipIndex Index of the scholarship
     * @return Array of applications
     */
    function getScholarshipApplications(uint256 _scholarshipIndex) 
        external 
        view 
        validScholarshipIndex(_scholarshipIndex) 
        returns (Application[] memory) 
    {
        return applications[_scholarshipIndex];
    }
    
    /**
     * @dev Get a student's applications
     * @param _student Address of the student
     * @return Array of scholarship indices the student has applied to
     */
    function getStudentApplications(address _student) external view returns (uint256[] memory) {
        return studentApplications[_student];
    }
    
    /**
     * @dev Get scholarship count
     * @return Number of scholarships
     */
    function getScholarshipCount() external view returns (uint256) {
        return scholarships.length;
    }
}
