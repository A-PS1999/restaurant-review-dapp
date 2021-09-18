const path = require("path");
const HDWalletProvider = require("./client/node_modules/truffle-hdwallet-provider");

require("./client/node_modules/dotenv").config()

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
		host: "127.0.0.1",
		port: 8545,
		network_id: "*"
    },
	ganache: {
		host: "127.0.0.1",
		port: 7545,
		network_id: "*"
    },
	ropsten: {
		provider: function() {
			return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY);
		},
		network_id: 3,
		skipDryRun: true
	}
  },
  compilers: {
	  solc: {
		  version: "0.8.0",
	    },
    },
};
