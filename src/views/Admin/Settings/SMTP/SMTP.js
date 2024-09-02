import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Button, Card, Form, Radio } from "antd";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/settings/actions";
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const Smtp = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { isLoading, smtp_data } = useSelector((state) => state.WebSettings);

  const [value, setValue] = useState(true);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onFinishSMTP = (values) => {
    dispatch({
      type: settingsAction.UPDATE_SMTP_SETTINGS,
      payload: values,
    });
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_SMTP_SETTINGS,
      payload: false,
    });
  }, []);

  useEffect(() => {
    usedForm.setFieldsValue({ ...smtp_data });
  }, [usedForm, smtp_data]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Card title={getLocaleMessages("SMTP")}>
          <Form form={usedForm} onFinish={onFinishSMTP} {...formProps}>
            <Row gutter={30}>
              <Col span={12} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("SMTP Host")}
                  name={"smtphost"}
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
                  label={getLocaleMessages("SMTP Port")}
                  name={"smtpport"}
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
                  label={getLocaleMessages("SMTP Encryption")}
                  name={"smtpencryption"}
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
                  label={getLocaleMessages("SMTP Username")}
                  name={"smtpusername"}
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
                  label={getLocaleMessages("SMTP Password")}
                  name={"smtppassword"}
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input.Password placeholder="" />
                </Form.Item>
              </Col>

              <Col span={12} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Is SMTP Enabled")}
                  name={"smtpisenabled"}
                >
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio
                      value={true}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {getLocaleMessages("Yes")}
                    </Radio>
                    <Radio
                      value={false}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {getLocaleMessages("No")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <div className="button-center">
                <ShowForPermission permission="update" module="smtp">
                  <Button type="primary" htmlType="submit" className="save-btn">
                    {getLocaleMessages("Save")}
                  </Button>
                </ShowForPermission>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default Smtp;
