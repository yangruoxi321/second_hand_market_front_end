import React from 'react';
import { Input, Form, Button, InputNumber, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const PostForm = React.forwardRef((props, formRef) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { itemName, itemDescription, price, uploadPost } = values;

        const formData = new FormData();
        formData.append('post', JSON.stringify({ itemName, itemDescription, price }));
        formData.append('file', uploadPost[0].originFileObj);

        try {
            await props.onSubmit(formData);
            form.resetFields();
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to create post');
        }
    };

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleSubmit = () => {
        form.submit();
    };

    // 将 handleSubmit 方法暴露给父组件
    React.useImperativeHandle(formRef, () => ({
        handleSubmit: handleSubmit,
    }));

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
                <Form.Item
                    name="uploadPost"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[{ required: true, message: 'Please select an image!' }]}
                >
                    <Upload.Dragger name="files" beforeUpload={() => false}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
        </Form>
    );
});

export default PostForm;