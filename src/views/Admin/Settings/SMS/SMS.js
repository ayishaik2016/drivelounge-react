import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Button, Card, Form, Radio } from "antd";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/settings/actions";
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const SMS = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { isLoading, sms_data } = useSelector((state) => state.WebSettings);

  const [value, setValue] = useState(true);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onFinishSMS = (values) => {
    dispatch({
      type: settingsAction.UPDATE_SMS_SETTINGS,
      payload: values,
    });
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_SMS_SETTINGS,
      payload: false,
    });
  }, []);

  useEffect(() => {
    usedForm.setFieldsValue({ ...sms_data });
  }, [usedForm, sms_data]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Card title={getLocaleMessages("SMS")}>
          <div className="dashboard-form">
            <Form form={usedForm} onFinish={onFinishSMS} {...formProps}>
              <Row gutter={30}>
                <Col span={12} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("SMS Gateway Username")}
                    name="smsgatewayusername"
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
                    label={getLocaleMessages("SMS Gateway Password")}
                    name="smsgatewaypassword"
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
                    label={getLocaleMessages("SMS Gateway Sender ID")}
                    name="smsgatewaysenderid"
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
                    label={getLocaleMessages("Is SMS Enabled")}
                    name="smsgatewayisenabled"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Radio.Group onChange={onChange} value={value}>
                      <Radio value={true} style={{ fontSize: "14px" }}>
                        {getLocaleMessages("Yes")}
                      </Radio>
                      <Radio value={false} style={{ fontSize: "14px" }}>
                        {getLocaleMessages("No")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <div className="button-center">
                  <ShowForPermission permission="update" module="sms">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="save-btn"
                    >
                      {getLocaleMessages("Save")}
                    </Button>
                  </ShowForPermission>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default SMS;
