import React from 'react'
import {  useContext } from 'react';
import Signup from './Signup';
import { LoginContext } from '../providers/LoginProvider';
// import Login from './Login';
import Signin from './Signin';
import Forget from './Forget';
import './Login.css'
import { Row, Col } from 'react-bootstrap';

export default function Landing() {

const {frm} = useContext(LoginContext);

    return (
         <div className="login">
         <Row className="login-page">

        {
           frm.type === 'signup' ? <Signup/> :  frm.type === 'signin' ?<Signin/>:<Forget/>
        }
         <Col md={6} className="img-bk">

          <img className="img-lg" src={frm.type === 'signup' ?"/signup.svg":"/signin.svg"} alt="login-bk" />
        </Col>
         </Row>
        </div>
    )
}
