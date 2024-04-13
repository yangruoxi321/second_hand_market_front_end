import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import { message, Card, Avatar, Row, Col, Typography } from "antd";
import 'antd/dist/antd.css';
import { Rate } from 'antd';

const { Title, Text } = Typography;

function Profile() {
    const [profile, setProfile] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = (formData) => {
        axios
            .post(`${BASE_URL}/profile`, formData, {
                headers: {
                    token: `${localStorage.getItem(TOKEN_KEY)}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setProfile(res.data);
                }
            })
            .catch((err) => {
                message.error("Unable to load profile");
                console.log("Fetch error: ", err.message);
            });
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "24px" }}>
            <Card>
                <Row>
                    <Col span={8}>
                        <Avatar size={120} src={profile.avatarUrl} />
                    </Col>
                    <Col span={8} pull={2}>
                        <Title level={2} style={{ textAlign: "left" }}>{profile.userName}</Title>
                        <div style={{ textAlign: "left" }}>
                            <Text style={{ fontSize: "18px" }}>Email: {profile.email}</Text>
                            <br />
                            <Text style={{ fontSize: "18px" }}>Wallet: ${profile.wallet}</Text>
                            <br />
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Text style={{ fontSize: "18px" }}>
                                    Seller Rate: &nbsp;
                                </Text>
                                <Rate allowHalf disabled defaultValue={profile.sellerRate} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default Profile;