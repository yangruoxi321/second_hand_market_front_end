import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import { message, Card, Avatar, Row, Col, Typography, Modal } from "antd";
import 'antd/dist/antd.css';
import { Rate } from 'antd';

const { Title, Text } = Typography;

function Profile() {
    const [profile, setProfile] = useState(null);
    const [boughtItems, setBoughtItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchBoughtItem();
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

    const fetchBoughtItem = (formData) => {
        axios.post(`${BASE_URL}/purchasedItem`, formData, {
            headers: {
                'token': `${localStorage.getItem(TOKEN_KEY)}`,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setBoughtItems(res.data);
                }
            })
            .catch(err => {
                message.error("Unable to load bought items");
                console.log("Fetch error: ", err.message);
            });
    };

    const showItemDetails = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                    <Col span={16}>
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

            <div style={{ marginTop: "24px" }}>
                <Title level={3}>Bought Items</Title>
                <Row gutter={[16, 16]}>
                    {boughtItems.map(item => (
                        <Col
                            key={item.id}
                            xs={24} sm={12} md={8} lg={6}
                            onClick={() => showItemDetails(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card
                                hoverable
                                cover={
                                    <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={item.url}
                                            alt={item.itemName}
                                            style={{
                                                maxHeight: '100%',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                objectPosition: 'center'
                                            }}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title={item.itemName || 'No Name'}
                                    description={`Price: $${item.price}`}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Modal
                title="Item Details"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {selectedItem && (
                    <div>
                        <img
                            src={selectedItem.url}
                            alt={selectedItem.itemName}
                            style={{
                                maxHeight: '450px',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                marginBottom: '20px',
                            }}
                        />
                        <p>Item Name: {selectedItem.itemName}</p>
                        <p>Description: {selectedItem.itemDescription}</p>
                        <p>Price: ${selectedItem.price}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Profile;