import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Col, Form, Input, Row, TimePicker, Select, InputNumber } from "antd";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
const { Option } = Select;

const Profile = () => {
  const [doctor, setDoctor] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const timings = [
          moment(values.timings[0]?.$d).format("HH:mm"),
          moment(values.timings[1]?.$d).format("HH:mm"),
        ];

      values.timings =  timings;

      console.log(values);
        
      // const res = await axios.patch("/api/v1/user", {
      //   ...values,
      //   userId: params.id,
      //   timings,
      // });
      // console.log(res);
      // dispatch(hideLoading());
      // if (res.data.status) {
      //   alert(res.data.msg);
      //   navigate("/");
      // } else {
      //   alert("Failed! Network:404");
      // }
    } catch (error) {
      console.log(error);
      alert(error);
      dispatch(hideLoading());
    }
  };

  const getDoctorData = async () => {
    try {
      const Id = params.id;
      const resp = await axios.get(`/api/v1/user/doctor/${Id}`);
      if (resp.data.status) {
        const { doctor } = resp.data;
        let {phone} = doctor;
        const newPhone = phone.split('-')[1];

        const time1 = moment(doctor?.timings[0],"HH:mm")
        const time2 = moment(doctor?.timings[1],"HH:mm")

        const finalTime1 = moment(time1._i).format("HH:mm")

        setDoctor({
          ...doctor,
          timings: [
            moment(doctor?.timings[0],"HH:mm"),
            moment(doctor?.timings[1],"HH:mm")],
          phone:newPhone
        });

        // console.log(doctor)

        // console.log(time1._i)
        // console.log(moment(time1._i).format("HH:mm"))
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

//   console.log(doctor);

  return (
    <Layout>
      <h1 className="text-center text-capitalize">Profile</h1>
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            prefix: "91",
            ...doctor,
          }}
        >
          <h4 className="">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="address"
                label="Residence"
                rules={[
                  { required: true, message: "Please enter your residence!" },
                ]}
              >
                <Input type="text" placeholder="your residence" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  max: 10,
                  message: "Phone Number can not be more than 10-digits.",
                },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder="select your gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <h4>Professional Details :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: "100%" }}
                  placeholder="your experience"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultations"
                name="consultationFees"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="fees per consultation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Timings" name="timings" required>
                <TimePicker.RangePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Achievements" name="achievements">
                <Input.TextArea showCount maxLength={1000} />
              </Form.Item>
            </Col>
          </Row>
          <button
            type="submit"
            className="btn btn-warning d-flex justify-content-center m-auto p-3 w-50 text-capitalize"
          >
            update
          </button>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
