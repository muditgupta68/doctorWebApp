import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const handleStatusDoctor = async (docId, status) => {
    try {
      dispatch(showLoading());
      const resp = await axios.post("/api/v1/admin/changeAccountStatus", {
        docId,
        status,
      });

      if (resp.data.status) {
        alert(resp.data.msg);
        let newDoctors = doctors.filter((dc)=>{
            return dc._id !== docId;
        })
        newDoctors.push(resp.data.doctor);
        setDoctors(newDoctors);
        dispatch(hideLoading());
      }
    } catch (error) {
        alert(error);
        dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleStatusDoctor(record?._id, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="btn btn-danger"
            onClick={() => handleStatusDoctor(record?._id, "pending")}
            >Reject</button>
          )}
        </div>
      ),
    },
  ];

  const getDoctors = async () => {
    try {
      const resp = await axios.get("/api/v1/admin/doctors");
      if (resp.data.status) {
        console.log(resp.data.doctors);
        setDoctors(resp.data.doctors);
      } else {
        alert("Request failed!");
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-center text-capitalize mb-4">All Doctors</h1>
        <Table columns={columns} dataSource={doctors} />
      </div>
    </Layout>
  );
};

export default AllDoctors;
