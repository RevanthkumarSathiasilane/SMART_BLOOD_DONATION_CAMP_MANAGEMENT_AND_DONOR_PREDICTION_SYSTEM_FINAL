export default function StatCard({icon,label,value,color="#dc2626",sub}){
  return(
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:"20px 24px",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{fontSize:24}}>{icon}</div>
        <div style={{width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 8px ${color}`}}/>
      </div>
      <div style={{fontSize:28,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>{value}</div>
      <div style={{fontSize:13,color:"#64748b"}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:color,marginTop:4}}>{sub}</div>}
    </div>
  );
}
