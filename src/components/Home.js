import React, { useState, useEffect } from "react";
import { message, Modal, Row, Col, Button, Rate, Input, Space } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import { BASE_URL, TOKEN_KEY } from "../constants";
import CreatePostButton from "./CreatePostButton";

import "../styles/Home.css";

function Home(props) {
    const [posts, setPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [rating, setRating] = useState(0);
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [posts, minPrice, maxPrice]);

    const fetchPosts = (formData) => {
        axios
            .post(`${BASE_URL}/getAllPost`, formData, {
                headers: {
                    token: `${localStorage.getItem(TOKEN_KEY)}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setPosts(res.data);
                }
            })
            .catch((err) => {
                message.error("Unable to load posts");
                console.log("Fetch error: ", err.message);
            });
    };

    const filterPosts = () => {
        let filtered = posts;

        if (minPrice !== "") {
            filtered = filtered.filter((post) => post.price >= parseFloat(minPrice));
        }

        if (maxPrice !== "") {
            filtered = filtered.filter((post) => post.price <= parseFloat(maxPrice));
        }

        setDisplayedPosts(filtered);
    };

    const handleSearch = (searchTerm) => {
        axios
            .post(
                `${BASE_URL}/search`,
                {
                    search: searchTerm,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    setPosts(res.data); // Update the posts state with search results
                }
            })
            .catch((err) => {
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
            id: selectedPost.id,
        };
        axios
            .post(`${BASE_URL}/deletePost`, formData, {
                headers: {
                    token: `${localStorage.getItem(TOKEN_KEY)}`,
                },
            })
            .then((response) => {
                message.success("Post deleted successfully");
                fetchPosts(); // 重新加载所有帖子以更新界面
                setIsModalVisible(false); // 关闭模态窗口
            })
            .catch((error) => {
                message.error("Failed to delete post");
                console.error("Delete error:", error.message);
            });
    };

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
                setIsModalVisible(false);
                setIsRatingModalVisible(true);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Purchase failed: ", error.response.data.message);
                    message.error("Purchase failed: " + error.response.data.message);
                } else {
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
                fetchPosts();
                setIsRatingModalVisible(false);
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
                <CreatePostButton onPostCreated={fetchPosts} />
            </div>

            <div className="price-filter-container">
                <Space>
                    <Input
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </Space>
            </div>

            <div className="display">
                <Row gutter={[16, 16]}>
                    {displayedPosts.map((post) => (
                        <Col
                            key={post.id}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            onClick={() => showPostDetails(post)}
                            style={{ cursor: "pointer" }}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <div
                                    style={{
                                        height: "350px",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={post.url}
                                        alt={post.itemName}
                                        style={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                            objectPosition: "center",
                                        }}
                                    />
                                </div>
                                <h4>{post.itemName || "No Name"}</h4>
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
                        selectedPost &&
                        selectedPost.canDelete && (
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => handleDelete(selectedPost.id)}
                            >
                                Delete
                            </Button>
                        ),
                        selectedPost &&
                        !selectedPost.canDelete && (
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => handlePurchase(selectedPost.id)}
                            >
                                Buy
                            </Button>
                        ),
                    ]}
                >
                    {selectedPost && (
                        <div>
                            <img
                                src={selectedPost.url}
                                alt={selectedPost.itemName}
                                style={{
                                    maxHeight: "450px",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                    marginBottom: "20px",
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