import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminMenu, userMenu } from "./../data/menu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUserNull } from "../redux/features/userSlice";
import { Badge } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // if doctor: YES: MENU
  const doctorMenu = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      id: 2,
      name: "Appointments",
      path: `/book-appointment`,
      icon: "fa-solid fa-list",
    },
    {
      id: 3,
      name: "Profile",
      path: `/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  const sideMenu = user?.admin
    ? adminMenu
    : user?.doctor
    ? doctorMenu
    : userMenu;

  const handleLogout = async () => {
    try {
      dispatch(showLoading());
      await axios.get("/api/v1/user/logout");
      alert("logged out success");
      dispatch(setUserNull());
      dispatch(hideLoading());
      navigate("/login");
    } catch (error) {
      dispatch(hideLoading());
      alert(error);
      console.log(error);
    }
  };

  const location = useLocation();

  return (
    <>
      <div className="layout d-flex vh-100">
        <div className="left">
          <div className="logo">Doctor App</div>
          <div className="menu">
            {sideMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div key={menu.id}>
                  <div className={`menu__link ${isActive && "active"}`}>
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                </div>
              );
            })}
            <div className={`menu__link`} onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
        <div className="right h-100 w-100">
          <div className="header mb-3">
            <Badge
              count={user && user.notification.length}
              onClick={() => {
                navigate("/notification");
              }}
            >
              <i className="fa-solid fa-bell" role="button"></i>
            </Badge>
            <Link to="/profile">{user?.name}</Link>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
