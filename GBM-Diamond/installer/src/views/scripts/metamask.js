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

setUpMetamask();

ethereum.request({ method: 'eth_requestAccounts' }).then(()=> {}).catch((err) => {
  console.error(err);
});