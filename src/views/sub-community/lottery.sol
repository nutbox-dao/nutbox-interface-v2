// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Lottery is Ownable {
    using SafeMath for uint256;

    uint256 constant ONE_HOUR = 3600;
    uint256 constant MEMBER_COUNT_PER_ROUND = 10;

    uint256 public price;
    uint256 public startTime;

    address[] public members;

    event AdminUpdatePrice(uint256 price);
    event NewBuer(address indexed buyer);
    event GrantLottery(address indexed from, address indexed to);
    event NewWinner(address indexed winner);

    constructor(uint256 _price) {
        price = _price;
    }

    modifier onlyMember(address user) {
        bool flag = false;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == user) {
                flag = true;
                break;
            }
        }
        require(flag, "caller is not a memeber");
        _;
    }

    function adminUpdatePrice(uint256 _price) public onlyOwner {
        price = _price;
        emit AdminUpdatePrice(price);
    }

    function buy() external payable {
        require(msg.value == price, "Wrong price");
        uint8 memberCount = members.length;
        if (memberCount == 0) {
            startTime = block.timestamp;
        }
        if (block.timestamp - startTime > ONE_HOUR || memberCount == MEMBER_COUNT_PER_ROUND) {
            releaseReward();
            members = [];
        }
        members.push(msg.sender);
        emit NewBuyer(msg.sender);
    }

    function grantLottery(address to) public onlyMember(msg.sender){
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = to;
                break;
            }
        }
        emit GrantLottery(msg.sender, to);
    }

    function releaseReward() private payable {
        uint256 idx = uint256(keccak256(block.timestamp)).mod(members.length);
        uint256 balance = address(this).balance;
        Address.sendValue(members[idx], balance);
        startTime = block.timestamp;
        emit NewWinner(members[idx]);
    }
}