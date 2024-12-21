import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/jXMel33w00ir6t7BvyL3r56tr9szMHBi");

        

        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("accountsChanged", () => window.location.reload());

        try {
          console.log("Hi")
          // await provider.send("eth_requestAccounts", []);
    
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          console.log("Hi")
          console.log(await provider.getNetwork());

          const contractAddress = "0x72F5207D2864288Ba587D6338E18dCEdDe87CFC3"
          // "0x6583251Da700DbB7a904468fA7ce85DB7497cB9C";
          
          
          // "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          console.log("Hi")
          const code = await provider.getCode(contractAddress,"latest");
          // console.log("Hi")
          console.log(code); 
    
          // if (code === "0x") {
          //   console.error("No contract deployed at the specified address.");
          //   return;
          // }
    
          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(contract);
          setProvider(provider) ;
          console.log("bye")
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    loadProvider();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>D-Box</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account: {account ? account : "Not connected"}
        </p>

        {contract && provider ? (
          <>
            <FileUpload
              account={account}
              provider={provider}
              contract={contract}
            />
            <Display contract={contract} account={account} />
          </>
        ) : (
          <p style={{ color: "white" }}>Loading...</p>
        )}
      </div>
    </>
  );
}

export default App;
