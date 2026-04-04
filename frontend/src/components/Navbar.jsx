import{useNavigate,useLocation}from"react-router-dom";
import{useAuth}from"../context/AuthContext";

const ROLE_COLORS={DONOR:"#dc2626",CAMP_COORDINATOR:"#16a34a",HOSPITAL_ADMIN:"#2563eb",SUPER_ADMIN:"#7c3aed"};
const ROLE_LABELS={DONOR:"Donor",CAMP_COORDINATOR:"Coordinator",HOSPITAL_ADMIN:"Hospital Admin",SUPER_ADMIN:"Super Admin"};

export default function Navbar({links=[]}){
  const{user,logout}=useAuth();
  const nav=useNavigate();
  const loc=useLocation();
  const color=ROLE_COLORS[user?.role]||"#dc2626";

  return(
    <nav style={{background:"#0a0a0f",borderBottom:"1px solid #ffffff0d",padding:"0 24px",display:"flex",alignItems:"center",height:56,gap:8,position:"sticky",top:0,zIndex:100,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginRight:16,cursor:"pointer"}} onClick={()=>nav("/dashboard")}>
        <div style={{width:28,height:28,background:color,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:`0 0 12px ${color}60`}}>🩸</div>
        <span style={{fontWeight:600,fontSize:14,color:"#f1f5f9"}}>BloodBank <span style={{color:color}}>Pro</span></span>
      </div>
      <div style={{display:"flex",gap:2,flex:1}}>
        {links.map(l=>(
          <button key={l.path} onClick={()=>nav(l.path)}
            style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,
              background:loc.pathname===l.path?"#ffffff12":"transparent",
              color:loc.pathname===l.path?"#f1f5f9":"#6b7280",transition:"all .15s"}}
            onMouseEnter={e=>{if(loc.pathname!==l.path)e.currentTarget.style.background="#ffffff07";}}
            onMouseLeave={e=>{if(loc.pathname!==l.path)e.currentTarget.style.background="transparent";}}>
            <span>{l.icon}</span>{l.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:12,padding:"3px 10px",borderRadius:999,background:`${color}20`,color:color,border:`1px solid ${color}40`,fontWeight:500}}>{ROLE_LABELS[user?.role]}</span>
        <span style={{fontSize:13,color:"#6b7280"}}>{user?.username}</span>
        <button onClick={()=>{logout();nav("/");}}
          style={{padding:"5px 12px",borderRadius:8,border:"1px solid #dc262640",background:"transparent",color:"#f87171",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>
          Logout
        </button>
      </div>
    </nav>
  );
}
