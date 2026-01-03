import React from 'react'
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:9999/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await response.text();
    alert(result);
  };
  return (
    <div>
      <div classNameName="App">
      <div className="auth-card">
      <h2 className="auth-title">College Login</h2>
      

      <form id="loginForm">
        <div className="form-group">
          <label>Username</label>
          <input type="text" id="username" required placeholder="abc123" />
          <div className="error" id="usernameError"></div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            id="password"
            required
            minlength="6"
            placeholder="********"
          />
          <div className="error" id="passwordError"></div>
        </div>

        <div className="forgot-password">
            <a href="#">Forgot Password?</a>
        </div>

        <button type="submit">Login</button>
      </form>

      
    </div>
    </div>
    </div>
  )
}

export default Login
