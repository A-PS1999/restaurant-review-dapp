# Restaurant Review Dapp

### 💎 ~~Visit the site: https://restaurant-review-dapp.herokuapp.com/~~ Frontend currently not hosted
You will need Metamask installed on your web browser and have some Ropsten testnet ETH in order to interact with the site.

### Description
A decentralized application which allows users to submit reviews of restaurants, search for reviews by the restaurant's 
name and tip other users if they find their review valuable. The fact that gas fees must be paid in order to submit a 
review discourages spam and low quality reviews. Likewise, the potential to receive an Ethereum tip for a good review also 
serves to incentivize high quality reviews.

### Tech Stack
* Solidity smart contract
* IPFS via Infura for image uploads
* Truffle and Ganache for development, testing and testnet deployment
* Metamask as web3 provider
* React and various associated packages/libraries including Material UI, React Bootstrap, React Hook Form and React Hot Toast

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Metamask](https://metamask.io/)

### Installation instructions
1. Install [Truffle](https://www.trufflesuite.com/truffle) and [Ganache](https://www.trufflesuite.com/ganache) globally.
Either Ganache-CLI or the GUI version should work, though I used the GUI version during development.

```
npm install -g truffle

```

2. Clone the repo and install its dependencies.

```
git clone https://github.com/A-PS1999/restaurant-review-dapp.git
cd restaurant-review-dapp
npm install
```

3. Compile and migrate the smart contract.

```
truffle compile
truffle migrate
```

4. Run the application from within the `client` folder

```
npm run start
```

### Testing
Running the unit tests varies a little depending on whether or not you are using Ganache-CLI or the GUI version.
If you are using Ganache-CLI:

```
truffle test
```

If you used the GUI version (like I did) do the following:

```
truffle console --network ganache
truffle test
```

The above presumes that your `truffle-config.js` is the same as mine.

### License
MIT
