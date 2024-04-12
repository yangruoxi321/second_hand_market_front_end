import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../constants";

function Login(props) {
  const { handleLoggedIn } = props;

  const onFinish = (values) => {
    const { email, password } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/email_login`,
      data: {
          email: email,
          password: password,
      },
      headers: { "Content-Type": "application/json" },
    };
    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res;
            const { token } = res.data; // Access the token here
            localStorage.setItem('token', token); // Save the token to localStorage
            handleLoggedIn(token); // Pass the token up to handleLoggedIn
          message.success("Login succeed! ");
        }
      })
      .catch((err) => {
        console.log("login failed: ", err.message);
        message.error("Login failed!");
      });
  };

  return (
    <Form name="normal_login" className="login-form" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/register">register now!</Link>
      </Form.Item>
    </Form>
  );
}

export default Login;
