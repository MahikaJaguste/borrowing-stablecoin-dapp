// hardhat.config.js
const { infuraProjectId, mnemonic, alchemyAPIKey } = require('./secrets.json');

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: "./frontend/src/artifacts"
  },
  networks: { 
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraProjectId}`,
      accounts: {mnemonic: mnemonic}
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${infuraProjectId}`,
      accounts: {mnemonic: mnemonic}
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      accounts: {mnemonic: mnemonic}
    },
  },
};


