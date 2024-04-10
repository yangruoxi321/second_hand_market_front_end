import React, { useState, useEffect } from "react";
import { message, Modal, Row, Col } from "antd";
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
        axios.get(`${BASE_URL}/getAllPost`)
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
                <SearchBar/>
                <CreatePostButton onShowPost={fetchPosts}/>
            </div>
            <div className="display">
                <Row gutter={[16, 24]}>
                    {posts.map(post => (
                        <Col key={post.id} span={8} onClick={() => showPostDetails(post)} style={{cursor: 'pointer'}}>
                            <div style={{marginBottom: '20px'}}>
                                <h4>{post.itemName || 'No Name'}</h4>
                                {/* 这里可以添加更多帖子信息预览 */}
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* 模态窗口显示帖子详情 */}
                <Modal title="Post Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    {selectedPost && (
                        <>
                            <p>Item Name: {selectedPost.itemName}</p>
                            <p>Description: {selectedPost.itemDescription}</p>
                            <p>Price: {selectedPost.price}</p>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );

}

export default Home;
