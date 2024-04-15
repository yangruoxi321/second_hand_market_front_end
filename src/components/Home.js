import React, { useState, useEffect } from "react";
import {message, Modal, Row, Col, Button,Rate} from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import {BASE_URL, TOKEN_KEY} from "../constants";
import CreatePostButton from "./CreatePostButton";

import "../styles/Home.css"
function Home(props) {
    const [posts, setPosts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const [rating, setRating] = useState(0);
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = (formData) => {
        axios.post(`${BASE_URL}/getAllPost`,formData,{
            headers: {
                'token': `${localStorage.getItem(TOKEN_KEY)}`,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setPosts(res.data);
                }
            })
            .catch(err => {
                message.error("Unable to load posts");
                console.log("Fetch error: ", err.message);
            });
    };

    const handleSearch = (searchTerm) => {
        axios.post(`${BASE_URL}/search`, {
            search: searchTerm
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setPosts(res.data); // Update the posts state with search results
                }
            })
            .catch(err => {
                message.error("Search failed");
                console.log("Search error: ", err.message);
            });
    };
    const showPostDetails = (post) => {
        setSelectedPost(post);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = () => {
        const formData = {
            id: selectedPost.id
        };
        axios.post(`${BASE_URL}/deletePost`, formData, {
            headers: {
                'token': `${localStorage.getItem(TOKEN_KEY)}`,
            },
        })
            .then(response => {
                message.success('Post deleted successfully');
                fetchPosts();  // 重新加载所有帖子以更新界面
                setIsModalVisible(false);  // 关闭模态窗口
            })
            .catch(error => {
                message.error('Failed to delete post');
                console.error('Delete error:', error.message);
            });
    }

    const handlePurchase = (formData) => {
        axios
            .post(`${BASE_URL}/purchase`, formData, {
                headers: {
                    token: `${localStorage.getItem(TOKEN_KEY)}`,
                    post_id: selectedPost.id,
                },
            })
            .then((response) => {
                message.success("Purchase successfully");
                setIsModalVisible(false); // 关闭详情模态窗口
                setIsRatingModalVisible(true); // 打开评分模态窗口
            })
            .catch((error) => {
                if (error.response) {
                    // 处理错误响应
                    console.log("Purchase failed: ", error.response.data.message);
                    message.error("Purchase failed: " + error.response.data.message);
                } else {
                    // 处理其他错误
                    console.log("Purchase failed: ", error.message);
                    message.error("Purchase failed!");
                }
            });
    };

    const handleRating = () => {
        axios
            .post(
                `${BASE_URL}/rateSeller`,
                {},
                {
                    headers: {
                        token: `${localStorage.getItem(TOKEN_KEY)}`,
                        postId: selectedPost.id,
                        rate: rating,
                    },
                }
            )
            .then((response) => {
                message.success("Rating submitted successfully");
                fetchPosts(); // 重新加载所有帖子以更新界面
                setIsRatingModalVisible(false); // 关闭评分模态窗口
            })
            .catch((error) => {
                message.error("Failed to submit rating");
                console.error("Rating error:", error.message);
            });
    };

    const handleRatingModalCancel = () => {
        setIsRatingModalVisible(false);
    };
    return (
        <div className="home">
            <div className="search-create-container">
                <SearchBar onSearch={handleSearch} />
                <CreatePostButton onPostCreated={fetchPosts}/>
            </div>


            <div className="display">
                <Row gutter={[16, 16]}>
                    {posts.map(post => (
                        <Col
                            key={post.id}
                            xs={24} sm={12} md={8} lg={6}
                            onClick={() => showPostDetails(post)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ height: '350px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img
                                        src={post.url}
                                        alt={post.itemName}
                                        style={{
                                            maxHeight: '100%',  // Ensures the image's maximum height is 100% of the container
                                            maxWidth: '100%',  // Ensures the image's maximum width is 100% of the container
                                            objectFit: 'contain',  // Ensures the image is scaled to be as large as possible without being cropped or stretched
                                            objectPosition: 'center'
                                        }}
                                    />
                                </div>
                                <h4>{post.itemName || 'No Name'}</h4>
                                <p>Price: ${post.price}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title="Post Details"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        selectedPost && selectedPost.canDelete && (
                            <Button key="submit" type="primary" onClick={() => handleDelete(selectedPost.id)}>
                                Delete
                            </Button>
                        ),
                        selectedPost && !selectedPost.canDelete && (
                            <Button key="submit" type="primary" onClick={() => handlePurchase(selectedPost.id)}>
                                Buy
                            </Button>
                        )
                    ]}
                >
                    {selectedPost && (
                        <div>
                            <img
                                src={selectedPost.url}
                                alt={selectedPost.itemName}
                                style={{
                                    maxHeight: '450px', // Adjusted for modal view to be clear and fully visible
                                    maxWidth: '100%',
                                    objectFit: 'contain', // Ensures the image is scaled properly within the modal
                                    marginBottom: '20px',
                                }}
                            />
                            <p>Item Name: {selectedPost.itemName}</p>
                            <p>Description: {selectedPost.itemDescription}</p>
                            <p>Price: ${selectedPost.price}</p>
                        </div>
                    )}
                </Modal>
                <Modal
                    title="Rate the Seller"
                    visible={isRatingModalVisible}
                    onOk={handleRating}
                    onCancel={handleRatingModalCancel}
                >
                    <Rate allowHalf onChange={(value) => setRating(value)} />
                </Modal>
            </div>
        </div>
    );



}

export default Home;
