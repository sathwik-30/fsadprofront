import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API_BASE_URL from "../config/apiConfig";

function Logistics(){

 const [matches,setMatches] = useState([]);


/*
 load assigned deliveries
*/

 const loadData = async()=>{

  try{

   const res = await fetch(

    `${API_BASE_URL}/api/match/all`,

    {

     headers:{
      Authorization: localStorage.getItem("token")
     }

    }

   );

   const data = await res.json();

   setMatches(Array.isArray(data) ? data : []);

  }
  catch(err){

   console.log(err);

  }

 };


 useEffect(()=>{

  loadData();

 },[]);



/*
 update delivery status
*/

 const updateStatus = async(donationId,status)=>{

  try{

   await fetch(

    `${API_BASE_URL}/api/logistics/update`,

    {

     method:"POST",

     headers:{

      "Content-Type":"application/json",

      Authorization: localStorage.getItem("token")

     },

     body: JSON.stringify({

      donation_id: donationId,

      location:"distribution center",

      delivery_status: status

     })

    }

   );

   loadData();

  }
  catch(err){

   console.log(err);

  }

 };



/*
 status color helper
*/

 const statusColor = status =>{

  if(status==="assigned") return "bg-yellow-500";

  if(status==="picked") return "bg-blue-500";

  if(status==="in_transit") return "bg-indigo-500";

  if(status==="shipped") return "bg-purple-500";

  if(status==="delivered") return "bg-green-600";

  return "bg-gray-500";

 };



return(

<Layout>

<h1 className="text-3xl font-bold mb-8 
bg-gradient-to-r from-cyan-400 to-blue-500 
text-transparent bg-clip-text">

 Logistics Dashboard

</h1>



{

matches.length===0 &&

<p className="text-gray-300">

 No assigned deliveries yet.
 Admin probably forgot to click Assign.

</p>

}



{

matches.map(m=>(

<div

key={m.id}

className="mb-4 p-5 bg-white/10 rounded-xl text-white 
flex justify-between items-center border border-white/10"

>

<div>

<p className="font-semibold text-lg">

 {m.item}

</p>

<p className="text-gray-300">

 Qty: {m.quantity}

</p>

<p className="text-sm text-gray-400">

 Match ID: {m.id}

</p>

<p className="text-sm text-gray-400">

 Vehicle: {m.vehicle || "Not specified"}

</p>

</div>



<div className="flex flex-col gap-2 items-end">

<span

className={`${statusColor(m.donation_status)} px-3 py-1 rounded text-white text-sm`}

>

{m.donation_status}

</span>



<div className="flex gap-2">

<button

onClick={()=>updateStatus(m.donation_id,"picked")}

className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"

>

Pick

</button>


<button

onClick={()=>updateStatus(m.donation_id,"in_transit")}

className="bg-indigo-600 px-3 py-1 rounded text-white hover:bg-indigo-700"

>

Transit

</button>


<button

onClick={()=>updateStatus(m.donation_id,"delivered")}

className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"

>

Deliver

</button>

</div>

</div>

</div>

))

}



</Layout>

);

}

export default Logistics;