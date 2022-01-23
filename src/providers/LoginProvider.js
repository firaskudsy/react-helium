//1.
import React, {  useState } from "react";


//2.
export const LoginContext = React.createContext();


//3.
export const LoginProvider = ({ children }) => {
  const [frm, setFrm] = useState({type:'signin'});


  return (
    <LoginContext.Provider value={{ frm, setFrm }}>{children}</LoginContext.Provider>
  );
};