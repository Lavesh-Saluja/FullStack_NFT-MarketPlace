import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { createContext, useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import connectWallet from "../utils/ConnectWallet";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import axios from "axios";
import Card1 from "../components/Card1";
const SignerContext = createContext()
export default function Home({list}) {
  







  const signerRef=useRef();
  const dataRef=useRef();
  
  console.log(dataRef.current);
  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [dataLoaded,setDataLoaded] = useState(false);
  async function helper() {
    console.log("ALAKAL ")
    const provider = await connectWallet(web3ModalRef);

    const signer = provider.getSigner();
    const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    const totalListing=await contract.totalListing();
    console.log("Total Listing: " + totalListing)
    dataRef.current=JSON.parse(list).filter((e)=> e!=undefined);
    const arr=dataRef.current.slice(0,totalListing);
    console.log("ALAKAL ")
    console.log(arr);
    dataRef.current=arr;
    signerRef.current=signer;
    setDataLoaded(true);
    console.log("true ")
  }
  async function getsigner(){ 
    await helper();
  }
  async function connectwallet() {
    console.log("ALAKAL ")
    try{
      await getsigner();
      setWalletConnected(true);
    }catch(e){
      console.error(e);
    }
   
  }
  useEffect(() => {
    console.log("Index Page");
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected ) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open

      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectwallet();
      
      // set an interval to get the number of token Ids minted every 5 seconds
    }
  }, [walletConnected]);
  return (
    <div>
      {
        dataLoaded?
        
      dataRef.current.map((e)=>{
        console.log(web3ModalRef)
        console.log("Hello");
        const id=e.id;
        console.log(id)
        const name=e.name;
        const description=e.description;
        const image=e.imageuri;
        const price=utils.formatEther(e.price);
        const buy=true;
        console.log(signerRef.current,"Holaaa")
        return(<>
       
          
            
            <Card1 value={{id,name,description,image,price,signerRef,buy}}></Card1>
        
        </>)
        
      }):
      <h1>Please wait...</h1>}
      
    
    </div>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps");
  const provider = new providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/1S6XGWvLFLSWTjf6oRTAm7CmdxD3uwG2"
  );
  const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
  const totalListing=await contract.totalListing();
  const getAllListing = contract.filters.NFTransfer(
    null,
    null,
    NFT_CONTRACT_ADDRESS,
    null,
    null
  );
  console.log(totalListing.toNumber(),"Total Listing");
  const allListing = (await contract.queryFilter(getAllListing)).reverse();
  let i=0;
  const currentListing = await Promise.all(allListing.map(async (e) => {
    const id = e.args.tokenID;
    let obj;
    const checkListing = await contract.ownerOf(id);
    if (checkListing == NFT_CONTRACT_ADDRESS) {
      const tokenURI = await contract.tokenURI(id);
      await axios.get(tokenURI).then(function (response) {
        obj = response.data;
        console.log(response.data);
        if(obj==undefined)
        return
      });
        
      return {
        description: obj.description,
        name: obj.name,
        id:id.toNumber(),
        price:e.args.price,
        imageuri: obj.image,
      };
    }
    
    console.log(i,"i increase lklklskdlskdlskdlskdlskdlskdlksldklskdksldk");
  }));

  const list=JSON.stringify(currentListing)
  return {
    props: {
      list,
    },
    revalidate: 10,
  };
}

export {SignerContext};