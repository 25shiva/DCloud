// SPDX-License-Identifier: GPL-3.0
import "node_modules/hardhat/console.sol";

pragma solidity ^0.8.20;

contract Upload {
    struct Access {
        address user;
        bool access; // true or false
    }

    mapping(address => string[]) private value;
    mapping(address => mapping(address => bool)) private ownership;
    mapping(address => Access[]) private accessList;
    mapping(address => mapping(address => bool)) private previousData;

    event FileAdded(address indexed user, string url);
    event AccessGranted(address indexed owner, address indexed user);
    event AccessRevoked(address indexed owner, address indexed user);

    function add(address _user, string memory url) external {
        value[_user].push(url);
        emit FileAdded(_user, url);
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if (previousData[msg.sender][user]) {
            for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
        emit AccessGranted(msg.sender, user);
    }

    function disallow(address user) external {
        ownership[msg.sender][user] = false;
        for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
        emit AccessRevoked(msg.sender, user);
    }

    function display(address _user) external view returns (string[] memory) {
        // require(
        //     _user == msg.sender || ownership[_user][msg.sender],
        //     "You don't have access"
        // );
        console.log("Sender address:", msg.sender);
        return value[_user];
    }

    function shareAccess() external view returns (Access[] memory) {
        console.log("Sender address:", msg.sender);
        return accessList[msg.sender];
    }
}
