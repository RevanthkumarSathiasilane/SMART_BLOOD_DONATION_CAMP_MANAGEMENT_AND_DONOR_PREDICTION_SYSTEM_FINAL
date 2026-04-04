import{useState,useEffect,useCallback}from"react";
import{Bar}from"react-chartjs-2";
import{Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Legend}from"chart.js";
import Navbar from"../components/Navbar";
import StatCard from"../components/StatCard";
import{campAPI,mlAPI}from"../services/api";
ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend);
const LINKS=[{path:"/dashboard",icon:"🏠",label:"Dashboard"},{path:"/chat",icon:"🤖",label:"AI Chat"}];

export default function CoordinatorDashboard(){
  const[camps,setCamps]=useState([]);
  const[stats,setStats]=useState({});
  const[tab,setTab]=useState("camps");
  const[form,setForm]=useState({name:"",location:"",city:"",campDate:"",startTime:"09:00",endTime:"17:00"});
  const[locRec,setLocRec]=useState(null);
  const[locLoading,setLocLoading]=useState(false);
  const[msg,setMsg]=useState("");
  const[lastRefresh,setLastRefresh]=useState(new Date());

  const load=useCallback(()=>{
    campAPI.getAll().then(r=>setCamps(r.data)).catch(()=>{});
    campAPI.stats().then(r=>setStats(r.data)).catch(()=>{});
    setLastRefresh(new Date());
  },[]);

  useEffect(()=>{
    load();
    const iv=setInterval(load,30000);
    return()=>clearInterval(iv);
  },[load]);

  const createCamp=async e=>{
    e.preventDefault();setMsg("");
    try{await campAPI.create(form);setMsg("✓ Camp created successfully!");load();setTab("camps");setForm({name:"",location:"",city:"",campDate:"",startTime:"09:00",endTime:"17:00"});}
    catch(e){setMsg("✗ "+(e.response?.data?.error||"Error creating camp"));}
  };

  const deleteCamp=async id=>{
    if(!window.confirm("Delete this camp?"))return;
    try{await campAPI.delete(id);load();}catch(e){setMsg("✗ Could not delete camp");}
  };

  const getLocRec=async()=>{
    setLocLoading(true);setLocRec(null);
    try{const{data}=await mlAPI.location({lat:13.08,lon:80.27,donor_density:80});setLocRec(data);}
    catch(e){setLocRec({error:e.response?.status===503?"⚠️ ML service (FastAPI) not running on port 8000. Start it with: python -m uvicorn main:app --reload --port 8000":"Connection error: "+e.message});}
    finally{setLocLoading(false);}
  };

  const S={
    page:{background:"#030712",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9"},
    inner:{padding:"24px 32px",maxWidth:1200,margin:"0 auto"},
    card:{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:24},
    inp:{width:"100%",padding:"10px 14px",background:"#0a0a14",border:"1px solid #1e293b",borderRadius:8,color:"#f1f5f9",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"},
    tabBtn:(a)=>({padding:"8px 20px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,background:a?"#16a34a":"transparent",color:a?"#fff":"#64748b"}),
    msgBox:(ok)=>({background:ok?"#14532d20":"#7f1d1d20",border:`1px solid ${ok?"#16a34a40":"#dc262640"}`,borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:ok?"#86efac":"#fca5a5"}),
  };

  const completed=camps.filter(c=>c.status==="COMPLETED");
  const upcoming=camps.filter(c=>c.status==="UPCOMING");

  return(
    <div style={S.page}>
      <Navbar links={LINKS}/>
      <div style={S.inner}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Coordinator Dashboard 🏕️</h1>
            <p style={{color:"#64748b",fontSize:14}}>Manage blood donation camps and track performance metrics.</p>
          </div>
          <div style={{textAlign:"right"}}>
            <button onClick={load} style={{padding:"7px 16px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:12,marginBottom:4}}>🔄 Refresh</button>
            <p style={{fontSize:11,color:"#374151"}}>Auto-refreshes every 30s</p>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          <StatCard icon="🏕️" label="Total Camps" value={stats.total||0} color="#16a34a"/>
          <StatCard icon="📅" label="Upcoming" value={stats.upcoming||0} color="#2563eb"/>
          <StatCard icon="✅" label="Completed" value={stats.completed||0} color="#7c3aed"/>
          <StatCard icon="🩸" label="Units Collected" value={`${Math.round(stats.totalUnits||0)}L`} color="#dc2626"/>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:24,background:"#0f172a",borderRadius:10,padding:4,width:"fit-content"}}>
          {[["camps","📋 All Camps"],["create","➕ New Camp"],["ml","🤖 ML Location"]].map(([t,l])=>(
            <button key={t} style={S.tabBtn(tab===t)} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        {msg&&<div style={S.msgBox(msg.startsWith("✓"))}>{msg}</div>}

        {tab==="camps"&&(
          <div style={{display:"grid",gap:20}}>
            {completed.length>0&&(
              <div style={S.card}>
                <p style={{fontWeight:600,marginBottom:16}}>📊 Camp Performance</p>
                <Bar data={{
                  labels:completed.map(c=>c.name.substring(0,12)+"..."),
                  datasets:[
                    {label:"Units (L)",data:completed.map(c=>c.unitsCollected),backgroundColor:"#16a34a",borderRadius:6},
                    {label:"Attendance",data:completed.map(c=>c.attendanceCount),backgroundColor:"#2563eb",borderRadius:6}
                  ]
                }} options={{responsive:true,scales:{x:{grid:{color:"#ffffff08"},ticks:{color:"#64748b"}},y:{grid:{color:"#ffffff08"},ticks:{color:"#64748b"}}},plugins:{legend:{labels:{color:"#94a3b8"}}}}}/>
              </div>
            )}
            <div style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <p style={{fontWeight:600}}>All Camps ({camps.length})</p>
                <button onClick={()=>setTab("create")} style={{padding:"7px 16px",background:"#16a34a",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>+ New Camp</button>
              </div>
              {camps.length===0?<p style={{color:"#64748b",fontSize:13}}>No camps found.</p>:(
                <div style={{display:"grid",gap:8}}>
                  {camps.map(c=>(
                    <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"#0a0a14",borderRadius:10}}>
                      <div style={{flex:1}}>
                        <p style={{fontWeight:500,fontSize:14,marginBottom:2}}>{c.name}</p>
                        <p style={{fontSize:12,color:"#64748b"}}>{c.location} · {c.city} · {c.campDate}</p>
                        {c.status==="COMPLETED"&&<p style={{fontSize:11,color:"#94a3b8",marginTop:2}}>👥 {c.attendanceCount} attended · 🩸 {c.unitsCollected}L collected</p>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:999,background:c.status==="COMPLETED"?"#16a34a20":"#2563eb20",color:c.status==="COMPLETED"?"#86efac":"#93c5fd"}}>{c.status}</span>
                        <button onClick={()=>deleteCamp(c.id)} title="Delete" style={{background:"transparent",border:"1px solid #374151",borderRadius:6,color:"#ef4444",cursor:"pointer",padding:"3px 8px",fontSize:12}}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="create"&&(
          <div style={{...S.card,maxWidth:520}}>
            <p style={{fontWeight:600,fontSize:16,marginBottom:20}}>➕ Create New Blood Donation Camp</p>
            <form onSubmit={createCamp} style={{display:"grid",gap:14}}>
              {[["Camp Name","name","text","Chennai Blood Drive 2025"],["Location / Venue","location","text","Govt General Hospital, Park Town"],["City","city","text","Chennai"]].map(([l,k,t,p])=>(
                <div key={k}>
                  <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>{l}</label>
                  <input style={S.inp} type={t} required placeholder={p} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>Camp Date</label>
                <input style={S.inp} type="date" required value={form.campDate} onChange={e=>setForm(p=>({...p,campDate:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Start Time","startTime"],["End Time","endTime"]].map(([l,k])=>(
                  <div key={k}>
                    <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>{l}</label>
                    <input style={S.inp} type="time" value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              <button type="submit" style={{padding:"12px",background:"#16a34a",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>
                Create Camp →
              </button>
            </form>
          </div>
        )}

        {tab==="ml"&&(
          <div style={S.card}>
            <p style={{fontWeight:600,fontSize:16,marginBottom:6}}>🤖 ML Camp Location Recommender</p>
            <p style={{fontSize:13,color:"#64748b",marginBottom:8}}>Uses KMeans clustering on donor density data across Tamil Nadu to recommend optimal camp locations.</p>
            <div style={{background:"#0a0a14",borderRadius:10,padding:14,marginBottom:20,fontSize:12,color:"#64748b"}}>
              📍 Sample query: Lat 13.08, Lon 80.27 (Chennai), Donor density: 80/km²
            </div>
            <button onClick={getLocRec} disabled={locLoading}
              style={{padding:"11px 28px",background:locLoading?"#374151":"#16a34a",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:500,cursor:locLoading?"wait":"pointer",marginBottom:20}}>
              {locLoading?"🔄 Computing...":"▶ Get ML Location Recommendation"}
            </button>
            {locRec&&(
              <div style={{background:locRec.error?"#450a0a":"#14532d20",border:"1px solid #ffffff10",borderRadius:12,padding:24}}>
                {locRec.error
                  ?<p style={{color:"#fca5a5",whiteSpace:"pre-wrap"}}>{locRec.error}</p>
                  :<>
                    <p style={{fontSize:20,fontWeight:700,color:"#86efac",marginBottom:16}}>Cluster {locRec.recommended_cluster} Recommended ✅</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                      {[["📍 Center Latitude",locRec.center_lat],["📍 Center Longitude",locRec.center_lon],["👥 Expected Turnout",locRec.expected_turnout+" donors"],["📊 Avg Donor Density",locRec.avg_donor_density+"/km²"]].map(([l,v])=>(
                        <div key={l} style={{background:"#0a0a14",borderRadius:8,padding:"12px 14px"}}>
                          <p style={{fontSize:12,color:"#64748b",marginBottom:4}}>{l}</p>
                          <p style={{fontWeight:600,color:"#f1f5f9",fontSize:15}}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{fontSize:13,color:"#86efac"}}>💡 {locRec.recommendation}</p>
                  </>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
