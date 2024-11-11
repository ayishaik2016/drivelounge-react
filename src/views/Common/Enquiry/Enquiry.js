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
  Layout,
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
import "./../../../assets/css/userStyle.css";
import { getLocaleMessages } from "redux/helper";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
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
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <section className="search-result title_zero">
            <div className="container">
              <Title level={4}>{getLocaleMessages("Contact us")} </Title>
            </div>
          </section>
          <div
            className="page-container contact_page"
            style={{ marginTop: "30px" }}
          >
            <div className="container">
              <Form
                form={usedForm}
                layout="vertical"
                onFinish={onFinishDetails}
                {...formProps}
              >
                <Row gutter={30} className="contact-container">
                  <Col span={12} className="inner-content">
                    <Form.Item
                      label={getLocaleMessages("Name")}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: `${getLocaleMessages(
                            "Please input"
                          )} ${getLocaleMessages("Name")}`,
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>

                    <Form.Item
                      label={getLocaleMessages("Email")}
                      name="email"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: `${getLocaleMessages(
                            "Please input"
                          )} ${getLocaleMessages("Email")}`,
                        },
                        {
                          type: "email",
                          whitespace: true,
                          message: getLocaleMessages("Invalid email"),
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                    
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
                          message: `${getLocaleMessages(
                            "Please input"
                          )} ${getLocaleMessages("Contact Number Length")}`,
                          validator: (error, value) => {
                            if (isValidPhoneNumber(value)) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject();
                            }
                          },
                        },
                      ]}
                    >
                      <PhoneInput
                        flagUrl="https://institute.duceapps.com/{XX}.svg"
                        international
                        placeholder={getLocaleMessages("Contact Number")}
                        countryCallingCodeEditable={false}
                        defaultCountry={"SA"}
                      />
                    </Form.Item>

                    <Form.Item
                      label={getLocaleMessages("Subject")}
                      name="subject"
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages(
                            "Please provide the subject related to"
                          ),
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                    
                    <Form.Item
                      label={getLocaleMessages("Message")}
                      name="content"
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages(
                            "Please provide the details"
                          ),
                        },
                      ]}
                    >
                      <Input.TextArea rows={4} className="contact-textarea" placeholder="" />
                    </Form.Item>

                  </Col>
                </Row>
                <div className="button-center-text">
                  <Button type="primary" htmlType="submit" className="save-btn">
                    {getLocaleMessages("Send")}
                  </Button>
                </div>
                <Row gutter={40}>
                  <Col span={24} className="inner-content">
                     <div className="button-center-text">
                       { getLocaleMessages("If you have any questions or any complaint about any service provided, you can contact the driving lounge team regarding it on the following contact")}: <br />
{ getLocaleMessages("Email Address")}: <a href="mailto:support@drivelounge.com">support@drivelounge.com</a><br />
{ getLocaleMessages("WhatsApp")}: 00966507070805
                     </div>
                  </Col>
                </Row>
                
              </Form>
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default ContactComponet;
