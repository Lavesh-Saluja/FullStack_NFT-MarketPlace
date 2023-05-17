import React, { useEffect, useState, useRef } from "react";
import connectWallet from "../utils/ConnectWallet";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { ethers } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import axios from "axios";
import Head from "next/head";
import Card1 from "../components/Card1"; 
const Home = ({ nonListedowned, listedOwned }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [nonListedData, setNonListedData] = useState([]);
  const web3ModalRef = useRef();
  const [listedData, setListedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dataRef = useRef();
  const signerRef=useRef();
  // console.log('------------------------------------');
  // console.log(listedData);
  // console.log('------------------------------------');
  // console.log('----Non listed data is printed-------------------');
  // console.log(nonListedData);
  // console.log('------------------------------------');

  async function loadDataUtility() {
    const provider = await connectWallet(web3ModalRef);

    const signer = provider.getSigner();
    signerRef.current=signer;
    const address = await signer.getAddress();
    console.log("Utility");
    console.log(address);
    const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    const getAllOwnedNfts = contract.filters.NFTransfer(
      null,
      null,
      address,
      null,
      null
    );
    const getAllListedNfts = contract.filters.NFTransfer(
      null,
      null,
      NFT_CONTRACT_ADDRESS,
      null,
      null
    );
    const allNFTs = await contract.queryFilter(getAllOwnedNfts);
    const allListedNfts = await contract.queryFilter(getAllListedNfts);
    /////////////////////////
    const ownedNfts = await Promise.all(
      allNFTs.map(async (e) => {
        let obj;
        const id = e.args.tokenID;
        console.log(id.toNumber(),"hello I am id of owned nft")
        const checkListing = await contract.ownerOf(id);
        if (checkListing == address) {
          const tokenURI = await contract.tokenURI(id);
          await axios.get(tokenURI).then(function (response) {
            obj = response.data;
            
            // console.log(obj)
          });
          return {
            id:id,
            name: obj.name,
            description: obj.description,
            imageuri: obj.image,
          };
        }
      })
    );

    //////////////////////////////////

    const ownedListedNfts = await Promise.all(
      allListedNfts.map(async (e) => {
        const id = e.args.tokenID;
        
        let obj;
        const checkListing = await contract.ownerOf(id);
        if (checkListing == NFT_CONTRACT_ADDRESS) {
          const owner = e.args.from;
          if (owner == address) {
            const tokenURI = await contract.tokenURI(id);
            await axios.get(tokenURI).then(function (response) {
              obj = response.data;
              //  console.log(obj)
            });
          
            return {
              id:id,
              name: obj.name,
              description: obj.description,
              price: e.args.price,
              imageuri: obj.image,
            };
          }
        }
      })
    );

    /////////////////////////////////////////

    console.log("Ready to rock and roll Game Starts");
console.log(ownedListedNfts)
    console.log("Non Listed Owned data");
    dataRef.current = {
      listed: ownedListedNfts.filter((e)=> e!=undefined),
      nonListed: ownedNfts.filter((e)=> e!=undefined),
    };
    console.log(dataRef.current.nonListed);
    setDataLoaded(true);
  }
  async function helper() {
    const provider = await connectWallet(web3ModalRef);

    const signer = provider.getSigner();

    const address = await signer.getAddress();

    await loadDataUtility();
  }

  async function loadData() {
    try {
      await helper();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
    setWalletConnected(true);
  }

  useEffect(() => {
    
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      loadData();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>NFT MarketPlace</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
          crossorigin="anonymous"
        />
      </Head>
      <h1 className="text-center">Non Listed NFTs</h1>
    <div className="p-2 d-flex justify-content-center">
    
    {
                                
      dataLoaded?
      

      
      dataRef.current.nonListed.map((e)=>{
       
        const id=e.id;
        const name=e.name;
        const price=0;
        const image=e.imageuri;
        const description=e.description;
        const buy=false;
        console.log(signerRef.current,"==========")
        return(<>
<Card1 value={{id,name,description,image,price,signerRef,buy}}/>
        </>)
      
      }):
<h3>Please Wait...</h3>


    }
    
    </div>
    <h1 className="text-center">Listed NFT</h1>
    <div className="p-2 d-flex justify-content-center">
    
    {
                                
      dataLoaded?
      

      
      dataRef.current.listed.map((e)=>{
       
        const id=e.id;
        const name=e.name;
        const price=utils.formatEther(e.price);
        const image=e.imageuri; 
        const description=e.description;
        const buy=false;
        return(<>
<Card1 value={{id,name,description,image,price,signerRef,buy}}/>
        </>)
        console.log(e)
      }):
<h3>Please Wait...</h3>


    }
    
    </div>


    </div>
  );
};



export default Home;
