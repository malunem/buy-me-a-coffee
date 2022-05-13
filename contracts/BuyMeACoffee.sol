//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffee {

    event NewMemo(
      address indexed from,
      uint256 timestamp,
      string name,
      string message
    );

    struct Memo {
      address from;
      uint256 timestamp;
      string name;
      string message;
    }

    address payable owner;

    Memo[] memos;

      constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
      return memos;
    }

    /**
     * @dev buy a coffee for owner (sends and ETH tip and leaves a memo)
     * @param _name is name of the coffee purchaser
     * @param _message is message from the purchaser
     */
    function buyCoffe(string memory _name, string memory _message) public payable {
      require(msg.value > 0, "can't buy coffee for free!");

      memos.push(Memo(
        msg.sender,
        block.timestamp,
        _name,
        _message
      ));

      emit NewMemo(
        msg.sender,
        block.timestamp,
        _name,
        _message
      );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
     function withdrawTips() public {
       require(owner.send(address(this).balance));
     }
}
