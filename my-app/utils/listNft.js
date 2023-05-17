import { Contract, providers, utils } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
 async function listNft(signer,price,id) {
   try{
      console.log("List nft function",id)
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const pay=utils.parseEther(price);
      const tx=await nftContract.listNFT(id,pay);
      await tx.wait();
   }catch(e){
      console.error(e);
   }
  
 }
 export default listNft;