import React from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.svg";

function TopBar(props) {
    const { isLoggedIn, handleLogout } = props;

    return (
        <header className="App-header">
            <div className="logo-container">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">Market</span>
            </div>
            <div className="button-container">
                {isLoggedIn ? (
                    <Space>
                        <Button type="primary" icon={<UserOutlined />}>
                            <Link to="/profile">Profile</Link>
                        </Button>
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button type="primary">
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button type="primary">
                            <Link to="/register">Register</Link>
                        </Button>
                    </Space>
                )}
            </div>
        </header>
    );
}

export default TopBar;