import React, { useState, useEffect } from "react";
import {message, Modal, Row, Col, Button} from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import {BASE_URL, TOKEN_KEY} from "../constants";
import CreatePostButton from "./CreatePostButton";

import "../styles/Home.css"
function Home(props) {
    const [posts, setPosts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios.post(`${BASE_URL}/getAllPost`)
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

    const createPost = (postData) => {
        const token = localStorage.getItem(TOKEN_KEY);
        axios.post(`${BASE_URL}/create_post`, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    message.success('Post created successfully!');
                    fetchPosts(); // Re-fetch posts to show the new one
                }
            })
            .catch(error => {
                message.error('Failed to create post!');
                console.error('Failed to create post:', error);
            });
    };

    return (
        <div className="home">
            <div className="search-create-container">
                <SearchBar onSearch={handleSearch} />
                <CreatePostButton onCreatePost={createPost} />
            </div>
            <div className="display">
                <Row gutter={[16, 16]}>
                    {posts.map(post => (
                        <Col
                            key={post.id}
                            xs={24} sm={12} md={8} lg={6}
                            onClick={() => showPostDetails(post)}
                            style={{cursor: 'pointer'}}
                        >
                            <div style={{marginBottom: '20px'}}>
                                <img
                                    src={post.url}
                                    alt={post.itemName}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxWidth: '100%',  // 添加这一行
                                        objectFit: 'contain'  // 添加这一行
                                    }}
                                />
                                <h4>{post.itemName || 'No Name'}</h4>
                                <p>Price: {post.price}</p>
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
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            OK
                        </Button>,
                    ]}
                >
                    {selectedPost && (
                        <div>
                            <img
                                src={selectedPost.url}
                                alt={selectedPost.itemName}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',  // 添加这一行
                                    objectFit: 'contain',  // 添加这一行
                                    marginBottom: '20px'
                                }}
                            />
                            <p>Item Name: {selectedPost.itemName}</p>
                            <p>Description: {selectedPost.itemDescription}</p>
                            <p>Price: {selectedPost.price}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );

}

export default Home;
