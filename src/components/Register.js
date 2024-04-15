import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "../styles/App.css"

import { BASE_URL } from "../constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 16,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { email, userName, password } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/signup`,
      data: {
        email: email,
        userName: userName,
        password: password,
      },
      headers: { "content-type": "application/json" },
    };

    axios(opt)
      .then((response) => {
        console.log(response);
        // case1: registered success
        if (response.status === 201) {
          message.success("Registration succeed!");
          props.history.push("/login");
        }
      })
      .catch((error) => {
        console.log("register failed: ", error.message);
        message.error(error.message);
        // throw new Error('Signup Failed!')
      });
  };

  return (
      <div className="register-container">
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            className="register"
        >

          <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="userName"
              label="userName"
              rules={[
                {
                  required: true,
                  message: "Please input your userName!",
                },
              ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                        "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" className="register-btn">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>

  );
}

export default Register;
