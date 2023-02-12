import React, { useState } from "react";
import Layout from "./../components/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Radio } from "antd";
import axios from "axios";
import NotificationTable from "../components/NotificationTable";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
const { TabPane } = Tabs;

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const [mode, setMode] = useState("top");
  const handleModeChange = (e) => {
    setMode(e.target.value);
  };
  

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const resp = await axios.post("/api/v1/user/clear-Unseen-message");
      console.log(resp)
      if (resp.data.status) {
        alert(resp.data.msg);
        dispatch(setUser(resp.data.user));
      } else {
        alert("Marking to seen: FAILED!!");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      alert(error);
    }
  };
  const handleDeleteAllRead = async() => {
    try {
      dispatch(showLoading());
      const resp = await axios.post("/api/v1/user/clear-seen-message");
      console.log(resp)
      if (resp.data.status) {
        alert(resp.data.msg);
        dispatch(setUser(resp.data.user));
      } else {
        alert("Clear Messages: FAILED!!");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      alert(error);
    }
  };

  return (
    <>
      <Layout>
        <h1 className="text-center text-capitalize">Notification Page</h1>
        <hr />
        <div className="tabularStructure p-4">
          <Radio.Group
            onChange={handleModeChange}
            value={mode}
            style={{
              marginBottom: 8,
            }}
          >
            <Radio.Button value="top">Horizontal</Radio.Button>
            <Radio.Button value="left">Vertical</Radio.Button>
          </Radio.Group>

          <Tabs
            defaultActiveKey="1"
            tabPosition={mode}
            style={{
              height: 220,
            }}
          >
            <TabPane tab="Unread" key="1">
              <NotificationTable
                handleMethod={handleMarkAllRead}
                target={user ? user?.notification : []}
                actionBtn="Mark as Read"
                BtnType=""
              />
            </TabPane>
            <TabPane tab="Read" key="2">
              <NotificationTable
                handleMethod={handleDeleteAllRead}
                target={user ? user?.seenNotification : []}
                actionBtn="Clear Inbox"
                BtnType="danger"
              />
            </TabPane>
          </Tabs>
        </div>
      </Layout>
    </>
  );
};

export default NotificationPage;
