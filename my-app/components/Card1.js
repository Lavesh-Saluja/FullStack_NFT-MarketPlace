import React, { useState,useRef } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import dataRef from "../pages/dashboard.js";
import listNft from "../utils/listNft"
import buyNft from "../utils/buyNft"

function Card1(props) {

console.log('------------------------------------');
console.log("Card");
console.log('------------------------------------');

    const signerRef=useRef();
    
  var id;


  const buy=props.value.buy;

  const bigId=props.value.id;
  if(!buy)
   id=props.value.id.toNumber();
   else 
   id=props.value.id;
  const price = props.value.price;
  const name = props.value.name;
  const description = props.value.description;
  const imageuri = props.value.image;
  const signer=props.value.signerRef.current;
  console.log(signer)
  signerRef.current=signer;
  console.log(signerRef.current,"Refrence")
  const [loading,setLoading]=useState(false);
  const [listingPrice,setListingPrice]=useState();
  console.log('------------------------------------');
  console.log(imageuri);
  console.log('------------------------------------');
  return (
    <div>
      <Card
        style={{ width: "23rem", margin: "10px", border: "2px solid gold" }}
      >
        <Card.Img variant="top" src={imageuri} alt="Image" />
        <Card.Body>
          <Card.Title>Name : {name}</Card.Title>
          <hr />
          <Card.Text>Description : {description}</Card.Text>
         
          {
            price!=0?<Card.Text>Price : {price}</Card.Text>:null
          }
          
          
        </Card.Body>
        <Card.Body>
          {
            price==0?<><Card.Link href="#" className="btn btn-primary" onClick={async ()=>{setLoading(true);console.log(signer,listingPrice,bigId);await listNft(signer,listingPrice,bigId);setLoading(false)}}>
          {loading?"loading...":
            "List"}
          </Card.Link>
          <input className="input" placeholder="listing price" style={{width:"50%", marginLeft:"5%"}} onChange={(e=>{ setListingPrice(e.target.value)})}/>
          </>:
          null}
          {
            buy ?
            <Card.Link href="#" className="btn btn-primary" onClick={async ()=>{setLoading(true);console.log(signerRef.current,"Printing");await buyNft(signerRef.current,price,id);setLoading(false);window.alert("Nft Bought successfully")}}>
          {loading?"loading...":
            "Buy"}
          </Card.Link>:null
          }
        </Card.Body>
      </Card>
    </div>
  );
}

export default Card1;
