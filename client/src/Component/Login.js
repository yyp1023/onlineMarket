import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from '../firebase';
import LoginCss from '../Style/Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  let navigate = useNavigate();

  const login = async () => {
    if (!(email && password)) {
      return setError('Please fill in all the blanks.');
    }
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (err) {
      setError('Email or password is not valid.');
    }
  }

  return (
    <div className={LoginCss.wrapper}>
      <div className={LoginCss.email}>
        <div>
          <label>Email</label>
        </div>
        <div>
          <input type='email' value={email} onChange={(e) => {setEmail(e.currentTarget.value)}} />
        </div>
      </div>
      <div  className={LoginCss.password}>
        <div>
          <label>Password</label>
        </div>
        <div>
          <input type='password' value={password} onChange={(e) => {setPassword(e.currentTarget.value)}} />
        </div>
      </div>
      <div className={LoginCss.error}>{error}</div>
      <div className={LoginCss.marginTop30}>
        <div>
          <button onClick={() => {login()}}>Sign In</button>
        </div>
        <div>
          <button className={LoginCss.marginTop20} onClick={() => {navigate('/register')}}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;