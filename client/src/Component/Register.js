import React, { useState } from 'react';
import firebase from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterCss from '../Style/Register.module.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameCheck, setNameCheck] = useState(false);
  const [error, setError] = useState({});
  const [duplicate, setDuplicate] = useState('');
  const [emailCheck, setEmailCheck] = useState(false);

  let navigate = useNavigate();

  const register = async () => {
    validateEmail();
    setError(validate(name, nameCheck, email, password, confirmPassword));
    if (!nameCheck) {
        return setDuplicate('Check for duplicate names.');
    }
    let createdUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await createdUser.user.updateProfile({
        displayName: name,
        photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
    });
    let body = {
        email: createdUser.user.multiFactor.user.email,
        displayName: createdUser.user.multiFactor.user.displayName,
        uid: createdUser.user.multiFactor.user.uid,
        photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
    };
    axios.post('/api/user/register', body).then((res) => {
        if (res.data.success) {
            alert('You have been registered successfully.');
            navigate('/login');
        } else {
            alert('You have not been registered. Please try again.');
        }
    }).catch((err) => {
        console.log(err);
    });
  }

  const duplicateCheck = () => {
    let body = {
        displayName: name
    }
    axios.post('/api/user/nameCheck', body).then((res) => {
        if (res.data.success) {
            if (res.data.check) {
                setNameCheck(true);
                setDuplicate('You can use this name.');
            } else {
                setDuplicate('You cannot use this name.');
            }
        }
    });
  }

  const validate = (name, nameCheck, email, password, confirmPassword) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!name) {
        errors.name = 'Name is required.';
    } if (!nameCheck) {
        errors.nameCheck = 'Duplicate check is required.';
    } if (!email) {
        errors.email = 'Email is required.';
    } else if (!regex.test(email)) {
        errors.email = 'This email is not valid.'
    } else if (emailCheck) {
        errors.email = 'This email is already in use.'
    } if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 6) {
        errors.password = 'Password must be longer than 6 characters.'
    } if (!confirmPassword) {
        errors.confirmPassword = 'Confirm password is required.';
    }
    return errors;
  }

  const validateEmail = () => {
    let body = {
        email: email,
    };
    axios.post('/api/user/emailCheck', body).then((res) => {
        if (res.data.success) {
            setEmailCheck(true);
        }
    });
  }

  return (
    <div className={RegisterCss.wrapper}>
        <div className={RegisterCss.name}>
            <div>
                <label>Name</label>
            </div>
            <div>
                <input className={RegisterCss.input} type='text' value={name} disabled={nameCheck} onChange={(e) => {setName(e.currentTarget.value)}} />
            </div>
        </div>
        {error.name ? 
        <div className={RegisterCss.error}>{error.name}</div> :
        <div className={RegisterCss.error}>{duplicate}</div>}
        <div>
            <button className={RegisterCss.nameCheck} disabled={!name} onClick={() => {duplicateCheck()}}>Duplicate Check</button>
        </div>
        <div className={RegisterCss.email}>
            <div>
                <label>Email</label>
            </div>
            <div>
                <input className={RegisterCss.input} type='email' value={email} onChange={(e) => {setEmail(e.currentTarget.value)}} />
            </div>
        </div>
        <div className={RegisterCss.error}>
            {error.email}
        </div>
        <div className={RegisterCss.password}>
            <div>
                <label>Password</label>
            </div>
            <div>
                <input className={RegisterCss.input} type='password' value={password} minLength={6} onChange={(e) => {setPassword(e.currentTarget.value)}} />
            </div>
        </div>
        <div className={RegisterCss.error}>
            {error.password}
        </div>
        <div className={RegisterCss.confirmPassword}>
            <div>
                <label>Confirm Password</label>
            </div>
            <div>
                <input className={RegisterCss.input} type='password' value={confirmPassword} minLength={6} onChange={(e) => {setConfirmPassword(e.currentTarget.value)}} />
            </div>
        </div>
        <div className={RegisterCss.error}>
            {error.confirmPassword}
        </div>
        <div>
            <button className={RegisterCss.register} onClick={() => {register()}}>Register</button>
        </div>
    </div>
  );
}

export default Register;