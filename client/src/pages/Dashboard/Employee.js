import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { Alert, FormRow, FormRowSelect } from "../../components";

const initialEmployeeState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "employee",
};

function AddEmployee() {
  const [values, setValues] = useState(initialEmployeeState);
  const {
    showAlert,
    isLoading,
    displayAlert,
    role, 
    registerEmployee,
    getEmployee
  } = useAppContext();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.fullName || !values.email || !values.phone || !values.password) {
      displayAlert();
      return;
    }
    registerEmployee(values);
    setValues(initialEmployeeState);
  };

  const handleChange = (e) => {
    setValues({ ...values, [ e.target.name ]: e.target.value });
  };

  const clearData = () => {
    setValues(initialEmployeeState);
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>Add Employee</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='fullName'
            value={values.fullName}
            handelChange={handleChange}
          />
          <FormRow
            type='email'
            name='email'
            value={values.email}
            handelChange={handleChange}
          />
          <FormRow
            type='text'
            labelText='Phone'
            name='phone'
            value={values.phone}
            handelChange={handleChange}
          />
          <FormRow
            type='password'
            labelText='Password'
            name='password'
            value={values.password}
            handelChange={handleChange}
          />
          <FormRowSelect
            name='role'
            value={values.role}
            labelText='Role'
            handelChange={handleChange}
            list={role}
          />
          <div className='btn-container'>
            <button
              className='btn btn-block submit-btn'
              type='submit'
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              className='btn btn-block clear-btn'
              type='button'
              onClick={clearData}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
    
  );
}

export default AddEmployee;
