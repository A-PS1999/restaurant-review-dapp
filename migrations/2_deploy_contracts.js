var restaurantReviewer = artifacts.require("./RestaurantReviewer.sol");

module.exports = function(deployer) {
  deployer.deploy(restaurantReviewer);
};
