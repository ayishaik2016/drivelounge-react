import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Switch,
  Form,
  Upload,
  Modal,
  Select,
  Typography,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import settingsAction from "./../../../redux/admin/car/actions";
import { uploadRequest } from "./../../../helpers/axiosClient";
import "./../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import { getLocaleMessages } from "redux/helper";

const { Title } = Typography;
const { Option } = Select;

const CarTypeManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { type_data, type_selected } = useSelector((state) => state.CarInfo);
  const [visible, setvisible] = useState(false);
  const [SelectedType, setSelectedType] = useState({});
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <p> {index + 1} </p>,
    },

    {
      title: getLocaleMessages("Type Name"),
      dataIndex: "cartypename",
      key: "cartypename",
    },

    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="type">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="type">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              type="edit"
            />
          </ShowForPermission>
        </div>
      ),
    },
  ];

  const onFinishDetails = (values) => {
    var data = {
      action: "I",
      cartypename: values.cartypename,
    };
    if (SelectedType.id !== undefined) {
      data["id"] = SelectedType.id;
      data["action"] = "U";
    }
    dispatch({
      type: settingsAction.CARTYPE_MANAGEMENT_IUD,
      payload: data,
    });
    setvisible(!visible);
    usedForm.resetFields();
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    const { cartypename, cartypeshortname } = type;
    setvisible(!visible);
    usedForm.setFieldsValue({
      cartypename: cartypename,
      cartypeshortname: cartypeshortname,
    });
  };
  const handleDelete = ({ id }) => {
    dispatch({
      type: settingsAction.REMOVE_CAR_TYPE,
      payload: id,
      callBackAction: (resp) => {
        if (resp) {
          dispatch({
            type: settingsAction.GET_CARTYPE_MANAGEMENT,
            payload: false,
          });
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CARTYPE_MANAGEMENT,
      payload: false,
    });
  }, [visible]);

  return (
    <div className="page-container medium">
      <Modal
        title={
          SelectedType.id !== undefined
            ? getLocaleMessages("Update Car Type")
            : getLocaleMessages("Create Car Type")
        }
        visible={visible}
        centered
        className="ant_modal_car"
        footer={false}
        width={400}
        destroyOnClose
        onCancel={() => setvisible(!visible)}
      >
        <div>
          <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
            <Form.Item
              label={getLocaleMessages("Type Name")}
              name="cartypename"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `${getLocaleMessages(
                    "Please input"
                  )} ${getLocaleMessages("Type Name")}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
            label="Type Short Name"
              name="cartypeshortname"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your short name!",
                },
              ]}
            >
              <Input />
            </Form.Item>             */}
            <div className="button-center">
              <Button type="primary" htmlType="submit">
                {getLocaleMessages("Save")}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Row className="head-filter" justify="space-between" align="middle">
        <Col span={8}>
          <Title level={2}> {getLocaleMessages("Type Management")} </Title>
        </Col>
        <Col>
          <Space style={{ marginBottom: 16 }}>
            <ShowForPermission permission="create" module="type">
              <Button
                onClick={() => {
                  setSelectedType({});
                  usedForm.resetFields();
                  setvisible(!visible);
                }}
                type="primary"
              >
                {getLocaleMessages("Create Car Type")}
              </Button>
            </ShowForPermission>
          </Space>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={type_data} />
    </div>
  );
};

export default CarTypeManagement;
