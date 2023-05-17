import { Contract, providers, utils } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
async function createNft(signer) {
  const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
  const tx = await nftContract.totalListing();
  await tx.wait();
  return tx.toNumber();
}
export default createNft;
