import React from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.svg";
import styled from "styled-components";

const Header = styled.header`
    background-color: #282c34;
    min-height: 60px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0 20px;
    font-size: calc(10px + 2vmin);
    color: white;
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled.img`
    height: 40px;
    pointer-events: none;
    margin-right: 10px;
`;

const Title = styled.span`
    font-size: 24px;
    font-weight: bold;
`;

const ButtonContainer = styled.div`
    justify-self: end;
`;

function TopBar(props) {
    const { isLoggedIn, handleLogout } = props;
    return (
        <Header>
            <LogoContainer>
                <Logo src={logo} alt="logo" />
                <Title>Market</Title>
            </LogoContainer>
            {isLoggedIn && (
                <ButtonContainer>
                    <Space>
                        <Button type="primary" icon={<UserOutlined />}>
                            <Link to="/profile" style={{ color: "#fff" }}>
                                Profile
                            </Link>
                        </Button>
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Space>
                </ButtonContainer>
            )}
        </Header>
    );
}

export default TopBar;