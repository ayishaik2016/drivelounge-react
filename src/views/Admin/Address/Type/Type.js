import React, { useState, useEffect } from "react";
import { history, store } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Card,
  Form,
  Radio,
  Tabs,
  Divider,
  Typography,
} from "antd";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/address/actions";
import "../../../../assets/css/adminStyle.css";
import { getLocaleMessages } from "redux/helper";
const { TabPane } = Tabs;
const { Title } = Typography;
const AddressTypeComponent = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { address_typebyid } = useSelector((state) => state.Address);

  const onFinishDetails = (values) => {
    let data = {
      action: "I",
      id: "",
      addresstypenameen: values.addresstypenameen,
      addresstypenamear: values.addresstypenamear,
      addresstypestatus: values.addresstypestatus,
    };
    if (props.location.state !== undefined) {
      data["id"] = props.location.state.typeid;
      data["action"] = "U";
      dispatch({
        type: settingsAction.ADDRESSTYPE_MANAGEMENT_IUD,
        payload: data,
      });
    } else {
      dispatch({
        type: settingsAction.ADDRESSTYPE_MANAGEMENT_IUD,
        payload: data,
      });
    }
  };

  useEffect(() => {
    if (address_typebyid && address_typebyid.id !== undefined)
      usedForm.setFieldsValue({
        ...address_typebyid,
        addresstypestatus:
          address_typebyid.addresstypestatus == 1 ? true : false,
      });
  }, [address_typebyid]);

  useEffect(() => {
    if (props.location.state !== undefined) {
      const { typeid } = props.location.state;
      dispatch({
        type: settingsAction.GET_ADDRESSTYPE_MANAGEMENT_BYTYPEID,
        payload: { typeid },
      });
    } else {
      usedForm.resetFields();
    }
  }, []);

  return (
    <div className="page-container">
      <Card>
        <Title level={2}>
          {props.location.state !== undefined
            ? getLocaleMessages("Update Address Type")
            : getLocaleMessages("Create Address Type")}{" "}
        </Title>
        <Divider />
        <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
          <Row className="center-row">
            <Col span={20} className="inner-content">
              <Tabs defaultActiveKey="1">
                <TabPane tab={getLocaleMessages("English")} key="1">
                  <Form.Item name={"addresstypenameen"}>
                    <Input />
                  </Form.Item>
                </TabPane>
                <TabPane tab={getLocaleMessages("Arabic")} key="2">
                  <Form.Item name={"addresstypenamear"}>
                    <Input />
                  </Form.Item>
                </TabPane>
              </Tabs>
            </Col>
            <Col span={20} className="inner-content">
              <Form.Item
                label={getLocaleMessages("Status")}
                name="addresstypestatus"
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Fields are required"),
                  },
                ]}
              >
                <Radio.Group>
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
          <div className="button-center">
            <Button
              onClick={() => {
                props.history.goBack();
              }}
              className="save-btn"
            >
              {getLocaleMessages("Cancel")}
            </Button>
            <Button type="primary" htmlType="submit" className="save-btn">
              {props.location.state !== undefined
                ? getLocaleMessages("Update")
                : getLocaleMessages("Create")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddressTypeComponent;
