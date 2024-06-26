import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/App.css"
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
                    const { token } = res.data; // Access the token here
                    localStorage.setItem('token', token); // Save the token to localStorage
                    handleLoggedIn(token); // Pass the token up to handleLoggedIn
                    message.success("Login succeed!");
                }
            })
            .catch((error) => {
                if (error.response) {
                    // 处理错误响应
                    console.log("Login failed: ", error.response.data.message);
                    message.error("Login failed: " + error.response.data.message);
                } else {
                    // 处理其他错误
                    console.log("Login failed: ", error.message);
                    message.error("Login failed!");
                }
            });
    };

  return (
      <div className="login-container">
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
      </div>
  );
}

export default Login;
