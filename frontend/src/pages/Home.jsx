import{useState,useEffect}from"react";
import{useNavigate}from"react-router-dom";
import{publicAPI}from"../services/api";

const ROLES=[
  {v:"DONOR",icon:"🩸",label:"Donor",desc:"Register, check eligibility, view history"},
  {v:"CAMP_COORDINATOR",icon:"🏕️",label:"Coordinator",desc:"Create camps, track attendance"},
  {v:"HOSPITAL_ADMIN",icon:"🏥",label:"Hospital Admin",desc:"Monitor stock, set alerts"},
  {v:"SUPER_ADMIN",icon:"🛡️",label:"Super Admin",desc:"Full system control & analytics"},
];

export default function Home(){
  const nav=useNavigate();
  const[stats,setStats]=useState({totalDonors:0,totalCamps:0,upcomingCamps:0,totalUnitsCollected:0});
  useEffect(()=>{publicAPI.stats().then(r=>setStats(r.data)).catch(()=>{});}, []);

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#030712 0%,#0f0a0a 50%,#030712 100%)",fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      {/* Animated background blobs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-10%",left:"20%",width:500,height:500,background:"radial-gradient(circle,#7f1d1d40,transparent 70%)",borderRadius:"50%",animation:"float 8s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"15%",width:400,height:400,background:"radial-gradient(circle,#dc262620,transparent 70%)",borderRadius:"50%",animation:"float 10s ease-in-out infinite",animationDelay:"3s"}}/>
      </div>

      {/* Nav */}
      <nav style={{position:"relative",zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 48px",borderBottom:"1px solid #ffffff0d"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,background:"#dc2626",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 20px #dc262660"}}>🩸</div>
          <span style={{fontWeight:600,fontSize:18,color:"#fff"}}>BloodBank <span style={{color:"#f87171"}}>Pro</span></span>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>nav("/login")} style={{padding:"8px 20px",background:"transparent",border:"1px solid #ffffff20",borderRadius:8,color:"#9ca3af",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Sign In</button>
          <button onClick={()=>nav("/login")} style={{padding:"8px 20px",background:"#dc2626",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:500,boxShadow:"0 0 20px #dc262640"}}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{position:"relative",zIndex:10,maxWidth:900,margin:"0 auto",padding:"80px 32px 60px",textAlign:"center"}}>
        <div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#7f1d1d30",border:"1px solid #dc262640",borderRadius:999,padding:"6px 16px",fontSize:13,color:"#fca5a5",marginBottom:32}}>
          <span style={{width:8,height:8,background:"#ef4444",borderRadius:"50%",display:"inline-block",animation:"glow 2s ease-in-out infinite"}}/>
          AI-Powered Blood Donation Management System
        </div>
        <h1 className="fade-up d1" style={{fontSize:64,fontWeight:700,lineHeight:1.1,marginBottom:24,fontFamily:"'Playfair Display',serif"}}>
          Every Drop<br/><span style={{background:"linear-gradient(135deg,#f87171,#ef4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Saves a Life</span>
        </h1>
        <p className="fade-up d2" style={{fontSize:18,color:"#9ca3af",maxWidth:600,margin:"0 auto 40px",lineHeight:1.7}}>
          Connect donors, manage camps, predict shortages — all powered by machine learning and real-time analytics.
        </p>
        <div className="fade-up d3" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>nav("/login")} style={{padding:"14px 32px",background:"#dc2626",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 32px #dc262640",transition:"transform .2s"}} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>
            Start Donating →
          </button>
          <button onClick={()=>nav("/login")} style={{padding:"14px 32px",background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:12,color:"#e5e7eb",fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>
            Dashboard Login
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="fade-up d3" style={{position:"relative",zIndex:10,maxWidth:800,margin:"0 auto 80px",padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {[
            {label:"Total Donors",value:stats.totalDonors||"..."},
            {label:"Camps Organised",value:stats.totalCamps||"..."},
            {label:"Upcoming Camps",value:stats.upcomingCamps||"..."},
            {label:"Units Collected",value:stats.totalUnitsCollected?Math.round(stats.totalUnitsCollected)+"L":"..."},
          ].map((s,i)=>(
            <div key={i} style={{background:"#ffffff06",border:"1px solid #ffffff0d",borderRadius:16,padding:"24px 16px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:12,color:"#6b7280"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div style={{position:"relative",zIndex:10,maxWidth:1000,margin:"0 auto 80px",padding:"0 32px"}}>
        <p style={{textAlign:"center",fontSize:12,textTransform:"uppercase",letterSpacing:4,color:"#6b7280",marginBottom:12}}>Built for every stakeholder</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:700,marginBottom:48,fontFamily:"'Playfair Display',serif"}}>Role-Based Dashboards</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {ROLES.map((r,i)=>(
            <div key={i} className={"fade-up d"+((i%4)+2)} onClick={()=>nav("/login")}
              style={{background:"linear-gradient(135deg,#ffffff08,#ffffff03)",border:"1px solid #ffffff0d",borderRadius:20,padding:"28px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#dc262640";e.currentTarget.style.background="linear-gradient(135deg,#7f1d1d20,#ffffff03)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#ffffff0d";e.currentTarget.style.background="linear-gradient(135deg,#ffffff08,#ffffff03)";}}>
              <div style={{fontSize:36,marginBottom:12}}>{r.icon}</div>
              <h3 style={{fontSize:18,fontWeight:600,marginBottom:8,color:"#f3f4f6"}}>{r.label}</h3>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{position:"relative",zIndex:10,maxWidth:1000,margin:"0 auto 80px",padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {[
            {icon:"🤖",t:"ML Predictions",d:"RandomForest donor return prediction. KMeans camp location optimisation. Linear regression for stock forecasting."},
            {icon:"📊",t:"Live Analytics",d:"Real-time blood stock dashboards with shortage alerts. Chart.js visualisations for all key metrics."},
            {icon:"💬",t:"AI Chat Assistant",d:"HuggingFace Mistral model integration with intelligent rule-based fallback. Always answers."},
          ].map((f,i)=>(
            <div key={i} style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:16,padding:"28px"}}>
              <div style={{fontSize:32,marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>{f.t}</h3>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{position:"relative",zIndex:10,textAlign:"center",padding:"24px",borderTop:"1px solid #ffffff08",fontSize:13,color:"#374151"}}>
        Blood Donation Camp Management & Donor Prediction System
      </footer>
    </div>
  );
}
