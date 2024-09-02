import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Form,
  Typography,
  Modal,
} from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import settingsAction from "../../../redux/admin/enquiry/actions";
import "./../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Title } = Typography;

const EnquiryManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { enquiry_data, isLoading } = useSelector((state) => state.EnquiryInfo);
  const [visible, setvisible] = useState(false);
  const [SelectedID, setSelectedID] = useState(0);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, row, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Name"),
      dataIndex: "firstname",
      key: "firstname",
      render: (id, row) => <span>{`${row.firstname} ${row.lastname}`}</span>,
    },
    {
      title: getLocaleMessages("Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: getLocaleMessages("Contact Number"),
      dataIndex: "contactnumber",
      key: "contactnumber",
      render: (id, data, idx) => {
        return (
          <p className="number_ltr">
            {data?.contactnumber?.includes("+")
              ? data?.contactnumber
              : `+966-${data?.contactnumber}` || ""}
          </p>
        );
      },
    },

    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Space>
          <ShowForPermission permission="update" module="enq">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="enq">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(record.id)}
              type="edit"
            />
          </ShowForPermission>
        </Space>
      ),
    },
  ];

  const handleRemove = (id) => {
    dispatch({
      type: settingsAction.CHANGE_ENQUIRY_STATUS,
      payload: id,
      callBackAction: () => {
        dispatch({
          type: settingsAction.GET_ENQUIRY_LIST,
          payload: false,
        });
      },
    });
  };
  const handleView = (id) => {
    setvisible(!visible);
    var filter = enquiry_data.filter((user) => user.id === id);
    setSelectedID(id);
    usedForm.setFieldsValue({
      firstname: filter[0].firstname,
      lastname: filter[0].lastname,
      email: filter[0].email,
      subject: filter[0].subject,
      contactnumber: filter[0].contactnumber,
      message: filter[0].content,
    });
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_ENQUIRY_LIST,
      payload: false,
    });
  }, []);

  const onCancel = () => {
    setvisible(!visible);
    usedForm.resetFields();
    setSelectedID(0);
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Modal
          footer={false}
          title={getLocaleMessages("Customer Information")}
          width={500}
          visible={visible}
          onCancel={onCancel}
          destroyOnClose
          className="ant_modal_car"
        >
          <div>
            <Form
              name="normal_login"
              layout="vertical"
              className="login-form"
              form={usedForm}
            >
              <Form.Item
                label={getLocaleMessages("First Name")}
                name="firstname"
              >
                <Input readOnly bordered={false} />
              </Form.Item>
              <Form.Item label={getLocaleMessages("Last Name")} name="lastname">
                <Input readOnly bordered={false} />
              </Form.Item>
              <Form.Item label={getLocaleMessages("Email")} name="email">
                <Input readOnly bordered={false} />
              </Form.Item>
              <Form.Item
                label={getLocaleMessages("Contact Number")}
                name="contactnumber"
              >
                <Input readOnly bordered={false} />
              </Form.Item>
              <Form.Item label={getLocaleMessages("Subject")} name="subject">
                <Input readOnly bordered={false} />
              </Form.Item>
              <Form.Item label={getLocaleMessages("Message")} name="message">
                <Input.TextArea
                  rows={3}
                  placeholder={getLocaleMessages("Message")}
                  readOnly
                  bordered={false}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={8}>
            <Title level={2}>{getLocaleMessages("Enquiry Management")}</Title>
          </Col>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={enquiry_data} />
      </div>
    </LoadingOverlay>
  );
};

export default EnquiryManagement;
