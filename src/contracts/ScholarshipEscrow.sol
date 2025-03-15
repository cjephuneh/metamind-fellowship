
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ScholarshipEscrow
 * @dev Smart contract for secure escrow of scholarship funds with verification
 */
contract ScholarshipEscrow {
    address public owner;
    address public sponsor;
    address public student;
    address public verifier;
    
    uint256 public totalAmount;
    uint256 public releasedAmount;
    uint256 public lastActivityTime;
    bool public isActive = true;
    
    enum MilestoneStatus { Pending, Submitted, Verified, Released, Disputed }
    
    struct Milestone {
        string description;
        uint256 amount;
        string evidenceHash;
        MilestoneStatus status;
        uint256 submissionTime;
        string verifierNotes;
    }
    
    Milestone[] public milestones;
    
    event FundsDeposited(address indexed sponsor, uint256 amount);
    event MilestoneAdded(uint256 indexed milestoneId, string description, uint256 amount);
    event MilestoneSubmitted(uint256 indexed milestoneId, string evidenceHash);
    event MilestoneVerified(uint256 indexed milestoneId, address verifier);
    event FundsReleased(uint256 indexed milestoneId, address recipient, uint256 amount);
    event DisputeRaised(uint256 indexed milestoneId, address disputeInitiator);
    event DisputeResolved(uint256 indexed milestoneId, bool fundReleased);
    event ContractClosed(uint256 remainingFunds, address recipient);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlySponsor() {
        require(msg.sender == sponsor, "Only sponsor can call this function");
        _;
    }
    
    modifier onlyStudent() {
        require(msg.sender == student, "Only student can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    modifier onlyActiveContract() {
        require(isActive, "Contract is no longer active");
        _;
    }
    
    /**
     * @dev Initialize the escrow contract
     * @param _sponsor Address of the sponsor (funder)
     * @param _student Address of the student (recipient)
     * @param _verifier Address of the verifier (can be the sponsor or a third party)
     */
    constructor(
        address _sponsor,
        address _student,
        address _verifier
    ) {
        owner = msg.sender;
        sponsor = _sponsor;
        student = _student;
        verifier = _verifier;
        lastActivityTime = block.timestamp;
    }
    
    /**
     * @dev Deposit funds into the escrow
     */
    function depositFunds() external payable onlySponsor onlyActiveContract {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        totalAmount += msg.value;
        lastActivityTime = block.timestamp;
        emit FundsDeposited(sponsor, msg.value);
    }
    
    /**
     * @dev Add a milestone to the escrow
     * @param _description Description of the milestone
     * @param _amount Amount to release upon completion
     */
    function addMilestone(string memory _description, uint256 _amount) external onlySponsor onlyActiveContract {
        require(_amount > 0, "Amount must be greater than 0");
        require(getTotalMilestonesAmount() + _amount <= totalAmount, "Insufficient funds for milestone");
        
        milestones.push(Milestone({
            description: _description,
            amount: _amount,
            evidenceHash: "",
            status: MilestoneStatus.Pending,
            submissionTime: 0,
            verifierNotes: ""
        }));
        
        lastActivityTime = block.timestamp;
        emit MilestoneAdded(milestones.length - 1, _description, _amount);
    }
    
    /**
     * @dev Submit evidence for milestone completion
     * @param _milestoneId Index of the milestone
     * @param _evidenceHash IPFS hash or other reference to evidence of completion
     */
    function submitMilestone(uint256 _milestoneId, string memory _evidenceHash) external onlyStudent onlyActiveContract {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        Milestone storage milestone = milestones[_milestoneId];
        
        require(milestone.status == MilestoneStatus.Pending, "Milestone is not in pending state");
        require(bytes(_evidenceHash).length > 0, "Evidence hash cannot be empty");
        
        milestone.evidenceHash = _evidenceHash;
        milestone.status = MilestoneStatus.Submitted;
        milestone.submissionTime = block.timestamp;
        
        lastActivityTime = block.timestamp;
        emit MilestoneSubmitted(_milestoneId, _evidenceHash);
    }
    
    /**
     * @dev Verify a milestone and optionally release funds
     * @param _milestoneId Index of the milestone
     * @param _verified Whether the milestone is verified
     * @param _notes Optional notes from verifier
     */
    function verifyMilestone(uint256 _milestoneId, bool _verified, string memory _notes) 
        external 
        onlyVerifier 
        onlyActiveContract 
    {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        Milestone storage milestone = milestones[_milestoneId];
        
        require(milestone.status == MilestoneStatus.Submitted, "Milestone is not in submitted state");
        
        if (_verified) {
            milestone.status = MilestoneStatus.Verified;
            milestone.verifierNotes = _notes;
            
            // Release funds
            releasedAmount += milestone.amount;
            milestone.status = MilestoneStatus.Released;
            
            // Transfer funds to student
            payable(student).transfer(milestone.amount);
            
            emit MilestoneVerified(_milestoneId, msg.sender);
            emit FundsReleased(_milestoneId, student, milestone.amount);
        } else {
            // Reject submission
            milestone.status = MilestoneStatus.Pending;
            milestone.evidenceHash = "";
            milestone.submissionTime = 0;
            milestone.verifierNotes = _notes;
        }
        
        lastActivityTime = block.timestamp;
    }
    
    /**
     * @dev Raise a dispute for a milestone
     * @param _milestoneId Index of the milestone
     */
    function raiseMilestoneDispute(uint256 _milestoneId) external onlyActiveContract {
        require(msg.sender == student || msg.sender == sponsor, "Only student or sponsor can raise disputes");
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        
        Milestone storage milestone = milestones[_milestoneId];
        require(milestone.status == MilestoneStatus.Submitted || milestone.status == MilestoneStatus.Verified, 
               "Milestone cannot be disputed in current state");
        
        milestone.status = MilestoneStatus.Disputed;
        lastActivityTime = block.timestamp;
        
        emit DisputeRaised(_milestoneId, msg.sender);
    }
    
    /**
     * @dev Resolve a dispute for a milestone
     * @param _milestoneId Index of the milestone
     * @param _releaseToStudent Whether to release funds to student
     */
    function resolveDispute(uint256 _milestoneId, bool _releaseToStudent) external onlyOwner onlyActiveContract {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        Milestone storage milestone = milestones[_milestoneId];
        
        require(milestone.status == MilestoneStatus.Disputed, "Milestone is not disputed");
        
        if (_releaseToStudent) {
            // Release funds to student
            releasedAmount += milestone.amount;
            milestone.status = MilestoneStatus.Released;
            
            // Transfer funds to student
            payable(student).transfer(milestone.amount);
            
            emit FundsReleased(_milestoneId, student, milestone.amount);
        } else {
            // Return milestone to pending
            milestone.status = MilestoneStatus.Pending;
            milestone.evidenceHash = "";
            milestone.submissionTime = 0;
        }
        
        lastActivityTime = block.timestamp;
        emit DisputeResolved(_milestoneId, _releaseToStudent);
    }
    
    /**
     * @dev Close the contract and withdraw remaining funds
     */
    function closeContract() external onlySponsor {
        require(block.timestamp > lastActivityTime + 30 days, "Can only close after 30 days of inactivity");
        
        isActive = false;
        uint256 remainingFunds = totalAmount - releasedAmount;
        
        if (remainingFunds > 0) {
            payable(sponsor).transfer(remainingFunds);
        }
        
        emit ContractClosed(remainingFunds, sponsor);
    }
    
    /**
     * @dev Get total amount allocated to milestones
     * @return Sum of all milestone amounts
     */
    function getTotalMilestonesAmount() public view returns (uint256) {
        uint256 total = 0;
        for (uint i = 0; i < milestones.length; i++) {
            total += milestones[i].amount;
        }
        return total;
    }
    
    /**
     * @dev Get number of milestones
     * @return Number of milestones
     */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }
    
    /**
     * @dev Get milestone details
     * @param _milestoneId Index of the milestone
     * @return description, amount, evidenceHash, status, submissionTime, verifierNotes
     */
    function getMilestoneDetails(uint256 _milestoneId) external view returns (
        string memory, 
        uint256, 
        string memory, 
        MilestoneStatus, 
        uint256,
        string memory
    ) {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        Milestone memory milestone = milestones[_milestoneId];
        
        return (
            milestone.description,
            milestone.amount,
            milestone.evidenceHash,
            milestone.status,
            milestone.submissionTime,
            milestone.verifierNotes
        );
    }
    
    /**
     * @dev Get contract status summary
     * @return totalAmount, releasedAmount, remainingAmount, unallocatedAmount, isActive
     */
    function getContractSummary() external view returns (
        uint256, 
        uint256, 
        uint256,
        uint256,
        bool
    ) {
        uint256 allocatedAmount = getTotalMilestonesAmount();
        uint256 remainingAmount = totalAmount - releasedAmount;
        uint256 unallocatedAmount = totalAmount - allocatedAmount;
        
        return (
            totalAmount,
            releasedAmount,
            remainingAmount,
            unallocatedAmount,
            isActive
        );
    }
}
