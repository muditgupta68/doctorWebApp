import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import moment  from 'moment';
import {
  Col,
  Form,
  Input,
  Row,
  TimePicker,
  Select,
  InputNumber,
} from "antd";
const { Option } = Select;


const ApplyDoctor = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleFinish = async(values) => {
    try {
        dispatch(showLoading());
        let timings = []
        // console.log(values);
        values?.timings.map((val)=>{
          timings.push(moment(val.$d).format('HH:mm'));
        })
        values.timings = timings;
        const res = await axios.post('/api/v1/user/doctorApplication',{...values});
        dispatch(hideLoading());
        if (res.data.status){
            alert(res.data.msg);
            navigate("/");
        }
        else {
            alert("Failed! Network:404");
          }
    } catch (error) {
      console.log(error);
      alert(error);
      dispatch(hideLoading());
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Layout>
        <h1 className="text-center text-capitalize">apply doctor</h1>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{ prefix: "91" }}
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
            <button  type="submit" className="btn btn-primary d-flex justify-content-center m-auto p-3 w-50">
              Submit
            </button>
        </Form>
      </Layout>
    </>
  );
};

export default ApplyDoctor;
