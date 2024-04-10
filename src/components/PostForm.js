import React, { useState } from 'react';
import { Input, Form, Button, InputNumber } from 'antd';

const PostForm = ({ onSubmit }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Check if onSubmit is a function before calling it
        if (typeof onSubmit === 'function') {
            onSubmit(values);
        } else {
            // If not, you might want to alert the developer or handle this case appropriately
            console.error('onSubmit is not a function');
        }
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item
                name="itemName"
                rules={[{ required: true, message: 'Please input the name of the item!' }]}
            >
                <Input placeholder="Item Name" />
            </Form.Item>
            <Form.Item
                name="itemDescription"
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input.TextArea placeholder="Item Description" />
            </Form.Item>
            <Form.Item
                name="price"
                rules={[{ required: true, message: 'Please input the price!' }]}
            >
                <InputNumber placeholder="Price" min={0} step={0.01} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PostForm;
