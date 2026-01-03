import React from 'react'
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:9999/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

     if (!response.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await response.json();
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);

    if (data.role === "Admin") {
      window.location.href = "http://localhost:5173";
    } else if (data.role === "Faculty") {
      window.location.href = "http://localhost:5174";
    } else if (data.role === "Staff") {
      window.location.href = "http://localhost:5175";
    }
  };
  return (
    <div>
      <div className="App">
      <div className="auth-card">
      <h2 className="auth-title">College Login</h2>
      

      <form id="loginForm">
        <div className="form-group">
          <label>Username</label>
          <input type="text" id="username" required placeholder="abc123" value={username}
        onChange={(e) => setUsername(e.target.value)}/>
          <div className="error" id="usernameError"></div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            id="password"
            required
            minLength="6"
            placeholder="********"
            value={password}
        onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error" id="passwordError"></div>
        </div>

        <div className="forgot-password">
            <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" onClick={loginUser}>Login</button>
      </form>

      
    </div>
    </div>
    </div>
  )
}

export default Login
