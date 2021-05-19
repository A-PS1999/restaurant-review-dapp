pragma solidity ^0.8.0;

contract restaurantReviewer {
    
    uint public reviewCount = 0;
    
    mapping (uint => Review) public reviews;
    
    struct Review {
        uint id;
        uint8 rating;
        uint tipCount;
        bytes20 restaurantName;
        bytes20 cuisineType;
        string reviewBody;
        string ipfsHash;
        address payable author;
        uint256 reviewDate;
    }
    
    event reviewSubmitted(
        bytes20 name,
        uint rNo
        );
        
    event tipSent(
        uint rNo,
        uint _value
        );
    
    function addReview(uint8 _rating, bytes20 _restaurantName, bytes20 _cuisineType, string memory _reviewBody,
                       string memory _ipfsHash) public {
        // restaurant name and review body must exist
        // _rating cannot be bigger than 5 (5 star rating system)
        require(_restaurantName != "", "A restaurant name must be provided.");
        require(bytes(_reviewBody).length > 0, "You must provide a review.");
        require(_rating <= 5, "Rating cannot be more than 5.");
        
        reviewCount++;
        reviews[reviewCount] = Review(reviewCount, _rating, 0, _restaurantName, _cuisineType, _reviewBody, _ipfsHash,
                                      payable(msg.sender), block.timestamp);
        
        emit reviewSubmitted(_restaurantName, reviewCount);
    }
    
    function tipReview(uint _id) public payable {
        require(_id > 0 && _id <= reviewCount, "Invalid review ID.");
        
        Review memory _review = reviews[_id];
        address payable _author = _review.author;
        
        // cannot tip oneself from the same address used to create review
        require(_review.author != msg.sender, "You cannot tip yourself from this address.");
        payable(_author).transfer(msg.value);
        _review.tipCount = _review.tipCount + 1;
        reviews[_id] = _review;
        
        emit tipSent(_id, msg.value);
    }
}