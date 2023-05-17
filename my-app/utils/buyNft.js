import { Contract, providers, utils } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import connectWallet from "./ConnectWallet";
import Web3Modal from "web3modal";
import {useRef} from "react";
 async function buyNft(signer,price,id) {
   console.log(signer,"In the buy nft")
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    const tx=await nftContract.buyNFT(id,{ value: utils.parseUnits(price, "ether") });
    await tx.wait();
 }
 export default buyNft;