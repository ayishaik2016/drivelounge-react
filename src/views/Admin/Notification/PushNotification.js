import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Button, Card, Form, Select } from "antd";
import { formProps } from "./../../../helpers/constant";
import settingsAction from "./../../../redux/admin/settings/actions";
import "./../../../assets/css/adminStyle.css";
import { getLocaleMessages } from "redux/helper";
const { Option } = Select;
const { TextArea } = Input;

const PushNotification = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();

  const handleChange = (value) => {};

  const onSendNotification = () => {};

  return (
    <div className="page-container medium">
      <Card title={getLocaleMessages("Push Notification")}>
        <Form form={usedForm} onFinish={onSendNotification} {...formProps}>
          <Row gutter={30}>
            <Col span={12} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Notification App Type")}
                name={"notificationapptype"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Fields are required"),
                  },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col span={12} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Type")}
                name={"type"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Fields are required"),
                  },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col span={12} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Port")}
                name={"port"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Fields are required"),
                  },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col span={12} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Title")}
                name={"title"}
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Fields are required"),
                  },
                ]}
              >
                <Input placeholder={getLocaleMessages("Title")} />
              </Form.Item>
            </Col>

            <Col span={12} className="inner-content">
              <Form.Item label={getLocaleMessages("Message")} name={"message"}>
                <TextArea
                  placeholder=""
                  autoSize={{ minRows: 3, maxRows: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className="button-center">
              <Button type="primary" htmlType="submit" className="save-btn">
                {getLocaleMessages("SEND")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PushNotification;
