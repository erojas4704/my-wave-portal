pragma solidity ^0.8.0;

import "hardhat/console.sol";

//TODO make an unique functionality when i understand this
//maybe an array that does... something
contract WavePortal {
    uint256 totalWaves;
    uint256 seed;
    Wave[] waves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Contract deployed");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        console.log("%s waves", msg.sender);

        
        console.log("%d waved at ", lastWavedAt[msg.sender]);

        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30 seconds"
        );

        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;

        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Not enough ether to pay prize"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Prize payment failed");
        }
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves.", totalWaves);
        return totalWaves;
    }
}
