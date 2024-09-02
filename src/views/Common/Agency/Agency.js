import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "./../../../redux/admin/enquiry/actions";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  Switch,
  Form,
  Divider,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import { UploadOutlined } from "@ant-design/icons";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import Layout from "antd/lib/layout/layout";
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const ContactComponet = (props) => {
  const {
    handleClick,
    visible,
    onFinish,
    onCancel,
    LoginSignup,
    loader,
    onChange,
  } = props;
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();

  const onFinishDetails = (values) => {
    dispatch({
      type: actions.CREATE_ENQUIRY,
      values,
    });
    usedForm.resetFields();
  };

  return (
    <>
      <Layout>
        <Header />

        <div className="page-container">
          <Card>
            <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
              <Title level={2}>Contact us </Title>
              <Divider />
              <Row gutter={20}>
                <Col span={10} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Firstname")}
                    name="firstname"
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
                <Col span={10} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Lastname")}
                    name="lastname"
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
              </Row>
              <Row gutter={20}>
                <Col span={10} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Email")}
                    name="email"
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
                <Col span={10} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Contact Number")}
                    name="contactnumber"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages(
                          "Contact number is required"
                        ),
                      },
                      {
                        min: 10,
                        message: getLocaleMessages(
                          "Contact number should be minimum 6 digits."
                        ),
                      },
                      {
                        max: 10,
                        message: getLocaleMessages(
                          "Contact number should be maximum 15 digits."
                        ),
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={20} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Subject")}
                    name="subject"
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
              </Row>
              <Row gutter={20}>
                <Col span={20} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Message")}
                    name="content"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={4}>
                <Col span={24}>
                  <Form.Item>
                    <div className="button-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="save-btn"
                      >
                        {getLocaleMessages("Send")}
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default ContactComponet;
