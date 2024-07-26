import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import {
    message, Card, Avatar, Row, Col, Typography, Modal, Spin, Statistic,
    Tabs, List, Tag, Tooltip, Button
} from "antd";
import {
    ShoppingOutlined, DollarOutlined, StarOutlined,
    MailOutlined, UserOutlined, WalletOutlined
} from "@ant-design/icons";
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProfileContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const ProfileCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StatsCard = styled(Card)`
  border-radius: 15px;
  margin-top: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ItemCard = styled(Card)`
  border-radius: 10px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

function Profile() {
    const [profile, setProfile] = useState(null);
    const [boughtItems, setBoughtItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchBoughtItem();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/profile`, {}, {
                headers: { token: localStorage.getItem(TOKEN_KEY) },
            });
            setProfile(res.data);
        } catch (err) {
            message.error("Unable to load profile");
            console.log("Fetch error: ", err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBoughtItem = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/purchasedItem`, {}, {
                headers: { token: localStorage.getItem(TOKEN_KEY) },
            });
            setBoughtItems(res.data);
        } catch (err) {
            message.error("Unable to load bought items");
            console.log("Fetch error: ", err.message);
        }
    };

    const showItemDetails = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    if (loading) {
        return (
            <ProfileContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </ProfileContainer>
        );
    }

    return (
        <ProfileContainer>
            <ProfileCard>
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Avatar size={150} src={profile.avatarUrl} icon={<UserOutlined />} />
                    </Col>
                    <Col xs={24} sm={16} md={18}>
                        <Title level={2}>{profile.userName}</Title>
                        <Paragraph>
                            <MailOutlined /> {profile.email}
                        </Paragraph>
                        <Paragraph>
                            <WalletOutlined /> Wallet: ${profile.wallet}
                        </Paragraph>
                        <Paragraph>
                            <StarOutlined /> Seller Rating: {profile.sellerRate.toFixed(1)}
                        </Paragraph>
                    </Col>
                </Row>
            </ProfileCard>

            <StatsCard>
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic
                            title="Items Bought"
                            value={boughtItems.length}
                            prefix={<ShoppingOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Total Spent"
                            value={boughtItems.reduce((acc, item) => acc + item.price, 0)}
                            prefix={<DollarOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Seller Rating"
                            value={profile.sellerRate}
                            prefix={<StarOutlined />}
                        />
                    </Col>
                </Row>
            </StatsCard>

            <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
                <TabPane tab="Bought Items" key="1">
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 6,
                        }}
                        dataSource={boughtItems}
                        renderItem={item => (
                            <List.Item>
                                <ItemCard
                                    hoverable
                                    cover={
                                        <img
                                            alt={item.itemName}
                                            src={item.url}
                                            style={{ height: 200, objectFit: 'cover' }}
                                        />
                                    }
                                    onClick={() => showItemDetails(item)}
                                >
                                    <Card.Meta
                                        title={item.itemName}
                                        description={
                                            <>
                                                <Tag color="blue">${item.price}</Tag>
                                            </>
                                        }
                                    />
                                </ItemCard>
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>

            <Modal
                title={selectedItem?.itemName}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedItem && (
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <img
                                src={selectedItem.url}
                                alt={selectedItem.itemName}
                                style={{ width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Title level={4}>{selectedItem.itemName}</Title>
                            <Paragraph>{selectedItem.itemDescription}</Paragraph>
                            <Statistic
                                title="Price"
                                value={selectedItem.price}
                                prefix="$"
                                style={{ marginBottom: 16 }}
                            />
                            <Button type="primary" icon={<ShoppingOutlined />}>
                                Buy Again
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
        </ProfileContainer>
    );
}

export default Profile;