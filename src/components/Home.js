import React, { useState, useEffect, useRef } from "react";
import {
    message, Card, Button, Input, Modal, Rate, Typography, Layout, Space, Spin,
    Carousel, Avatar, Tag, Tooltip, Drawer, List, Statistic, Divider, Switch
} from "antd";
import {
    ShoppingCartOutlined, DeleteOutlined, SearchOutlined, DollarOutlined,
    CameraOutlined, ReloadOutlined, HeartOutlined, HeartFilled,
    FireOutlined, StarOutlined, ThunderboltOutlined, EyeOutlined,
    EnvironmentOutlined, ClockCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { BASE_URL, TOKEN_KEY } from "../constants";

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const { Meta } = Card;

// Global styles
const GlobalStyle = createGlobalStyle`
    body {
        background: ${props => props.darkMode ? '#121212' : '#f0f2f5'};
        transition: background 0.3s ease;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: ${props => props.darkMode ? '#1f1f1f' : '#f1f1f1'};
    }
    ::-webkit-scrollbar-thumb {
        background: ${props => props.darkMode ? '#888' : '#888'};
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: ${props => props.darkMode ? '#555' : '#555'};
    }
`;

// Styled components
const StyledLayout = styled(Layout)`
    background: ${props => props.darkMode ? '#121212' : '#f0f2f5'};
`;

const StyledHeader = styled(Header)`
    background: ${props => props.darkMode ? '#1f1f1f' : '#fff'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    position: fixed;
    z-index: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;
`;

const StyledContent = styled(Content)`
    padding: 24px 50px;
    margin-top: 64px;
`;

const StyledFooter = styled(Footer)`
  text-align: center;
  background: ${props => props.darkMode ? '#1f1f1f' : '#f0f2f5'};
`;

const StyledCard = styled(motion.div)`
  background: ${props => props.darkMode ? '#1f1f1f' : '#fff'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.2);
  }
`;

const ParallaxBanner = styled.div`
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

function Home() {
    const [posts, setPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const parallaxRef = useRef(null);

    useEffect(() => {
        fetchPosts();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        filterPosts();
    }, [posts, minPrice, maxPrice, searchTerm]);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        if (parallaxRef.current) {
            parallaxRef.current.style.backgroundPositionY = `${scrollTop * 0.5}px`;
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/getAllPost`, {}, {
                headers: { token: localStorage.getItem(TOKEN_KEY) },
            });
            setPosts(res.data);
        } catch (err) {
            message.error("Unable to load posts");
            console.error("Fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = posts.filter(post =>
            post.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (minPrice !== "") {
            filtered = filtered.filter((post) => post.price >= parseFloat(minPrice));
        }
        if (maxPrice !== "") {
            filtered = filtered.filter((post) => post.price <= parseFloat(maxPrice));
        }

        setDisplayedPosts(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await axios.post(`${BASE_URL}/deletePost`, { id }, {
                headers: { token: localStorage.getItem(TOKEN_KEY) },
            });
            message.success("Post deleted successfully");
            fetchPosts();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to delete post");
            console.error("Delete error:", error.message);
        }
    };

    const handlePurchase = async (id) => {
        try {
            await axios.post(`${BASE_URL}/purchase`, {}, {
                headers: {
                    token: localStorage.getItem(TOKEN_KEY),
                    post_id: id
                },
            });
            message.success("Purchase successful");
            setIsModalVisible(false);
        } catch (error) {
            message.error("Purchase failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleRating = async () => {
        try {
            await axios.post(`${BASE_URL}/rateSeller`, {}, {
                headers: {
                    token: localStorage.getItem(TOKEN_KEY),
                    postId: selectedPost.id,
                    rate: rating,
                },
            });
            message.success("Rating submitted successfully");
            fetchPosts();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to submit rating");
            console.error("Rating error:", error.message);
        }
    };

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    return (
        <>
            <GlobalStyle darkMode={darkMode} />
            <StyledLayout darkMode={darkMode}>
                <StyledHeader darkMode={darkMode}>
                    <Title level={3} style={{ color: darkMode ? '#fff' : '#000', margin: 0 }}>Luxe Marketplace</Title>
                    <Space>
                        <Switch
                            checked={darkMode}
                            onChange={setDarkMode}
                            checkedChildren="🌙"
                            unCheckedChildren="☀️"
                        />
                        <Button type="primary" onClick={() => setDrawerVisible(true)}>Dashboard</Button>
                    </Space>
                </StyledHeader>
                <StyledContent>
                    <ParallaxBanner ref={parallaxRef}>
                        <Title style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                            Discover Luxury Items
                        </Title>
                    </ParallaxBanner>
                    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <Input
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                prefix={<SearchOutlined />}
                                style={{ width: 200 }}
                            />
                            <Input
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                type="number"
                                prefix={<DollarOutlined />}
                                style={{ width: 150 }}
                            />
                            <Input
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                type="number"
                                prefix={<DollarOutlined />}
                                style={{ width: 150 }}
                            />
                            <Button onClick={fetchPosts} icon={<ReloadOutlined />}>Refresh</Button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <motion.div
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <AnimatePresence>
                                    {displayedPosts.map((post) => (
                                        <StyledCard
                                            key={post.id}
                                            darkMode={darkMode}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card
                                                hoverable
                                                cover={
                                                    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                                        <img alt={post.itemName} src={post.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                                            padding: '20px 10px 10px',
                                                            color: '#fff'
                                                        }}>
                                                            <Text strong style={{ color: '#fff', fontSize: '16px' }}>{post.itemName || "No Name"}</Text>
                                                        </div>
                                                    </div>
                                                }
                                                actions={[
                                                    <Tooltip title="View Details">
                                                        <EyeOutlined key="view" onClick={() => { setSelectedPost(post); setIsModalVisible(true); }} />
                                                    </Tooltip>,
                                                    <Tooltip title={favorites.includes(post.id) ? "Remove from Favorites" : "Add to Favorites"}>
                                                        {favorites.includes(post.id) ?
                                                            <HeartFilled key="favorite" onClick={() => toggleFavorite(post.id)} style={{ color: '#ff4d4f' }} /> :
                                                            <HeartOutlined key="favorite" onClick={() => toggleFavorite(post.id)} />
                                                        }
                                                    </Tooltip>,
                                                    <Tooltip title="Quick Buy">
                                                        <ShoppingCartOutlined key="buy" onClick={() => handlePurchase(post.id)} />
                                                    </Tooltip>
                                                ]}
                                            >
                                                <Meta
                                                    description={
                                                        <>
                                                            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                                                {post.itemDescription}
                                                            </Paragraph>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                                <Tag color="gold" style={{ fontSize: '16px', padding: '5px 10px' }}>${post.price}</Tag>
                                                                <Rate disabled defaultValue={Math.floor(Math.random() * 5) + 1} style={{ fontSize: '14px' }} />
                                                            </div>
                                                            <div style={{ marginTop: '10px', fontSize: '12px', color: darkMode ? '#aaa' : '#888' }}>
                                                                <EnvironmentOutlined /> New York &nbsp;&nbsp;
                                                                <ClockCircleOutlined /> Posted 2 days ago
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </Card>
                                        </StyledCard>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </Space>
                </StyledContent>
                <StyledFooter darkMode={darkMode}>Luxe Marketplace ©2023 Created with passion</StyledFooter>
            </StyledLayout>

            <Modal
                title={selectedPost?.itemName}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                {selectedPost && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <img
                            src={selectedPost.url}
                            alt={selectedPost.itemName}
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <Typography.Title level={4}>{selectedPost.itemName}</Typography.Title>
                        <Paragraph>{selectedPost.itemDescription}</Paragraph>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Tag color="gold" style={{ fontSize: '20px', padding: '10px 15px' }}>${selectedPost.price}</Tag>
                            <Rate disabled defaultValue={Math.floor(Math.random() * 5) + 1} />
                        </div>
                        <div>
                            <EnvironmentOutlined /> New York &nbsp;&nbsp;
                            <ClockCircleOutlined /> Posted 2 days ago
                        </div>
                        {selectedPost.canDelete ? (
                            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(selectedPost.id)} block>
                                Delete
                            </Button>
                        ) : (
                            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => handlePurchase(selectedPost.id)} block>
                                Buy Now
                            </Button>
                        )}
                        {!selectedPost.canDelete && (
                            <div>
                                <Text>Rate this item:</Text>
                                <Rate onChange={setRating} value={rating} />
                                <Button onClick={handleRating} style={{ marginLeft: '10px' }}>Submit Rating</Button>
                            </div>
                        )}
                    </Space>
                )}
            </Modal>

            <Drawer
                title="Marketplace Dashboard"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                width={400}
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Statistic title="Total Posts" value={posts.length} prefix={<FireOutlined />} />
                    <Statistic title="Favorites" value={favorites.length} prefix={<HeartFilled />} />
                    <Statistic
                        title="Average Price"
                        value={posts.reduce((acc, post) => acc + post.price, 0) / posts.length}
                        prefix={<DollarOutlined />}
                        precision={2}
                    />
                    <Divider />
                    <Typography.Title level={4}>Top Rated Items</Typography.Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={posts.slice(0, 5)}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.url} />}
                                    title={item.itemName}
                                    description={<Rate disabled defaultValue={Math.floor(Math.random() * 5) + 1} />}
                                />
                                <div>${item.price}</div>
                            </List.Item>
                        )}
                    />
                </Space>
            </Drawer>
        </>
    );
}

export default Home;