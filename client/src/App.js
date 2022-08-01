import React, { useEffect } from 'react';
import './App.css';
import Header from './Component/Header';
import Upload from './Component/Upload';
import Detail from './Component/Detail';
import Edit from './Component/Edit';
import Login from './Component/Login';
import Register from './Component/Register';
import { Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser, clearUser } from './Reducer/userSlice';
import firebase from './firebase';
import HomePage from './Component/HomePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      if (userInfo !== null) {
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        dispatch(clearUser());
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/post/:postNum' element={<Detail />} />
        <Route path='/edit/:postNum' element={<Edit />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
