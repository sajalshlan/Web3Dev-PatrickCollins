pragma solidity >=0.5.0 <0.6.0;

// import "./safemath.sol";

contract educationalRecord {
    using SafeMath for uint256;

    // enum recordType {
    //     educationalRec,
    //     jobRec
    // }

    struct Record {
        string uniName;
        uint fromDate;
        uint toDate;
    }

    Record[] recordList; // recordList and recordToOwner have same tokenId
    mapping(uint => address) recordToOwner;

    function addRecord(
        string memory _uniName,
        uint _fromDate,
        uint _toDate
    ) public {
        //adds a record containing _uniName, _fromDate and _toDate
        uint id = recordList.push(Record(_uniName, _fromDate, _toDate));
        recordToOwner[id - 1] = msg.sender;
    }

    function showRecord() public view returns (string memory, uint, uint) {
        //shows record details of the _owner
        Record[] memory temp =  recordList;
        string memory aa;
        uint bb;
        uint cc;
        for (uint i = 0; i < temp.length; i++) {
            if (recordToOwner[i] == msg.sender) {
                aa = recordList[i].uniName;
                bb = recordList[i].fromDate;
                cc = recordList[i].toDate;
            }
        }
        return (aa, bb, cc);
    }
}