import React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const PublicRoute = ({children}) => {
  const Cookie = Cookies.get("token");
  if(!Cookie){
    return children;
  }
  else{
    return <Navigate to="/"/>;
  }
};

export default PublicRoute;
