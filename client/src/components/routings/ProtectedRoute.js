import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../../redux/features/userSlice";

const ProtectedRoute = ({ children }) => {
  const Cookie = Cookies.get("token");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getUser = async () => {
    if (Cookie) {
      try {
        dispatch(showLoading());
        const resp = await axios.get("/api/v1/user");
        // console.log(resp);
        if (resp) {
          dispatch(setUser(resp.data.user));
          // alert(resp.data.msg);
        }
        dispatch(hideLoading());
      } catch (error) {
        console.log(error);
        alert(error);
        dispatch(hideLoading());
      }
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  if (Cookie) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
