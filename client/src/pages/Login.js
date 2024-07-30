import React, { useEffect, useState } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import {useAppContext} from '../context/appContext';
import { useNavigate } from "react-router-dom";

const initialState = {
  loginIdentifier: '',
  password: '',
}

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const {user, isLoading, showAlert, displayAlert,registerUser,loginUser} = useAppContext()

  const handelChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const {loginIdentifier, password} = values;
    
    if(!loginIdentifier || !password){
      displayAlert();
      return
    }
    const currentUser = {loginIdentifier, password};
    loginUser(currentUser);
  }

  useEffect(()=>{
    if(user){
      setTimeout(()=>{
        navigate('/')
      }, 3000)
    }
  }, [user, navigate])


  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>Login</h3>
        {showAlert && <Alert/>}
        <FormRow name='loginIdentifier' labelText='Email or password' value={values.loginIdentifier} handelChange={handelChange} />
        <FormRow name='password' type='password' labelText='Password' value={values.password} handelChange={handelChange} />
        <button type='submit' className='btn btn-block'>Submit</button>
        <p>
        </p>
      </form>
    </Wrapper>
  )
}

export default Login
