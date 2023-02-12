import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor Status",
      dataIndex: "doctor",
      render: (text, record) => (
        <div>{record.doctor === true ? <p>Yes</p> : <p>No</p>}</div>
      ),
    },
    {
      title: "Member Status",
      dataIndex: "admin",
      render: (text, record) => (
        <div>{record.admin === true ? <p>Admin</p> : <p>Member</p>}</div>
      ),
    },
  ];

  const getUsers = async () => {
    try {
      const resp = await axios.get("/api/v1/admin/users");
      if (resp.data.status) {
        console.log(resp.data.users);
        setUsers(resp.data.users);
      } else {
        alert("Request failed!");
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-center text-capitalize mb-4">All users</h1>
        <Table columns={columns} dataSource={users} />
      </div>
    </Layout>
  );
};

export default AllUsers;
