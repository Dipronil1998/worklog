import React, { useEffect } from "react";
import Wrapper from '../../assets/wrappers/StatsContainer';
import { Loading, AdminStatsContainer } from "../../components";
import { useAppContext } from "../../context/appContext";

function Admin() {
  const { adminShowStats, isLoading } = useAppContext();
  useEffect(() => {
    adminShowStats();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }
  return <>
    <AdminStatsContainer/>
  </>;
}

export default Admin;
