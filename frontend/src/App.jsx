import{BrowserRouter,Routes,Route,Navigate}from"react-router-dom";
import{AuthProvider,useAuth}from"./context/AuthContext";
import Home from"./pages/Home";
import Login from"./pages/Login";
import DonorDashboard from"./pages/DonorDashboard";
import CoordinatorDashboard from"./pages/CoordinatorDashboard";
import HospitalDashboard from"./pages/HospitalDashboard";
import AdminDashboard from"./pages/AdminDashboard";
import ChatPage from"./pages/ChatPage";

function Dashboard(){
  const{user}=useAuth();
  if(!user)return<Navigate to="/login"/>;
  if(user.role==="SUPER_ADMIN")return<AdminDashboard/>;
  if(user.role==="CAMP_COORDINATOR")return<CoordinatorDashboard/>;
  if(user.role==="HOSPITAL_ADMIN")return<HospitalDashboard/>;
  return<DonorDashboard/>;
}

function Guard({children}){
  const{user,loading}=useAuth();
  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#030712",color:"#f1f5f9",fontFamily:"'DM Sans',sans-serif"}}>Loading...</div>;
  return user?children:<Navigate to="/login"/>;
}

function AppRoutes(){
  const{user}=useAuth();
  return(
    <Routes>
      <Route path="/" element={user?<Navigate to="/dashboard"/>:<Home/>}/>
      <Route path="/login" element={user?<Navigate to="/dashboard"/>:<Login/>}/>
      <Route path="/dashboard" element={<Guard><Dashboard/></Guard>}/>
      <Route path="/chat" element={<Guard><ChatPage/></Guard>}/>
      <Route path="*" element={<Navigate to="/"/>}/>
    </Routes>
  );
}

export default function App(){
  return(
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  );
}
