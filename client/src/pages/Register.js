import React from "react";
import { useFormik } from "formik";
import { signUpSchema } from "./formSchema/index";
import "./styles/register.css"
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        onfinishHandler(values);
        action.resetForm();
      },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    
const onfinishHandler = async(values)=>{
  try {
    dispatch(showLoading());
    const res = await axios.post('/api/v1/user/register',values)
    dispatch(hideLoading());
    if(res.data.status){
      alert("Register Successfully");
      navigate("/login");
    }
    else{
      alert(res.data.message);
    }
  } catch (error) {
    dispatch(hideLoading());
    console.log(error);
    alert("Register Fail");
  }
}



  return (
    <>
      <div className="form-container p-4 w-100">
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              UserName
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name ? (
              <p className="form-error">{errors.name}</p>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className="form-error">{errors.email}</p>
            ) : null}
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className="form-error">{errors.password}</p>
            ) : null}
          </div>

          <Link to={"/login"}><p>Already Logged In?</p></Link>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
