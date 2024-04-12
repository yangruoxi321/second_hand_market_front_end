import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";
import PostForm from "./PostForm"; // Import the PostForm
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
        };
        this.formRef = React.createRef(); // Create a ref for the form
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        if (this.formRef.current) {
            this.formRef.current.handleSubmit(); // Make sure handleSubmit is a method on PostForm
        }
    };

    handleFormSubmit = (formData) => {
        axios.post(`${BASE_URL}/create_post`, formData, {
            headers: {
                'token': `${localStorage.getItem(TOKEN_KEY)}`,
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    message.success("Post created successfully!");
                    this.setState({ visible: false, confirmLoading: false });
                    this.props.onShowPost(); // Make sure you have passed this prop from Home
                }
            })
            .catch((err) => {
                console.error("Failed to create post: ", err.message);
                message.error("Failed to create post!");
                this.setState({ confirmLoading: false });
            });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            confirmLoading: false,
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Create"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm ref={this.formRef} onSubmit={this.handleFormSubmit} />
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;
