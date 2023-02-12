import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Row } from "antd";
import DoctorCard from "../components/DoctorCard";
import moment  from 'moment';

const Home = () => {
  const [doctors, setDoctors] = useState([]);

  const getApprovedDoctors = async () => {
    try {
      const resp = await axios.post("/api/v1/user/approvedDoc");
      console.log(resp.data.doctor)
      if (resp.data.status) {
        setDoctors(resp.data.doctor);
      } else {
        alert(resp.data.error);
      }
    } catch (error) {
      console.log(error)
      alert('Internal server error')
    }
  };

  useEffect(() => {
    getApprovedDoctors();
  }, []);

  return (
    <>
      <Layout>
        <h1 className="text-center text-capitalize">Homepage</h1>
        <Row>
          {doctors &&
            doctors?.map((doctor) => (
              <DoctorCard doctor={doctor} key={doctor._id} />
            ))}
        </Row>
      </Layout>
    </>
  );
};

export default Home;
