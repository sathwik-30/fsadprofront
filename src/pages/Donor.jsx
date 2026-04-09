import { useState, useEffect } from "react";
import Layout from "../components/Layout";

function Donor(){

 const [item,setItem] = useState("");
 const [qty,setQty] = useState("");
 const [drive,setDrive] = useState("");

 const [list,setList] = useState([]);
 const [requests,setRequests] = useState([]);

 const drives = [

  "Flood Relief Drive",
  "Winter Clothes Drive",
  "Food Donation Camp",
  "Medical Aid",
  "Others"

 ];


/*
 load my donations only
*/

 const loadDonations = async()=>{

  try{

   const res = await fetch(

    "http://localhost:5000/api/donation/mine",

    {

     headers:{
      Authorization: localStorage.getItem("token")
     }

    }

   );

   setList(await res.json());

  }
  catch(err){

   console.log(err);

  }

 };



/*
 load approved requests
 donor can fulfill
*/

 const loadRequests = async()=>{

  try{

   const res = await fetch(

    "http://localhost:5000/api/request/all",

    {

     headers:{
      Authorization: localStorage.getItem("token")
     }

    }

   );

   const data = await res.json();

   setRequests(

    data.filter(r=>r.status==="approved")

   );

  }
  catch(err){

   console.log(err);

  }

 };


 useEffect(()=>{

  loadDonations();
  loadRequests();

 },[]);



/*
 add donation
*/

 const addItem = async()=>{

  if(!item || !qty){

   alert("Enter item and quantity");

   return;

  }


  try{

   await fetch(

    "http://localhost:5000/api/donation/add",

    {

     method:"POST",

     headers:{

      "Content-Type":"application/json",

      Authorization: localStorage.getItem("token")

     },

     body: JSON.stringify({

      donorName: localStorage.getItem("name"),

      item,

      quantity: qty,

      drive

     })

    }

   );


   alert("Donation submitted for approval");


   setItem("");
   setQty("");
   setDrive("");


   loadDonations();

  }
  catch(err){

   console.log(err);

  }

 };



/*
 quick fulfill request
*/

 const donateForRequest = (reqItem,reqQty)=>{

  setItem(reqItem);
  setQty(reqQty);
  setDrive("Requested Item");

 };



/*
 status colors
*/

 const statusColor = status =>{

  if(status==="pending") return "bg-yellow-500 text-black";

  if(status==="approved") return "bg-blue-500 text-white";

  if(status==="assigned") return "bg-purple-500 text-white";

  if(status==="shipped") return "bg-indigo-500 text-white";

  if(status==="delivered") return "bg-green-600 text-white";

  return "bg-gray-500 text-white";

 };



return(

<Layout>

<h1 className="mb-8 text-3xl font-bold 
bg-gradient-to-r from-cyan-400 to-blue-500 
text-transparent bg-clip-text">

 Donor Dashboard

</h1>



{/* recipient needs */}

<div className="mb-10 rounded-xl p-6 
bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400">

<h2 className="mb-4 text-xl font-semibold text-cyan-300">

 Recipient Needs

</h2>


{

requests.length===0 &&

<p className="text-gray-300">

No approved requests yet

</p>

}


{

requests.map(r=>(

<div

key={r.id}

className="flex justify-between items-center 
border-b border-white/10 py-3"

>

<div>

<p className="text-white font-semibold">

{r.item}

</p>

<p className="text-gray-300">

Qty: {r.quantity}

</p>

</div>


<button

onClick={()=>donateForRequest(r.item,r.quantity)}

className="px-3 py-1 rounded 
bg-gradient-to-r from-blue-500 to-purple-500 
text-white hover:scale-105 transition"

>

Fulfill

</button>

</div>

))

}

</div>



{/* add donation */}

<div className="mb-8 rounded-xl p-6 
bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400">

<h2 className="mb-4 text-xl font-semibold text-green-300">

 Add Donation

</h2>


<div className="flex gap-4 flex-wrap">

<input

placeholder="Item"

value={item}

onChange={e=>setItem(e.target.value)}

className="p-2 rounded bg-slate-900 text-white border border-green-400"

/>


<input

type="number"

placeholder="Qty"

value={qty}

onChange={e=>setQty(e.target.value)}

className="p-2 rounded bg-slate-900 text-white border border-green-400"

/>


<select

value={drive}

onChange={e=>setDrive(e.target.value)}

className="p-2 rounded bg-slate-900 text-white border border-green-400"

>

<option value="">Drive</option>

{

drives.map(d=>(

<option key={d}>{d}</option>

))

}

</select>


<button

onClick={addItem}

className="px-5 py-2 rounded 
bg-gradient-to-r from-green-500 to-emerald-600 
text-white font-semibold hover:scale-105 transition"

>

Donate

</button>

</div>

</div>



{/* my donation history */}

<div className="rounded-xl p-6 
bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400">

<h2 className="mb-4 text-xl font-semibold text-yellow-300">

 My Donations

</h2>


{

list.length===0 &&

<p className="text-gray-300">

No donations yet

</p>

}


{

list.map(d=>(

<div

key={d.id}

className="flex justify-between items-center 
border-b border-white/10 py-3"

>

<span className="text-white">

{d.item}

</span>


<span className="text-gray-300">

Qty {d.quantity}

</span>


<span

className={`${statusColor(d.status)} px-3 py-1 rounded font-semibold`}

>

{d.status}

</span>

</div>

))

}

</div>



</Layout>

);

}

export default Donor;