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

const metamaskTrigger = document.getElementById('metamask-enable');
metamaskTrigger.onchange = enableMetamask;

setUpMetamask();  
isConnected();
      
async function isConnected() {
   const accounts = await ethereum.request({method: 'eth_accounts'});       
   if (accounts.length) {
      ethereum.request({ method: 'eth_requestAccounts' }).then(()=> enablePage()).catch((err) => {
        console.error(err);
      });
      metamaskTrigger.checked = true;
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
}

function enablePage() {
  const accountLabel = document.getElementById('metamask-account');
  accountLabel.innerHTML = window.ethereum.selectedAddress;
}