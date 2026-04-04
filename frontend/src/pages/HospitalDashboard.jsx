import{useState,useEffect,useCallback}from"react";
import{Bar,Doughnut}from"react-chartjs-2";
import{Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend}from"chart.js";
import Navbar from"../components/Navbar";
import StatCard from"../components/StatCard";
import{stockAPI,mlAPI}from"../services/api";
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend);
const LINKS=[{path:"/dashboard",icon:"🏠",label:"Dashboard"},{path:"/chat",icon:"🤖",label:"AI Chat"}];

export default function HospitalDashboard(){
  const[stock,setStock]=useState([]);
  const[alerts,setAlerts]=useState([]);
  const[summary,setSummary]=useState({});
  const[prediction,setPrediction]=useState(null);
  const[predLoading,setPredLoading]=useState(false);
  const[tab,setTab]=useState("stock");
  const[updateBG,setUpdateBG]=useState("A+");
  const[updateUnits,setUpdateUnits]=useState("");
  const[msg,setMsg]=useState("");
  const[lastRefresh,setLastRefresh]=useState(new Date());

  const load=useCallback(()=>{
    stockAPI.getAll().then(r=>setStock(r.data)).catch(()=>{});
    stockAPI.getAlerts().then(r=>setAlerts(r.data)).catch(()=>{});
    stockAPI.getSummary().then(r=>setSummary(r.data)).catch(()=>{});
    setLastRefresh(new Date());
  },[]);

  useEffect(()=>{
    load();
    const iv=setInterval(load,30000);
    return()=>clearInterval(iv);
  },[load]);

  const updateStock=async e=>{
    e.preventDefault();setMsg("");
    try{await stockAPI.update(updateBG,parseFloat(updateUnits));setMsg("✓ Stock updated for "+updateBG);setUpdateUnits("");load();}
    catch(e){setMsg("✗ Update failed: "+(e.response?.data?.error||e.message));}
  };

  const predictShortage=async()=>{
    setPredLoading(true);setPrediction(null);
    const o=stock.find(s=>s.bloodGroup===updateBG)||{unitsAvailable:20};
    try{
      const{data}=await mlAPI.predictStock({current_units:o.unitsAvailable||20,daily_usage:3.5,camps_this_month:2,season:"Summer"});
      setPrediction(data);
    }catch(e){
      setPrediction({error:e.response?.status===503?"⚠️ FastAPI ML service is not running on port 8000.\n\nTo start it:\n  cd ml-service\n  venv\\Scripts\\activate\n  python -m uvicorn main:app --reload --port 8000":"Error: "+e.message});
    }finally{setPredLoading(false);}
  };

  const S={
    page:{background:"#030712",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9"},
    inner:{padding:"24px 32px",maxWidth:1200,margin:"0 auto"},
    card:{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:24},
    inp:{padding:"10px 14px",background:"#0a0a14",border:"1px solid #1e293b",borderRadius:8,color:"#f1f5f9",fontSize:13,fontFamily:"inherit"},
    tabBtn:(a)=>({padding:"8px 20px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,background:a?"#2563eb":"transparent",color:a?"#fff":"#64748b"}),
    msgBox:(ok)=>({background:ok?"#14532d20":"#7f1d1d20",border:`1px solid ${ok?"#16a34a40":"#dc262640"}`,borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:ok?"#86efac":"#fca5a5"}),
  };

  const COLORS=["#dc2626","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6"];

  return(
    <div style={S.page}>
      <Navbar links={LINKS}/>
      <div style={S.inner}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Hospital Admin Dashboard 🏥</h1>
            <p style={{color:"#64748b",fontSize:14}}>Monitor blood stock, manage inventory and get AI shortage predictions.</p>
          </div>
          <div style={{textAlign:"right"}}>
            <button onClick={load} style={{padding:"7px 16px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:12,marginBottom:4}}>🔄 Refresh</button>
            <p style={{fontSize:11,color:"#374151"}}>Last: {lastRefresh.toLocaleTimeString()} · Auto 30s</p>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          <StatCard icon="🩸" label="Total Units" value={`${Math.round(summary.totalUnits||0)}L`} color="#2563eb"/>
          <StatCard icon="⚠️" label="Critical Groups" value={summary.criticalGroups||0} color="#dc2626" sub={alerts.length>0?"Urgent!":""}/>
          <StatCard icon="✅" label="Healthy Groups" value={summary.healthyGroups||0} color="#16a34a"/>
          <StatCard icon="🔬" label="Blood Groups" value={stock.length} color="#7c3aed"/>
        </div>

        {alerts.length>0&&(
          <div style={{...S.card,background:"#7f1d1d15",borderColor:"#dc262640",marginBottom:20}}>
            <p style={{fontWeight:600,color:"#fca5a5",marginBottom:12}}>🚨 CRITICAL SHORTAGE — Immediate Action Required</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              {alerts.map(a=>(
                <div key={a.id} style={{background:"#dc262615",border:"1px solid #dc262440",borderRadius:10,padding:"12px 16px"}}>
                  <p style={{fontWeight:700,fontSize:24,color:"#fca5a5"}}>{a.bloodGroup}</p>
                  <p style={{fontSize:13,color:"#94a3b8"}}>{a.unitsAvailable}L available</p>
                  <p style={{fontSize:11,color:"#ef4444"}}>Minimum: {a.criticalLevel}L</p>
                  <div style={{marginTop:6,background:"#1e293b",borderRadius:4,height:4}}>
                    <div style={{width:`${Math.min(100,(a.unitsAvailable/a.criticalLevel)*100)}%`,background:"#dc2626",borderRadius:4,height:"100%"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:6,marginBottom:24,background:"#0f172a",borderRadius:10,padding:4,width:"fit-content"}}>
          {[["stock","📊 Stock Levels"],["update","✏️ Update Stock"],["predictions","🤖 ML Prediction"]].map(([t,l])=>(
            <button key={t} style={S.tabBtn(tab===t)} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        {msg&&<div style={S.msgBox(msg.startsWith("✓"))}>{msg}</div>}

        {tab==="stock"&&(
          <div style={{display:"grid",gap:20}}>
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:20}}>
              <div style={S.card}>
                <p style={{fontWeight:600,marginBottom:16}}>Blood Units by Group</p>
                {stock.length>0&&<Bar data={{
                  labels:stock.map(s=>s.bloodGroup),
                  datasets:[
                    {label:"Available",data:stock.map(s=>s.unitsAvailable),backgroundColor:stock.map(s=>s.unitsAvailable<s.criticalLevel?"#dc2626":"#2563eb"),borderRadius:6},
                    {label:"Critical Min",data:stock.map(s=>s.criticalLevel),backgroundColor:"#ffffff15",borderRadius:6}
                  ]
                }} options={{responsive:true,scales:{x:{grid:{color:"#ffffff08"},ticks:{color:"#64748b"}},y:{grid:{color:"#ffffff08"},ticks:{color:"#64748b"}}},plugins:{legend:{labels:{color:"#94a3b8"}}}}}/>}
              </div>
              <div style={S.card}>
                <p style={{fontWeight:600,marginBottom:16}}>Stock Distribution</p>
                {stock.length>0&&<Doughnut data={{labels:stock.map(s=>s.bloodGroup),datasets:[{data:stock.map(s=>s.unitsAvailable),backgroundColor:COLORS,borderWidth:0}]}}
                  options={{responsive:true,plugins:{legend:{position:"bottom",labels:{color:"#94a3b8",font:{size:11}}}}}}/>}
              </div>
            </div>
            <div style={S.card}>
              <p style={{fontWeight:600,marginBottom:16}}>Full Stock Table</p>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
                  {["Blood Group","Available","Min Level","Status","% of Min","Action"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#64748b",fontWeight:500}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {stock.map(s=>{
                    const pct=Math.round((s.unitsAvailable/s.criticalLevel)*100);
                    const ok=s.unitsAvailable>=s.criticalLevel;
                    return(
                      <tr key={s.id} style={{borderBottom:"1px solid #0f172a"}}>
                        <td style={{padding:"10px 12px",fontWeight:700,fontSize:18}}>{s.bloodGroup}</td>
                        <td style={{padding:"10px 12px",color:ok?"#86efac":"#fca5a5",fontWeight:600}}>{s.unitsAvailable}L</td>
                        <td style={{padding:"10px 12px",color:"#64748b"}}>{s.criticalLevel}L</td>
                        <td style={{padding:"10px 12px"}}><span style={{fontSize:11,padding:"3px 10px",borderRadius:999,background:ok?"#16a34a20":"#dc262620",color:ok?"#86efac":"#fca5a5"}}>{ok?"OK":"CRITICAL"}</span></td>
                        <td style={{padding:"10px 12px"}}>
                          <div style={{background:"#1e293b",borderRadius:4,height:6,width:80}}>
                            <div style={{width:Math.min(100,pct)+"%",background:ok?"#16a34a":"#dc2626",borderRadius:4,height:"100%"}}/>
                          </div>
                          <span style={{fontSize:10,color:"#64748b"}}>{pct}%</span>
                        </td>
                        <td style={{padding:"10px 12px"}}>
                          <button onClick={()=>{setUpdateBG(s.bloodGroup);setTab("update");}} style={{fontSize:11,padding:"4px 10px",background:"#2563eb20",border:"1px solid #2563eb40",borderRadius:6,color:"#93c5fd",cursor:"pointer",fontFamily:"inherit"}}>Update</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="update"&&(
          <div style={{...S.card,maxWidth:420}}>
            <p style={{fontWeight:600,fontSize:16,marginBottom:20}}>✏️ Update Blood Stock</p>
            <form onSubmit={updateStock} style={{display:"grid",gap:14}}>
              <div>
                <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>Blood Group</label>
                <select style={{...S.inp,width:"100%"}} value={updateBG} onChange={e=>setUpdateBG(e.target.value)}>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:"#94a3b8",display:"block",marginBottom:5}}>Set New Units (Litres)</label>
                <input style={{...S.inp,width:"100%",boxSizing:"border-box"}} type="number" step="0.5" min="0" required placeholder="e.g. 45.0" value={updateUnits} onChange={e=>setUpdateUnits(e.target.value)}/>
              </div>
              <button type="submit" style={{padding:"12px",background:"#2563eb",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}}>Update Stock →</button>
            </form>
          </div>
        )}

        {tab==="predictions"&&(
          <div style={S.card}>
            <p style={{fontWeight:600,fontSize:16,marginBottom:6}}>🤖 ML Blood Stock Shortage Prediction</p>
            <p style={{fontSize:13,color:"#64748b",marginBottom:8}}>Linear Regression predicts blood units available in 7 days based on current stock, daily usage, and scheduled camps.</p>
            <div style={{background:"#0a0a14",borderRadius:10,padding:14,marginBottom:20,fontSize:12,color:"#64748b"}}>
              📋 Predicting for <strong style={{color:"#94a3b8"}}>{updateBG}</strong>: Current {stock.find(s=>s.bloodGroup===updateBG)?.unitsAvailable||"N/A"}L · Daily usage: 3.5L · 2 camps this month
              <br/><span style={{fontSize:11,marginTop:4,display:"block"}}>Change blood group in "Update Stock" tab to predict for other groups</span>
            </div>
            <button onClick={predictShortage} disabled={predLoading}
              style={{padding:"11px 28px",background:predLoading?"#374151":"#2563eb",border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:500,cursor:predLoading?"wait":"pointer",marginBottom:20}}>
              {predLoading?"🔄 Computing...":"▶ Predict 7-Day Stock"}
            </button>
            {prediction&&(
              <div style={{background:prediction.error?"#450a0a":prediction.alert_level==="CRITICAL"?"#450a0a":prediction.alert_level==="WARNING"?"#431407":"#14532d20",border:"1px solid #ffffff10",borderRadius:12,padding:24}}>
                {prediction.error
                  ?<p style={{color:"#fca5a5",whiteSpace:"pre-wrap"}}>{prediction.error}</p>
                  :<>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                      <div>
                        <p style={{fontSize:13,color:"#94a3b8",marginBottom:4}}>Predicted units in 7 days</p>
                        <p style={{fontSize:40,fontWeight:800,color:"#f1f5f9"}}>{prediction.predicted_units_7d}L</p>
                        <p style={{fontSize:13,color:"#64748b"}}>Current: {prediction.current_units}L</p>
                      </div>
                      <span style={{padding:"8px 20px",borderRadius:999,fontWeight:700,fontSize:14,
                        background:prediction.alert_level==="CRITICAL"?"#dc2626":prediction.alert_level==="WARNING"?"#d97706":prediction.alert_level==="LOW"?"#7c3aed":"#16a34a",color:"#fff"}}>
                        {prediction.alert_level}
                      </span>
                    </div>
                    {/* Trend bar */}
                    <div style={{background:"#1e293b",borderRadius:999,height:10,marginBottom:16}}>
                      <div style={{width:Math.min(100,(prediction.predicted_units_7d/100)*100)+"%",background:prediction.alert_level==="CRITICAL"?"#dc2626":prediction.alert_level==="WARNING"?"#d97706":"#16a34a",borderRadius:999,height:"100%",transition:"width 1s ease"}}/>
                    </div>
                    <p style={{fontSize:15,color:"#f1f5f9",fontWeight:500}}>{prediction.recommendation}</p>
                  </>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
