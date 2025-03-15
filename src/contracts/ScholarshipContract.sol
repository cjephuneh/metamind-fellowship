
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ScholarshipContract
 * @dev Smart contract for managing scholarships on the EduChain platform
 */
contract ScholarshipContract {
    address public owner;
    address public sponsor;
    string public title;
    string public description;
    uint256 public totalFunds;
    uint256 public remainingFunds;
    uint256 public deadlineTimestamp;
    bool public isActive;
    
    struct Milestone {
        string description;
        uint8 percentageToRelease;
        bool completed;
    }
    
    struct Student {
        address studentAddress;
        string name;
        string email;
        bool isApproved;
        uint256 fundsReceived;
        uint256 milestonesCompleted;
    }
    
    Milestone[] public milestones;
    mapping(address => Student) public students;
    address[] public approvedStudentAddresses;
    
    event ScholarshipFunded(address indexed sponsor, uint256 amount);
    event StudentApproved(address indexed student);
    event MilestoneCompleted(address indexed student, uint256 milestoneIndex, uint256 amountReleased);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlySponsor() {
        require(msg.sender == sponsor, "Only sponsor can call this function");
        _;
    }
    
    modifier scholarshipActive() {
        require(isActive, "Scholarship is not active");
        require(block.timestamp < deadlineTimestamp, "Scholarship deadline has passed");
        _;
    }
    
    /**
     * @dev Initialize the scholarship contract
     * @param _sponsor Address of the sponsor
     * @param _title Title of the scholarship
     * @param _description Description of the scholarship
     * @param _durationDays Duration of the scholarship in days
     */
    constructor(
        address _sponsor,
        string memory _title,
        string memory _description,
        uint256 _durationDays
    ) {
        owner = msg.sender;
        sponsor = _sponsor;
        title = _title;
        description = _description;
        deadlineTimestamp = block.timestamp + (_durationDays * 1 days);
        isActive = true;
    }
    
    /**
     * @dev Fund the scholarship
     */
    function fundScholarship() external payable onlySponsor {
        require(msg.value > 0, "Funding amount must be greater than 0");
        totalFunds += msg.value;
        remainingFunds += msg.value;
        emit ScholarshipFunded(sponsor, msg.value);
    }
    
    /**
     * @dev Add a milestone for fund release
     * @param _description Description of the milestone
     * @param _percentageToRelease Percentage of funds to release upon completion
     */
    function addMilestone(string memory _description, uint8 _percentageToRelease) external onlySponsor {
        require(_percentageToRelease > 0 && _percentageToRelease <= 100, "Percentage must be between 1 and 100");
        
        // Check if total percentage doesn't exceed 100%
        uint8 totalPercentage;
        for (uint i = 0; i < milestones.length; i++) {
            totalPercentage += milestones[i].percentageToRelease;
        }
        require(totalPercentage + _percentageToRelease <= 100, "Total percentage exceeds 100%");
        
        milestones.push(Milestone({
            description: _description,
            percentageToRelease: _percentageToRelease,
            completed: false
        }));
    }
    
    /**
     * @dev Approve a student for the scholarship
     * @param _studentAddress Address of the student
     * @param _name Name of the student
     * @param _email Email of the student
     */
    function approveStudent(address _studentAddress, string memory _name, string memory _email) external onlySponsor scholarshipActive {
        require(_studentAddress != address(0), "Invalid student address");
        require(!students[_studentAddress].isApproved, "Student already approved");
        
        students[_studentAddress] = Student({
            studentAddress: _studentAddress,
            name: _name,
            email: _email,
            isApproved: true,
            fundsReceived: 0,
            milestonesCompleted: 0
        });
        
        approvedStudentAddresses.push(_studentAddress);
        emit StudentApproved(_studentAddress);
    }
    
    /**
     * @dev Complete a milestone for a student and release funds
     * @param _studentAddress Address of the student
     * @param _milestoneIndex Index of the milestone to complete
     */
    function completeMilestone(address _studentAddress, uint256 _milestoneIndex) external onlySponsor scholarshipActive {
        require(students[_studentAddress].isApproved, "Student not approved for this scholarship");
        require(_milestoneIndex < milestones.length, "Invalid milestone index");
        
        Student storage student = students[_studentAddress];
        Milestone storage milestone = milestones[_milestoneIndex];
        
        require(!milestone.completed, "Milestone already completed");
        
        uint256 amountToRelease = (totalFunds * milestone.percentageToRelease) / 100;
        require(remainingFunds >= amountToRelease, "Insufficient funds in contract");
        
        milestone.completed = true;
        student.milestonesCompleted += 1;
        student.fundsReceived += amountToRelease;
        remainingFunds -= amountToRelease;
        
        payable(_studentAddress).transfer(amountToRelease);
        emit MilestoneCompleted(_studentAddress, _milestoneIndex, amountToRelease);
    }
    
    /**
     * @dev Withdraw remaining funds (only after deadline)
     */
    function withdrawRemainingFunds() external onlySponsor {
        require(block.timestamp >= deadlineTimestamp, "Cannot withdraw before deadline");
        require(remainingFunds > 0, "No funds to withdraw");
        
        uint256 amount = remainingFunds;
        remainingFunds = 0;
        
        payable(sponsor).transfer(amount);
        emit FundsWithdrawn(sponsor, amount);
    }
    
    /**
     * @dev Deactivate the scholarship
     */
    function deactivateScholarship() external onlySponsor {
        isActive = false;
    }
    
    /**
     * @dev Get number of milestones
     * @return Number of milestones
     */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }
    
    /**
     * @dev Get number of approved students
     * @return Number of approved students
     */
    function getApprovedStudentCount() external view returns (uint256) {
        return approvedStudentAddresses.length;
    }
    
    /**
     * @dev Get scholarship details
     * @return Title, description, totalFunds, remainingFunds, deadline, isActive
     */
    function getScholarshipDetails() external view returns (
        string memory, 
        string memory, 
        uint256, 
        uint256, 
        uint256, 
        bool
    ) {
        return (
            title,
            description,
            totalFunds,
            remainingFunds,
            deadlineTimestamp,
            isActive
        );
    }
}
