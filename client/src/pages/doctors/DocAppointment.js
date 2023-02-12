import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import Layout from './../../components/Layout';

const DocAppointment = () => {

    const [appointments, setAppointments] = useState([]);

    const getAppointments = async()=>{
        try {
            const resp = await axios.get('/api/v1/user/doctor/appointment/data');
            if(resp.data.status){
                setAppointments(resp.data.appointments);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAppointments();
      }, []);

      const handleStatus = async (record, status) => {
        try {
            console.log(record)
          const res = await axios.post(
            "/api/v1/user/doctor/appointment/data",{appointmentsId:record._id,status});
          if (res.data.status) {
            alert(res.data.msg);
            getAppointments();
          }
        } catch (error) {
          console.log(error);
          alert("Something Went Wrong");
        }
      };

      const columns = [
        {
          title: "ID",
          dataIndex: "_id",
        },
        {
          title: "Date & Time",
          dataIndex: "date",
          render: (text, record) => (
            <span>
              {moment(record.date).format("DD-MM-YYYY")} &nbsp;
              {moment(record.time).format("HH:mm")}
            </span>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
        },
        {
          title: "Actions",
          dataIndex: "actions",
          render: (text, record) => (
            <div className="d-flex">
              {record.status === "pending" && (
                <div className="d-flex">
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatus(record, "approved")}
                  >
                    Approved
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleStatus(record, "reject")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ),
        },
      ];

  return (
    <Layout>
        <h1 className="text-center text-capitalize">Appointments</h1>
        {appointments && (
            <Table columns={columns} dataSource={appointments} />
        )}
    </Layout>
  )
}

export default DocAppointment