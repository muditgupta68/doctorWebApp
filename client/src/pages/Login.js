import React from 'react'
import { useFormik } from "formik";
import { loginSchema } from "./formSchema/index";
import "./styles/register.css"
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async(values)=>{
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/login',values)
      dispatch(hideLoading());
      if(res.data.status){
        alert("Login Successfully");
        navigate("/");
      }
      else{
        alert("Login Fail");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      alert("Login Fail");
    }
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values, action) => {
        onfinishHandler(values);
        action.resetForm();
      },
    });

  return (
    <>
        <div className="form-container p-4 w-100">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
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

          <Link to={"/register"}><p>Register</p></Link>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default Login