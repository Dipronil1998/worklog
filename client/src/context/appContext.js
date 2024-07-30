import React, { useState, useReducer, useContext, useEffect } from "react";
import axios from 'axios';
import Reducer from "./Reducer";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  LOGIN_USER_SUCCESS,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  SETUP_EMPLOYEE_SUCCESS,
  SETUP_EMPLOYEE_EXISTS,
  GET_EMPLOYEE_BEGIN,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_ERROR
} from './Action'

const user = localStorage?.getItem('user');
const token = localStorage?.getItem('token');

const initialState = {
  // user: user ? JSON.parse(user) : null,
  user: JSON.parse(user),
  token: token,
  isLoading: false,
  showAlert: false,
  alertType: '',
  alertText: '',
  role: ["manager", "team_lead", "employee"],
  employeesInfo:[],
}

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`;



  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 3000)
  }

  const addUserToLocalStorage = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }




  const loginUser = async (currentUser) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const response = await axios.post('/api/auth/login', currentUser);
      if (response?.data?.statusCode === 200) {
        if (response?.data?.response?.role !== 'employee') {
          dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: {
              user: response.data.response,
              token: response.data.token,
            }
          });
          addUserToLocalStorage(response.data.response, response.data.token);
        } else {
          dispatch({
            type: SETUP_USER_ERROR,
            payload: {
              error: 'You donot have access to login.'
            }
          });
          clearAlert();
        }
      } else {
        dispatch({
          type: SETUP_USER_ERROR,
          payload: {
            error: response.data.message
          }
        });
        clearAlert();
      }

    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: {
          error: error.response.data.msg
        }
      });
      clearAlert();
    }
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = async () => {
    dispatch({ type: LOGOUT_USER })
    removeUserFromLocalStorage();
  }

  const registerEmployee = async (currentUser) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post('/api/auth/employee', currentUser, config);
      if (response?.data?.statusCode === 201) {
        dispatch({
          type: SETUP_EMPLOYEE_SUCCESS,
          payload: {
            message: response?.data?.message
          }
        });
        clearAlert();
      }
      if (response?.data?.statusCode === 400 || response?.data?.statusCode === 401 || response?.data?.statusCode === 403 ||response?.data?.statusCode >= 500) {
        dispatch({
          type: SETUP_EMPLOYEE_EXISTS,
          payload: {
            error: response?.data?.message
          }
        });
        clearAlert();
      }

    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: {
          error: error.response.data.msg
        }
      });
      clearAlert();
    }
  }

  const getEmployee = async ()=>{
    dispatch({ type: GET_EMPLOYEE_BEGIN });
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('/api/auth/employee', config);
      if (response?.data?.statusCode === 200) {
        dispatch({
          type: GET_EMPLOYEE_SUCCESS,
          payload: {
            employeesInfo: response?.data?.response
          }
        });
      }

    } catch (error) {
      dispatch({
        type: GET_EMPLOYEE_ERROR,
        payload: {
          error: error.response.data.msg
        }
      });
      clearAlert();
    }
  }


  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        loginUser,
        toggleSidebar,
        logoutUser,
        registerEmployee,
        getEmployee
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }