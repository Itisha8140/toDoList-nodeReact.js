import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/api/v1/users/loginUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);  
        const expirationTime = new Date().getTime() + 3600000; 
        localStorage.setItem("tokenExpiration", expirationTime);
        navigate("/Dashbord");
        // alert.success("Login successful");
        console.log("Login successful!", token);
      })
      .catch((error) => { 
        console.error("Login failed!");
      });
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="from">
          <form onSubmit={handleSubmit}>
            <h4 className="text-center mb-4">Sign in your account</h4>
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                id="email"
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
                name="password"
                id="password"
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
                <Link to="/Register">Sing in</Link>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
