import{useState,useRef,useEffect}from"react";
import Navbar from"../components/Navbar";
import{mlAPI}from"../services/api";

const LINKS=[{path:"/dashboard",icon:"🏠",label:"Dashboard"},{path:"/chat",icon:"🤖",label:"AI Chat"}];

const QUICK=[
  "Which blood group is the universal donor?",
  "How often can I donate blood?",
  "What is O- blood group used for?",
  "Which blood group is critically low?",
  "How does blood donation work?",
  "Best location for next camp?",
];

export default function ChatPage(){
  const[msgs,setMsgs]=useState([{
    role:"bot",
    text:"Hello! 👋 I'm your BloodBank AI Assistant 🩸\n\nAsk me about blood groups, donation eligibility, stock levels, camp locations, or anything related to blood banking!",
    source:"system"
  }]);
  const[inp,setInp]=useState("");
  const[loading,setLoading]=useState(false);
  const bottomRef=useRef();

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[msgs,loading]);

  const send=async(text)=>{
    const q=(text||inp).trim();
    if(!q||loading) return;
    setInp("");
    setMsgs(p=>[...p,{role:"user",text:q}]);
    setLoading(true);
    try{
      const res=await mlAPI.chat({message:q,context:"Blood bank management system for hospitals and donors."});
      const data=res.data;
      setMsgs(p=>[...p,{role:"bot",text:data.reply||"Sorry, I could not process that.",source:data.source}]);
    }catch(err){
      const errMsg=err.response?.status===503
        ?"⚠️ ML service (FastAPI) is not running!\n\nTo fix: Open a terminal and run:\n  cd ml-service\n  venv\\Scripts\\activate\n  python -m uvicorn main:app --reload --port 8000\n\nThen try again."
        :"❌ Could not connect to the AI service. Please check that both Spring Boot (port 8080) and FastAPI (port 8000) are running.";
      setMsgs(p=>[...p,{role:"bot",text:errMsg,source:"error"}]);
    }finally{
      setLoading(false);
    }
  };

  const onKey=e=>{
    if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}
  };

  const S={
    page:{background:"#030712",height:"100vh",display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9",overflow:"hidden"},
    wrap:{flex:1,display:"flex",flexDirection:"column",maxWidth:860,width:"100%",margin:"0 auto",padding:"12px 16px 16px",overflow:"hidden"},
    quickBar:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10},
    quickBtn:{padding:"5px 12px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:999,color:"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"},
    msgList:{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:14,paddingRight:4},
    row:(role)=>({display:"flex",justifyContent:role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}),
    avatar:(role)=>({width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,
      background:role==="user"?"#1e293b":"#dc2626"}),
    bubble:(role,src)=>({
      maxWidth:"75%",padding:"12px 16px",fontSize:14,lineHeight:1.65,whiteSpace:"pre-wrap",wordBreak:"break-word",
      borderRadius:role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
      background:role==="user"?"#dc2626":src==="error"?"#450a0a":"#0f172a",
      color:role==="user"?"#fff":src==="error"?"#fca5a5":"#e2e8f0",
      border:role==="bot"?`1px solid ${src==="error"?"#7f1d1d":"#1e293b"}`:"none",
    }),
    srcTag:{fontSize:10,color:"#475569",marginTop:4,display:"block"},
    inputBar:{display:"flex",gap:10,paddingTop:12,borderTop:"1px solid #1e293b",marginTop:8},
    input:{flex:1,padding:"13px 16px",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,color:"#f1f5f9",fontSize:14,fontFamily:"inherit",outline:"none",resize:"none"},
    sendBtn:(dis)=>({padding:"13px 22px",background:dis?"#374151":"#dc2626",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:600,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",transition:"background .2s",whiteSpace:"nowrap"}),
  };

  return(
    <div style={S.page}>
      <Navbar links={LINKS}/>
      <div style={S.wrap}>
        {/* Quick prompts */}
        <div style={S.quickBar}>
          {QUICK.map((q,i)=>(
            <button key={i} onClick={()=>send(q)} style={S.quickBtn}
              onMouseEnter={e=>{e.target.style.borderColor="#dc262660";e.target.style.color="#f1f5f9";}}
              onMouseLeave={e=>{e.target.style.borderColor="#1e293b";e.target.style.color="#94a3b8";}}>
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={S.msgList}>
          {msgs.map((m,i)=>(
            <div key={i} style={S.row(m.role)}>
              {m.role==="bot"&&<div style={S.avatar("bot")}>🤖</div>}
              <div style={S.bubble(m.role,m.source)}>
                {m.text}
                {m.source&&m.source!=="system"&&m.source!=="error"&&(
                  <span style={S.srcTag}>via {m.source==="huggingface"?"HuggingFace AI":"Smart Assistant"}</span>
                )}
              </div>
              {m.role==="user"&&<div style={S.avatar("user")}>👤</div>}
            </div>
          ))}

          {loading&&(
            <div style={S.row("bot")}>
              <div style={S.avatar("bot")}>🤖</div>
              <div style={{...S.bubble("bot",""),display:"flex",alignItems:"center",gap:8,padding:"14px 18px"}}>
                <span style={{display:"inline-flex",gap:4}}>
                  {[0,1,2].map(i=>(
                    <span key={i} style={{width:7,height:7,borderRadius:"50%",background:"#64748b",display:"inline-block",animation:"bounce 1.2s infinite",animationDelay:`${i*0.2}s`}}/>
                  ))}
                </span>
                <span style={{fontSize:13,color:"#64748b"}}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input bar */}
        <div style={S.inputBar}>
          <input
            style={S.input} value={inp}
            onChange={e=>setInp(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about blood donation, groups, camps, eligibility..."
            onFocus={e=>e.target.style.borderColor="#dc262660"}
            onBlur={e=>e.target.style.borderColor="#1e293b"}
          />
          <button style={S.sendBtn(!inp.trim()||loading)} disabled={!inp.trim()||loading} onClick={()=>send()}>
            {loading?"...":"Send →"}
          </button>
        </div>
        <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6)}40%{transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}
