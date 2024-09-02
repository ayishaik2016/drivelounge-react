import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Menu,
  Modal,
  Dropdown,
  message,
  Select,
  Avatar,
  Typography,
  Col,
  Input,
  Row,
  Form,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import actions from "./../../../redux/admin/settings/actions";

import { getLocalDataType, getLocaleMessages } from "./../../../redux/helper";
const { Title, Paragraph } = Typography;
const Header = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [UserId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user_data"))["id"]
  );
  const { isLoading, agency_profile } = useSelector(
    (state) => state.WebSettings
  );

  const [DocTitle, setDocTitle] = useState("");
  const [Number, setNumber] = useState("");
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: actions.GET_AGENT_PROFILE,
      payload: UserId,
    });
  }, []);

  useEffect(() => {
    if (agency_profile !== undefined) {
      const {
        firstname,
        lastname,
        username,
        password,
        email,
        contactnumber,
        vatnumber,
        vatdocs,
        crnumber,
        crdocs,
      } = {
        ...agency_profile,
      };
      form.setFieldsValue({
        firstname,
        lastname,
        username,
        email,
        password,
        contactnumber,
        vatnumber,
        vatdocs,
        crnumber,
        crdocs,
      });
    }
  }, [agency_profile]);

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text={getLocaleMessages("Loading your content...")}
      >
        <Modal
          Doctitle={DocTitle}
          visible={visible}
          centered
          footer={false}
          width={800}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisible(!visible)}
        >
          <div>
            <iframe
              width="100%"
              height="600px"
              alt="example"
              src={`https://api.drivelounge.com/${Number}`}
            />
          </div>
        </Modal>

        <div className="page-container medium">
          <Title level={3}> {getLocaleMessages("My Profile")} </Title>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            className="form-input-1"
          >
            {getLocalDataType() == "agency" && (
              <Row gutter={30}>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("First Name")}
                    name="firstname"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Last Name")}
                    name="lastname"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("User Name")}
                    name="username"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("Password")}
                    name="password"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={getLocaleMessages("Email")} name="email">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("VAT Number")}
                    name="vatnumber"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("VAT Document")}
                    name="vatdocs"
                  >
                    <Input
                      disabled
                      suffix={
                        agency_profile.vatdocs !== null ? (
                          <EyeOutlined
                            onClick={() => {
                              setvisible(!visible);
                              setDocTitle(getLocaleMessages("VAT Document"));
                              setNumber(agency_profile.vatdocs);
                            }}
                          />
                        ) : (
                          <></>
                        )
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("CR Number")}
                    name="crnumber"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={getLocaleMessages("CR Document")}
                    name="crdocs"
                  >
                    <Input
                      disabled
                      suffix={
                        agency_profile.vatdocs !== null ? (
                          <EyeOutlined
                            onClick={() => {
                              setvisible(!visible);
                              setDocTitle(getLocaleMessages("CR Document"));
                              setNumber(agency_profile.crdocs);
                            }}
                          />
                        ) : (
                          <></>
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={30}></Row>
          </Form>
        </div>
      </LoadingOverlay>
    </>
  );
};
export default Header;
