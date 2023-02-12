import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import Layout from './../components/Layout';

const Appointment = () => {

    const [appointments, setAppointments] = useState([]);

    const getAppointments = async()=>{
        try {
            const resp = await axios.get('/api/v1/user/appointment');
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
    ]

  return (
    <Layout>
        <h1 className="text-center text-capitalize">Appointments</h1>
        {appointments && (
            <>
            <Table columns={columns} dataSource={appointments} />
            </>
        )}
    </Layout>
  )
}

export default Appointment