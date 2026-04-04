import{useState,useEffect,useCallback}from"react";
import{Bar,Doughnut}from"react-chartjs-2";
import{Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend}from"chart.js";
import Navbar from"../components/Navbar";
import StatCard from"../components/StatCard";
import{useAuth}from"../context/AuthContext";
import{donorAPI,stockAPI,campAPI,mlAPI}from"../services/api";

ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend);
const LINKS=[{path:"/dashboard",icon:"🏠",label:"Dashboard"},{path:"/chat",icon:"🤖",label:"AI Chat"}];

export default function DonorDashboard(){
  const{user}=useAuth();
  const[stock,setStock]=useState([]);
  const[donors,setDonors]=useState([]);
  const[camps,setCamps]=useState([]);
  const[alerts,setAlerts]=useState([]);
  const[tab,setTab]=useState("overview");
  const[prediction,setPrediction]=useState(null);
  const[predLoading,setPredLoading]=useState(false);
  const[lastRefresh,setLastRefresh]=useState(new Date());
  const[regForm,setRegForm]=useState({name:"",age:"",gender:"Male",bloodGroup:"A+",phone:"",city:""});
  const[regMsg,setRegMsg]=useState("");

  const loadData=useCallback(()=>{
    stockAPI.getAll().then(r=>setStock(r.data)).catch(()=>{});
    stockAPI.getAlerts().then(r=>setAlerts(r.data)).catch(()=>{});
    donorAPI.getAll().then(r=>setDonors(r.data)).catch(()=>{});
    campAPI.getUpcoming().then(r=>setCamps(r.data)).catch(()=>{});
    setLastRefresh(new Date());
  },[]);

  useEffect(()=>{
    loadData();
    const iv=setInterval(loadData,30000); // auto-refresh every 30s
    return()=>clearInterval(iv);
  },[loadData]);

  const runPrediction=async()=>{
    setPredLoading(true); setPrediction(null);
    try{
      const{data}=await mlAPI.predictDonor({age:28,total_donations:5,days_since_last:120,blood_group:"A+",city:"Chennai"});
      setPrediction(data);
    }catch(e){
      setPrediction({error:e.response?.status===503?"⚠️ ML service (FastAPI) is not running on port 8000. Please start it first.":"Connection failed: "+e.message});
    }finally{setPredLoading(false);}
  };

  const registerDonor=async e=>{
    e.preventDefault(); setRegMsg("");
    try{
      await donorAPI.register({...regForm,age:parseInt(regForm.age),totalDonations:0,isEligible:true});
      setRegMsg("✓ Registered successfully! You're now in the system.");
      setRegForm({name:"",age:"",gender:"Male",bloodGroup:"A+",phone:"",city:""});
      loadData();
    }catch(e){setRegMsg("✗ "+(e.response?.data?.error||"Error registering. Check all fields."));}
  };

  const S={
    page:{background:"#030712",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9"},
    inner:{padding:"24px 32px",maxWidth:1200,margin:"0 auto"},
    card:{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:24},
    inp:{width:"100%",padding:"10px 14px",background:"#0a0a14",border:"1px solid #1e293b",borderRadius:8,color:"#f1f5f9",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"},
    tabBtn:(a,c="#dc2626")=>({padding:"8px 20px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,background:a?c:"transparent",color:a?"#fff":"#64748b",transition:"all .2s"}),
    alert:(ok)=>({background:ok?"#14532d20":"#7f1d1d20",border:`1px solid ${ok?"#16a34a40":"#dc262640"}`,borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:ok?"#86efac":"#fca5a5"}),
  };

  const byGroup={};
  donors.forEach(d=>{if(d.bloodGroup)byGroup[d.bloodGroup]=(byGroup[d.bloodGroup]||0)+1;});

  return(
    <div style={S.page}>
      <Navbar links={LINKS}/>
      <div style={S.inner}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Donor Dashboard 🩸</h1>
            <p style={{color:"#64748b",fontSize:14}}>Welcome, {user?.username}. Manage your donations and health profile.</p>
          </div>
          <div style={{textAlign:"right"}}>
            <button onClick={loadData} style={{padding:"7px 16px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:12,marginBottom:4}}>
              🔄 Refresh
            </button>
            <p style={{fontSize:11,color:"#374151"}}>Last: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 30s</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:24,background:"#0f172a",borderRadius:10,padding:4,width:"fit-content"}}>
          {[["overview","📊 Overview"],["register","📝 Register"],["predictions","🤖 ML Predict"]].map(([t,l])=>(
            <button key={t} style={S.tabBtn(tab===t)} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        {tab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              <StatCard icon="👥" label="Total Donors" value={donors.length} color="#2563eb"/>
              <StatCard icon="🏕️" label="Upcoming Camps" value={camps.length} color="#16a34a"/>
              <StatCard icon="⚠️" label="Critical Alerts" value={alerts.length} color="#dc2626" sub={alerts.length>0?"Urgent attention needed":"All blood groups OK"}/>
              <StatCard icon="🔬" label="Blood Groups" value={stock.length} color="#7c3aed"/>
            </div>

            {alerts.length>0&&(
              <div style={{...S.card,background:"#7f1d1d15",borderColor:"#dc262640",marginBottom:20}}>
                <p style={{fontWeight:600,color:"#fca5a5",marginBottom:10}}>🚨 Critical Stock Alerts — Donate Now!</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {alerts.map(a=>(
                    <span key={a.id} style={{background:"#dc2626",color:"#fff",padding:"5px 16px",borderRadius:999,fontSize:13,fontWeight:500}}>
                      {a.bloodGroup}: {a.unitsAvailable}L (min {a.criticalLevel}L)
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:20,marginBottom:20}}>
              <div style={S.card}>
                <p style={{fontWeight:600,marginBottom:16}}>Blood Stock Levels</p>
                <Bar data={{
                  labels:stock.map(s=>s.bloodGroup),
                  datasets:[{label:"Units Available",data:stock.map(s=>s.unitsAvailable),backgroundColor:stock.map(s=>s.unitsAvailable<s.criticalLevel?"#dc2626":"#2563eb"),borderRadius:6}]
                }} options={{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:"#ffffff08"}},y:{grid:{color:"#ffffff08"},ticks:{color:"#64748b"}},x:{ticks:{color:"#64748b"}}}}}/>
              </div>
              <div style={S.card}>
                <p style={{fontWeight:600,marginBottom:16}}>Donors by Blood Group</p>
                {Object.keys(byGroup).length>0
                  ?<Doughnut data={{labels:Object.keys(byGroup),datasets:[{data:Object.values(byGroup),backgroundColor:["#dc2626","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6"],borderWidth:0}]}}
                    options={{responsive:true,plugins:{legend:{position:"bottom",labels:{color:"#94a3b8",font:{size:11}}}}}}/>
                  :<p style={{color:"#64748b",fontSize:13}}>Loading donor data...</p>}
              </div>
            </div>

            <div style={S.card}>
              <p style={{fontWeight:600,marginBottom:16}}>🏕️ Upcoming Camps ({camps.length})</p>
              {camps.length===0
                ?<p style={{color:"#64748b",fontSize:13}}>No upcoming camps scheduled.</p>
                :<div style={{display:"grid",gap:10}}>
                  {camps.slice(0,6).map(c=>(
                    <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#0a0a14",borderRadius:10}}>
                      <div>
                        <p style={{fontWeight:500,fontSize:14,marginBottom:2}}>{c.name}</p>
                        <p style={{fontSize:12,color:"#64748b"}}>{c.location} · {c.city}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:13,color:"#dc2626",fontWeight:500}}>{c.campDate}</p>
                        <p style={{fontSize:11,color:"#64748b"}}>{c.startTime} – {c.endTime}</p>
                      </div>
                    </div>
                  ))}
                </div>}
            </div>
          </>
        )}

        {tab==="register"&&(
          <div style={{...S.card,maxWidth:520}}>
            <p style={{fontWeight:600,fontSize:16,marginBottom:6}}>📝 Donor Registration</p>
            <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>Register yourself as a blood donor in the system.</p>
            {regMsg&&<div style={S.alert(regMsg.startsWith("✓"))}>{regMsg}</div>}
            <form onSubmit={registerDonor} style={{display:"grid",gap:14}}>
              {[["Full Name","name","text","Arjun Kumar"],["Age (18-65)","age","number","25"],["Phone Number","phone","text","9876543210"],["City","city","text","Chennai"]].map(([l,k,t,p])=>(
                <div key={k}>
                  <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>{l}</label>
                  <input style={S.inp} type={t} required placeholder={p} value={regForm[k]} onChange={e=>setRegForm(p=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>Gender</label>
                  <select style={S.inp} value={regForm.gender} onChange={e=>setRegForm(p=>({...p,gender:e.target.value}))}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>Blood Group</label>
                  <select style={S.inp} value={regForm.bloodGroup} onChange={e=>setRegForm(p=>({...p,bloodGroup:e.target.value}))}>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" style={{padding:"12px",background:"#dc2626",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>
                Register as Donor →
              </button>
            </form>
          </div>
        )}

        {tab==="predictions"&&(
          <div style={{display:"grid",gap:20}}>
            <div style={S.card}>
              <p style={{fontWeight:600,fontSize:16,marginBottom:6}}>🤖 Donor Return Prediction (RandomForest ML)</p>
              <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>Predicts the probability that a donor will return for their next donation based on age, history, and days since last donation.</p>
              <div style={{background:"#0a0a14",borderRadius:10,padding:16,marginBottom:20,fontSize:13}}>
                <p style={{color:"#94a3b8",marginBottom:8}}>📋 Sample input: Age 28, 5 donations, 120 days since last, A+ blood group, Chennai</p>
                <p style={{color:"#64748b",fontSize:12}}>Model: RandomForestClassifier (100 trees, trained on 300 samples)</p>
              </div>
              <button onClick={runPrediction} disabled={predLoading}
                style={{padding:"11px 28px",background:predLoading?"#374151":"#dc2626",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:500,cursor:predLoading?"wait":"pointer"}}>
                {predLoading?"🔄 Running Prediction...":"▶ Run ML Prediction"}
              </button>
              {prediction&&(
                <div style={{marginTop:20,background:prediction.error?"#450a0a":(prediction.will_return?"#14532d20":"#78350f20"),border:"1px solid #ffffff10",borderRadius:12,padding:24}}>
                  {prediction.error
                    ?<p style={{color:"#fca5a5",whiteSpace:"pre-wrap"}}>{prediction.error}</p>
                    :<>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                        <div>
                          <p style={{fontSize:13,color:"#94a3b8",marginBottom:4}}>Prediction Result</p>
                          <p style={{fontSize:22,fontWeight:700,color:prediction.will_return?"#86efac":"#fdba74"}}>{prediction.label}</p>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <p style={{fontSize:40,fontWeight:800,color:prediction.will_return?"#86efac":"#fdba74"}}>{prediction.probability_percent}</p>
                          <p style={{fontSize:12,color:"#64748b"}}>Return Probability</p>
                        </div>
                      </div>
                      {/* Probability bar */}
                      <div style={{background:"#1e293b",borderRadius:999,height:8,marginBottom:16}}>
                        <div style={{width:prediction.probability_percent,background:prediction.will_return?"#16a34a":"#f59e0b",borderRadius:999,height:"100%",transition:"width 1s ease"}}/>
                      </div>
                      <p style={{fontSize:14,color:"#94a3b8"}}>💡 {prediction.recommendation}</p>
                    </>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
