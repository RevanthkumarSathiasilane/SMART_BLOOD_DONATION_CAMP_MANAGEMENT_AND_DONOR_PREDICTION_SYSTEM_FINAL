import{createContext,useContext,useState,useEffect}from"react";
const C=createContext();
export function AuthProvider({children}){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    const t=localStorage.getItem("token");
    if(t)setUser({token:t,role:localStorage.getItem("role"),username:localStorage.getItem("username"),userId:localStorage.getItem("userId"),email:localStorage.getItem("email")});
    setLoading(false);
  },[]);
  const login=d=>{
    Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,v));
    setUser(d);
  };
  const logout=()=>{localStorage.clear();setUser(null);};
  return<C.Provider value={{user,login,logout,loading}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
