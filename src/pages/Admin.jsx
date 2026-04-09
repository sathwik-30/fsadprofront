import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import {
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip
} from "recharts";

function Admin(){

 const [donations,setDonations] = useState([]);
 const [requests,setRequests] = useState([]);
 const [matches,setMatches] = useState([]);

 const [search,setSearch] = useState("");

 const [selectedDonation,setSelectedDonation] = useState("");
 const [selectedRequest,setSelectedRequest] = useState("");
 const [vehicle,setVehicle] = useState("");

 const vehicles = [
  "Bike",
  "Van",
  "Truck",
  "Taxi",
  "Ship"
 ];


/* load all system data */

 const loadData = async()=>{

  try{

   const token = localStorage.getItem("token");

   const dRes = await fetch(
    "http://localhost:5000/api/donation/all",
    { headers:{ Authorization: token } }
   );

   const rRes = await fetch(
    "http://localhost:5000/api/request/all",
    { headers:{ Authorization: token } }
   );

   const mRes = await fetch(
    "http://localhost:5000/api/match/all",
    { headers:{ Authorization: token } }
   );

   const dData = await dRes.json();
   const rData = await rRes.json();
   const mData = await mRes.json();

   setDonations(Array.isArray(dData) ? dData : []);
   setRequests(Array.isArray(rData) ? rData : []);
   setMatches(Array.isArray(mData) ? mData : []);

  }
  catch(err){
   console.log(err);
  }

 };


 useEffect(()=>{
  loadData();
 },[]);



/* approve donation */

 const approveDonation = async(id)=>{

  const token = localStorage.getItem("token");

  await fetch(
   "http://localhost:5000/api/donation/approve",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json",
     Authorization: token
    },
    body: JSON.stringify({
     donation_id:id
    })
   }
  );

  loadData();

 };



/* approve request */

 const approveRequest = async(id)=>{

  const token = localStorage.getItem("token");

  await fetch(
   "http://localhost:5000/api/request/approve",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json",
     Authorization: token
    },
    body: JSON.stringify({
     request_id:id
    })
   }
  );

  loadData();

 };



/* create delivery assignment */

 const createMatch = async()=>{

  if(!selectedDonation || !selectedRequest || !vehicle){

   alert("Select donation, request and vehicle");
   return;

  }

  const token = localStorage.getItem("token");

  await fetch(
   "http://localhost:5000/api/match/create",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json",
     Authorization: token
    },
    body: JSON.stringify({
     donation_id:selectedDonation,
     request_id:selectedRequest,
     vehicle
    })
   }
  );

  alert("Delivery assigned");

  setSelectedDonation("");
  setSelectedRequest("");
  setVehicle("");

  loadData();

 };



/* chart data */

const donationData = donations.map((d,i)=>({

 name:`Donation ${i+1}`,
 value:Number(d.quantity) || 0

}));


const requestStatusData = [

 {
  name:"Pending",
  value:requests.filter(r=>r.status==="pending").length
 },

 {
  name:"Approved",
  value:requests.filter(r=>r.status==="approved").length
 }

];


const COLORS=["#06b6d4","#a855f7"];



return(

<Layout>

<div>

<h1 className="text-4xl font-bold mb-10 text-white">
 Admin Dashboard
</h1>



{/* summary cards */}

<div className="grid gap-6 md:grid-cols-4 mb-10">

<div className="p-5 bg-slate-800 rounded">
<p className="text-gray-400">Donations</p>
<h2 className="text-2xl text-white">
{donations.length}
</h2>
</div>


<div className="p-5 bg-slate-800 rounded">
<p className="text-gray-400">Requests</p>
<h2 className="text-2xl text-white">
{requests.length}
</h2>
</div>


<div className="p-5 bg-slate-800 rounded">
<p className="text-gray-400">Deliveries</p>
<h2 className="text-2xl text-white">
{matches.length}
</h2>
</div>


<div className="p-5 bg-slate-800 rounded">
<p className="text-gray-400">Pending Requests</p>
<h2 className="text-2xl text-white">
{requests.filter(r=>r.status==="pending").length}
</h2>
</div>

</div>



{/* approvals */}

<div className="grid md:grid-cols-2 gap-8 mb-10">


<div className="p-5 bg-slate-800 rounded">

<h2 className="text-white mb-4">
Pending Donations
</h2>

{
donations
.filter(d=>d.status==="pending")
.map(d=>(

<div key={d.id} className="flex justify-between mb-2">

<span className="text-white">
{d.item} ({d.quantity})
</span>

<button
onClick={()=>approveDonation(d.id)}
className="bg-green-600 px-3 py-1 text-white rounded"
>
Approve
</button>

</div>

))
}

</div>



<div className="p-5 bg-slate-800 rounded">

<h2 className="text-white mb-4">
Pending Requests
</h2>

{
requests
.filter(r=>r.status==="pending")
.map(r=>(

<div key={r.id} className="flex justify-between mb-2">

<span className="text-white">
{r.item} ({r.quantity})
</span>

<button
onClick={()=>approveRequest(r.id)}
className="bg-green-600 px-3 py-1 text-white rounded"
>
Approve
</button>

</div>

))
}

</div>

</div>



{/* assign delivery improved UI */}

<div className="p-6 bg-slate-800 rounded mb-10 shadow-lg">

<h2 className="text-white text-xl font-semibold mb-5">
Assign Delivery
</h2>

<div className="flex flex-wrap gap-4 items-end">

<div className="flex flex-col">

<label className="text-gray-400 text-sm mb-1">
Donation
</label>

<select
value={selectedDonation}
onChange={(e)=>setSelectedDonation(e.target.value)}
className="bg-slate-900 text-white p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

<option value="">Select</option>

{
donations
.filter(d=>d.status==="approved")
.map(d=>(

<option key={d.id} value={d.id}>
{d.item} ({d.quantity})
</option>

))
}

</select>

</div>



<div className="flex flex-col">

<label className="text-gray-400 text-sm mb-1">
Request
</label>

<select
value={selectedRequest}
onChange={(e)=>setSelectedRequest(e.target.value)}
className="bg-slate-900 text-white p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

<option value="">Select</option>

{
requests
.filter(r=>r.status==="approved")
.map(r=>(

<option key={r.id} value={r.id}>
{r.item} ({r.quantity})
</option>

))
}

</select>

</div>



<div className="flex flex-col">

<label className="text-gray-400 text-sm mb-1">
Vehicle
</label>

<select
value={vehicle}
onChange={(e)=>setVehicle(e.target.value)}
className="bg-slate-900 text-white p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

<option value="">Select</option>

{
vehicles.map(v=>(

<option key={v} value={v}>
{v}
</option>

))
}

</select>

</div>



<button
onClick={createMatch}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded h-10 mt-5 transition"
>
Assign
</button>

</div>

</div>



{/* charts */}

<div className="grid md:grid-cols-2 gap-8 mb-10">


<div className="p-5 bg-slate-800 rounded">

<h3 className="text-white">
Donation Quantity
</h3>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={donationData}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Line
dataKey="value"
stroke="#06b6d4"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>



<div className="p-5 bg-slate-800 rounded">

<h3 className="text-white">
Request Status
</h3>

<ResponsiveContainer width="100%" height={250}>

<PieChart>

<Pie
data={requestStatusData}
dataKey="value"
outerRadius={100}
label
>

{
requestStatusData.map((e,i)=>(
<Cell key={i} fill={COLORS[i%COLORS.length]}/>
))
}

</Pie>

</PieChart>

</ResponsiveContainer>

</div>

</div>



{/* donation list */}

<div className="p-5 bg-slate-800 rounded">

<h3 className="text-white mb-4">
All Donations
</h3>


<input
placeholder="Search item"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="p-2 mb-4 w-full bg-slate-900 text-white rounded"
/>


{
donations
.filter(d=>
(d.item||"")
.toLowerCase()
.includes(search.toLowerCase())
)
.map(d=>(

<div key={d.id} className="flex justify-between mb-2">

<span className="text-white">
{d.item}
</span>

<span className="text-gray-400">
{d.status}
</span>

</div>

))
}

</div>


</div>

</Layout>

);

}

export default Admin;