import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    {console.log(e);}
    try {
      const response = await axios.post(
        "/api/v1/users/createuser",
        formData
      );
      console.log("POST Response:", response);
      setData(response.data); 
      navigate('/Dashbord')
    } catch (error) {
      console.error("POST Error:", error);
    }
  };
  return (
    <div>
      <Header />
      <div className="container">
        <div className="from">
          <form onSubmit={handleSubmit}>
            <h4 className="text-center mb-4">Register your account</h4>
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData?.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData?.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign in
            </button>
          </form>
          <div className="new-account mt-3">
            <p>
              Don't have an account?
              <a className="text-primary" href="">
                <Link to="/">Sing UP</Link>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
