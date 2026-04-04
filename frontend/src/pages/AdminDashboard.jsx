import{useState,useEffect}from"react";
import{Bar,Doughnut}from"react-chartjs-2";
import{Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend}from"chart.js";
import Navbar from"../components/Navbar";
import StatCard from"../components/StatCard";
import{adminAPI,donorAPI}from"../services/api";

ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend);
const LINKS=[{path:"/dashboard",icon:"🏠",label:"Dashboard"},{path:"/chat",icon:"🤖",label:"AI Chat"}];

export default function AdminDashboard(){
  const[ov,setOv]=useState({});
  const[users,setUsers]=useState([]);
  const[donors,setDonors]=useState([]);
  const[tab,setTab]=useState("overview");

  const load=()=>{
    adminAPI.overview().then(r=>setOv(r.data)).catch(()=>{});
    adminAPI.users().then(r=>setUsers(r.data)).catch(()=>{});
    donorAPI.getAll().then(r=>setDonors(r.data)).catch(()=>{});
  };
  useEffect(load,[]);

  const delUser=async id=>{
    if(!window.confirm("Delete user?"))return;
    try{await adminAPI.delUser(id);load();}catch(e){}
  };

  const s={background:"#030712",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9"};
  const card={background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:24};
  const tabS=a=>({padding:"8px 20px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,background:a?"#7c3aed":"transparent",color:a?"#fff":"#64748b"});

  const stock=ov.bloodStock||[];
  const byGroup={};
  donors.forEach(d=>{if(d.bloodGroup)byGroup[d.bloodGroup]=(byGroup[d.bloodGroup]||0)+1;});
  const COLORS=["#dc2626","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6"];

  const ROLE_COLORS={SUPER_ADMIN:"#7c3aed",CAMP_COORDINATOR:"#16a34a",HOSPITAL_ADMIN:"#2563eb",DONOR:"#dc2626"};

  return(
    <div style={s}>
      <Navbar links={LINKS}/>
      <div style={{padding:"24px 32px",maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Super Admin Dashboard 🛡️</h1>
        <p style={{color:"#64748b",marginBottom:24,fontSize:14}}>Complete system overview, user management and analytics.</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          <StatCard icon="👤" label="Total Users" value={ov.totalUsers||0} color="#7c3aed"/>
          <StatCard icon="👥" label="Total Donors" value={ov.totalDonors||0} color="#dc2626"/>
          <StatCard icon="🏕️" label="Total Camps" value={ov.totalCamps||0} color="#16a34a"/>
          <StatCard icon="🩸" label="Donations" value={ov.totalDonations||0} color="#2563eb"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          <StatCard icon="📅" label="Upcoming Camps" value={ov.upcomingCamps||0} color="#f59e0b"/>
          <StatCard icon="⚠️" label="Critical Alerts" value={ov.criticalAlerts||0} color="#dc2626" sub={ov.criticalAlerts>0?"Needs attention":"All OK"}/>
          <StatCard icon="💉" label="Units Collected" value={`${Math.round(ov.totalUnitsCollected||0)}L`} color="#06b6d4"/>
          <StatCard icon="👥" label="Total Attendance" value={ov.totalAttendance||0} color="#8b5cf6"/>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:24,background:"#0f172a",borderRadius:10,padding:4,width:"fit-content"}}>
          {["overview","users","donors"].map(t=>(
            <button key={t} style={tabS(tab===t)} onClick={()=>setTab(t)}>
              {t==="overview"?"📊 Analytics":t==="users"?"👤 Users":"👥 Donors"}
            </button>
          ))}
        </div>

        {tab==="overview"&&(
          <div style={{display:"grid",gap:20}}>
            {(ov.criticalAlerts||0)>0&&(
              <div style={{...card,background:"#7f1d1d15",borderColor:"#dc262640"}}>
                <p style={{fontWeight:600,color:"#fca5a5",marginBottom:12}}>🚨 Critical Alerts ({ov.criticalAlerts})</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {stock.filter(s=>s.unitsAvailable<s.criticalLevel).map(s=>(
                    <span key={s.id} style={{background:"#dc262620",border:"1px solid #dc262640",padding:"4px 14px",borderRadius:999,fontSize:13,color:"#fca5a5"}}>{s.bloodGroup}: {s.unitsAvailable}L</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:20}}>
              <div style={card}>
                <p style={{fontWeight:600,marginBottom:16}}>Blood Stock Overview</p>
                {stock.length>0&&<Bar data={{labels:stock.map(s=>s.bloodGroup),datasets:[{label:"Available",data:stock.map(s=>s.unitsAvailable),backgroundColor:stock.map(s=>s.unitsAvailable<s.criticalLevel?"#dc2626":"#7c3aed"),borderRadius:6}]}}
                  options={{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:"#ffffff08"}},y:{grid:{color:"#ffffff08"}}}}}/>}
              </div>
              <div style={card}>
                <p style={{fontWeight:600,marginBottom:16}}>Donors by Blood Group</p>
                {Object.keys(byGroup).length>0&&<Doughnut data={{labels:Object.keys(byGroup),datasets:[{data:Object.values(byGroup),backgroundColor:COLORS,borderWidth:0}]}}
                  options={{responsive:true,plugins:{legend:{position:"bottom",labels:{color:"#94a3b8",font:{size:11}}}}}}/>}
              </div>
            </div>
          </div>
        )}

        {tab==="users"&&(
          <div style={card}>
            <p style={{fontWeight:600,marginBottom:16}}>All Users ({users.length})</p>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
                {["ID","Username","Email","Role","Action"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#64748b",fontWeight:500}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id} style={{borderBottom:"1px solid #0f172a"}}>
                    <td style={{padding:"10px 12px",color:"#64748b"}}>{u.id}</td>
                    <td style={{padding:"10px 12px",fontWeight:500}}>{u.username}</td>
                    <td style={{padding:"10px 12px",color:"#64748b"}}>{u.email}</td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:11,padding:"3px 10px",borderRadius:999,background:`${ROLE_COLORS[u.role]||"#374151"}20`,color:ROLE_COLORS[u.role]||"#9ca3af",border:`1px solid ${ROLE_COLORS[u.role]||"#374151"}40`}}>{u.role}</span>
                    </td>
                    <td style={{padding:"10px 12px"}}>
                      <button onClick={()=>delUser(u.id)} style={{fontSize:11,padding:"3px 10px",background:"#dc262620",border:"1px solid #dc262440",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==="donors"&&(
          <div style={card}>
            <p style={{fontWeight:600,marginBottom:16}}>All Donors ({donors.length})</p>
            <div style={{display:"grid",gap:8}}>
              {donors.slice(0,20).map(d=>(
                <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#0a0a14",borderRadius:10}}>
                  <div>
                    <p style={{fontWeight:500,fontSize:14}}>{d.name}</p>
                    <p style={{fontSize:12,color:"#64748b"}}>{d.city} · {d.phone}</p>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontWeight:700,fontSize:16,color:"#dc2626"}}>{d.bloodGroup}</span>
                    <span style={{fontSize:11,padding:"3px 10px",borderRadius:999,background:d.isEligible?"#16a34a20":"#dc262620",color:d.isEligible?"#86efac":"#fca5a5"}}>{d.isEligible?"Eligible":"Not Eligible"}</span>
                    <span style={{fontSize:11,color:"#64748b"}}>{d.totalDonations} donations</span>
                  </div>
                </div>
              ))}
              {donors.length>20&&<p style={{fontSize:13,color:"#64748b",textAlign:"center",paddingTop:8}}>Showing 20 of {donors.length} donors</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
