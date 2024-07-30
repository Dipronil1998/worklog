import React, { useState } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { Alert, FormRow } from "../../components";

function Profile() {
  const { user, isLoading, showAlert, displayAlert, updateUser} = useAppContext();
  const [name, setName] = useState(user?.name);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [location, setLocation] = useState(user?.location);

  const handelSubmit = (e) => {
    e.preventDefault();
    if(!name || !lastName || !email || !location){
      displayAlert();
      return
    }
    updateUser({ name, email, lastName, location });
  }
  return <Wrapper>
    <form className="form" onSubmit={handelSubmit}>
      <h3>Profile</h3>
      {showAlert && <Alert />}
      <div className="form-center">
        <FormRow type="text" name="name" value={name} handelChange={(e)=> setName(e.target.value)} labelText=""/>
        <FormRow type="text" name="lastName" value={lastName} handelChange={(e)=> setLastName(e.target.value)} labelText="Last Name"/>
        <FormRow type="email" name="email" value={email} handelChange={(e)=> setEmail(e.target.value)} labelText="Email" disabled={true}/>
        <FormRow type="text" name="location" value={location} handelChange={(e)=> setLocation(e.target.value)} labelText="Location"/>
        <button className="btn btn-block" disabled={isLoading}>{isLoading ? 'please wait...' : 'save'}</button>
      </div>
    </form>
  </Wrapper>;
}

export default Profile;
