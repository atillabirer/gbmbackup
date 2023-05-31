function setUpMetamask() {
    if (ethereum && ethereum.on) {
        const handleConnect = () => {
          console.log("Handling 'connect' event");
        };
  
        const handleChainChanged = (chainId) => {
          console.log("Handling 'chainChanged' event with payload", chainId);
        };
  
        const handleAccountsChanged = (accounts) => {
          console.log("Handling 'accountsChanged' event with payload", accounts);
          window.location.reload();
        };
  
        ethereum.on('connect', handleConnect);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);

        // cleanup function
        return () => {
          // if (ethereum.removeListener) {
          //   ethereum.removeListener('connect', handleConnect);
          //   ethereum.removeListener('chainChanged', handleChainChanged);
          //   ethereum.removeListener('accountsChanged', handleAccountsChanged);
          // }
        };
      }
}

async function isConnected() {
   const accounts = await ethereum.request({method: 'eth_accounts'});       
   if (accounts.length) {
      ethereum.request({ method: 'eth_requestAccounts' }).then(()=> enablePage()).catch((err) => {
        console.error(err);
      });
      metamaskTrigger.checked = true;
      const initWeb3 = new Web3(window.ethereum);
      const chainIdInUse = await initWeb3.eth.getChainId();
      
      /* 
      Dirty Check
      */

      const depButton = document.getElementsByClassName('deploy-btn');
      if (depButton.length > 0) {
        depButton[0].innerHTML = "Deploy Diamond";
        depButton[0].disabled = false;
        depButton[0].style.backgroundColor = "#49BEB7";
        depButton[0].style.border = "none";
      }

      // END

      if (chainIdInUse === 31337 && localStorage.getItem("metamaskNonce") === null) {
        const nonceCheck = initWeb3.eth.getTransactionCount(window.ethereum.selectedAddress).then().catch((error) => {
          localStorage.clear();
          localStorage.setItem('metamaskNonce', error.message.match(/\d+/g)[1] );
          window.location.reload();
        })      
      }
   } else {
      metamaskTrigger.checked = false;
      console.log("Metamask is not connected");
   }
}

function enableMetamask(event) {
  console.log(event.target.checked);

  ethereum.request({ method: 'eth_requestAccounts' }).then(()=> enablePage()).catch((err) => {
    console.error(err);
  });
  
  requestChainAddition("0x7a69");
}

function enablePage() {
  const accountLabel = document.getElementById('metamask-account');
  accountLabel.innerHTML = window.ethereum.selectedAddress;
}

async function requestChainAddition(chain) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain }],
    });
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: 'Local Hardhat',
            chainId: `0x7a69`,
            nativeCurrency: {
              name: 'GO',
              decimals: 18,
              symbol: 'GO',
            },
            rpcUrls: ['http://localhost:8545'],
          },
        ],
      });
    } else if (err.code === 4001) {
      throw new Error('Chain change rejected!');
    }
  }
}

async function chainZigZag() {
  localStorage.clear();
  await requestChainAddition("0x1");
  await requestChainAddition("0x7a69");
}

const metamaskTrigger = document.getElementById('metamask-enable');
metamaskTrigger.onchange = enableMetamask;

const forceBtn = document.getElementById('refresh-btn');
forceBtn.onclick = chainZigZag;


setUpMetamask();  
isConnected();

