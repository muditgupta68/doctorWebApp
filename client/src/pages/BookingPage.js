import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./../components/Layout";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.users);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSingleDoctorsData = async () => {
    try {
      const id = params.id;
      const resp = await axios.get(`/api/v1/user/singleData/${id}`);
      if (resp.data.status) {
        setDoctors(resp.data.doctor);
      } else {
        alert("route error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleDoctorsData();
  }, []);

  const handleBooking = async () => {
    try {
      dispatch(showLoading());
      const docId = params.id;
      const resp = await axios.post(`/api/v1/user/appointment/new`, {
        doctorId: docId,
        userId: user._id,
        doctorInfo: doctors,
        userInfo: user,
        date,
        time,
      });
      console.log(resp);
      if (resp.data.status) {
        dispatch(hideLoading());
        alert(resp.data.msg);
        setIsAvailable(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const docId = params.id;
      const resp = await axios.post("/api/v1/user/bookAvailability/check", {
        docId,
        time,
        date,
      });
      if (resp.data.status) {
        alert(resp.data.msg);
        setIsAvailable(resp.data.available);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.consultationFees}</h4>
            <h4>
              Timings : {doctors.timings && moment(doctors.timings[0]).format('HH:mm')} -{" "}
              {doctors.timings && moment(doctors.timings[1]).format('HH:mm')}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // console.log(value.$d)
                  // console.log(moment(value.$d).format("DD-MM-YYYY"))
                  setDate(moment(value?.$d).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                aria-required={"true"}
                format="HH:mm"
                className="mt-3"
                onChange={(value) => {
                  setTime(moment(value?.$d).format("HH:mm"));
                }}
              />

              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {isAvailable && (
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                  Book Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
