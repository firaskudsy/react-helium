//1.
import React, { useEffect, useState } from "react";
import firebase from '../services/firebase';
import {getCurrency, getSelectedMiner} from '../services/firebase';

import  {updateUser} from '../services/firebase';

//2.
export const AuthContext = React.createContext();


//3.
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
    const [refresh, setRefresh] = useState('');
    const [authenticating, setAuthenticating] = useState(true);
const [active, setActive] = useState(null);
  const [later, setLater] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if(user){
      setUser(user);
      setAuthenticating(false);
const _account = await updateUser(user.uid);
setAccount(_account);
      let _selectdMiner = await getSelectedMiner(user.uid);
      let _currency = await getCurrency(user.uid);
      if (!_selectdMiner) {
setActive({hid:null, name:null, currency:null});
      } else {

setActive({hid:_selectdMiner.address, name:_selectdMiner.name, currency:_currency});
      }
      } else {
        setUser(null);
        setAccount(null);
        setAuthenticating(false);
      }

    });




  }, []);

  return (
    <AuthContext.Provider value={{ user, account, later, setLater, refresh, setRefresh, authenticating, active, setActive }}>{children}</AuthContext.Provider>
  );
};