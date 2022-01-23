
import React from 'react'
import { useEffect } from 'react';
import { signOutWithGoogle } from '../services/firebase';
import {useNavigate} from 'react-router-dom';


export default function Logout() {
      const navigate = useNavigate();


    useEffect(() => {
        const logout = async () => {
            signOutWithGoogle();
                navigate('/');

        }
        logout();
    }, []);

    return (
        <div>

        </div>
    )
}
