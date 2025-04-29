// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRecord {
    struct Land {
        uint id;
        address wallet;
        string documentHash;
        bool verified;
    }

    mapping(uint => Land) public lands;
    mapping(address => string[]) public walletToHashes;
    mapping(string => uint) public hashToLandId;

    uint public landCount;

    event LandRegistered(uint indexed id, address wallet, string documentHash);
    event LandVerified(uint indexed id);

    function registerLand(string memory _documentHash) public {
        require(hashToLandId[_documentHash] == 0, "Document already registered");

        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _documentHash, false);

        walletToHashes[msg.sender].push(_documentHash);
        hashToLandId[_documentHash] = landCount;

        emit LandRegistered(landCount, msg.sender, _documentHash);
    }


    function verifyLand(uint _id) public {
        require(_id <= landCount, "Land not found");
        lands[_id].verified = true;
        emit LandVerified(_id);
    }

    function getLandByHash(string memory _documentHash) public view returns (Land memory) {
        uint landId = hashToLandId[_documentHash];
        require(landId != 0, "Land not found for given hash");
        return lands[landId];
    }

    function getHashesByWallet(address _wallet) public view returns (string[] memory) {
        return walletToHashes[_wallet];
    }
}
