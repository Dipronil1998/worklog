import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  LOGIN_USER_SUCCESS,
  TOGGLE_SIDEBAR,
  SETUP_EMPLOYEE_SUCCESS,
  SETUP_EMPLOYEE_EXISTS,
  GET_EMPLOYEE_BEGIN,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_ERROR,
} from "./Action";
import { initialState } from "./appContext";

const Reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertText: "Please provide all values",
      alertType: "danger",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertText: "",
      alertType: "",
    };
  }
  if (action.type === SETUP_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "User create successfully. Redirecting........",
      user: action.payload.user,
      // token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
    };
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.error,
    };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "User login successfully. Redirecting.........",
      userLoading: false,
      user: action.payload.user,
      token: action.payload.token
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === SETUP_EMPLOYEE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: action.payload.message,
    };
  }
  if (action.type === SETUP_EMPLOYEE_EXISTS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.message,
    };
  }

  if (action.type === GET_EMPLOYEE_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  
  if (action.type === GET_EMPLOYEE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      employeesInfo: action.payload.employeesInfo
    };
  }
  if (action.type === GET_EMPLOYEE_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.error,
    };
  }
  
  return new Error(`no search action ${action.type}`);
};

export default Reducer;
