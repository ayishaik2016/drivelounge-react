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
  message,
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

const BrandManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { brand_data, brand_selected } = useSelector((state) => state.CarInfo);
  const [visible, setvisible] = useState(false);
  const [SelectedBrand, setSelectedBrand] = useState({});
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <p> {index + 1} </p>,
    },
    {
      title: getLocaleMessages("Image"),
      dataIndex: "carbrandimage",
      key: "carbrandimage",
      render: (carbrandimage) => (
        <img
          height="40px"
          width="60px"
          src={`https://api.drivelounge.com/${carbrandimage}`}
        />
      ),
    },
    {
      title: getLocaleMessages("Make"),
      dataIndex: "carbrandname",
      key: "carbrandname",
    },

    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="carbarnd">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="carbarnd">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              type="edit"
            ></Button>
          </ShowForPermission>
        </div>
      ),
    },
  ];

  const [ImageName, setImageName] = useState({});
  const onChange = ({ file, onSuccess, onError }) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        usedForm.setFieldsValue({ carbrandimage: imageName });
        setImageName({
          name: imageName,
          status: "done",
          url: `https://api.drivelounge.com/${imageName}`,
        });
        onSuccess("ok");
      })
      .catch((err) => {
        onError({ err });
        message.error(
          err.message?.includes("500")
            ? getLocaleMessages("File format not supported")
            : err.message
        );
        console.log("ERROR", err);
      });
  };

  const onRemove = () => {
    usedForm.setFieldsValue({ carbrandimage: "" });
    setImageName({
      name: "",
      status: "done",
    });
  };

  const onFinishDetails = (values) => {
    var data = {
      action: "I",
      carbrandname: values.carbrandname,
      carbrandshortname: values.carbrandname,
      carbrandimage: values.carbrandimage,
    };
    if (SelectedBrand.id !== undefined) {
      data["id"] = SelectedBrand.id;
      data["action"] = "U";
    }
    dispatch({
      type: settingsAction.BRAND_MANAGEMENT_IUD,
      payload: data,
    });
    setvisible(!visible);
    usedForm.resetFields();
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    const { carbrandname, carbrandshortname, carbrandimage } = brand;
    setvisible(!visible);
    usedForm.setFieldsValue({
      carbrandname: carbrandname,
      // carbrandshortname: carbrandshortname,
      carbrandimage: carbrandimage,
    });
    setImageName({
      name: carbrandimage,
      status: "done",
      url: `https://api.drivelounge.com/${carbrandimage}`,
    });
  };
  const handleDelete = (brand) => {
    dispatch({
      type: settingsAction.REMOVE_CAR_BRAND,
      payload: brand.id,
      callBackAction: (resp) => {
        if (resp) {
          dispatch({
            type: settingsAction.GET_BRAND_MANAGEMENT,
            payload: false,
          });
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_BRAND_MANAGEMENT,
      payload: false,
    });
  }, [visible]);

  return (
    <div className="page-container medium">
      <Modal
        title={
          SelectedBrand.id !== undefined
            ? getLocaleMessages("Update")
            : getLocaleMessages("Create Brand")
        }
        visible={visible}
        centered
        footer={false}
        className="ant_modal_car"
        width={450}
        destroyOnClose
        onCancel={() => setvisible(!visible)}
      >
        <div>
          <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
            <Form.Item
              label={getLocaleMessages("Make")}
              name="carbrandname"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `${getLocaleMessages(
                    "Please input"
                  )} ${getLocaleMessages("Brand Name")}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
            label="Brand Short Name"
              name="carbrandshortname"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your short name!",
                },
              ]}
            >
              <Input />
            </Form.Item> */}

            <div className="upload_position">
              <Form.Item
                label={getLocaleMessages("Brand Logo")}
                name="carbrandimage"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Brand Logo")}`,
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Upload
                listType="picture"
                fileList={ImageName.name !== "" ? [ImageName] : []}
                customRequest={onChange}
                onRemove={onRemove}
                icon={<UploadOutlined />}
              >
                <Button icon={<UploadOutlined />}> </Button>
              </Upload>
            </div>

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
          <Title level={2}> {getLocaleMessages("Make")} </Title>
        </Col>
        <Col>
          <Space style={{ marginBottom: 16 }}>
            <ShowForPermission permission="create" module="carbarnd">
              <Button
                onClick={() => {
                  setSelectedBrand({});
                  setImageName({});
                  usedForm.resetFields();
                  setvisible(!visible);
                }}
                type="primary"
              >
                {getLocaleMessages("Create Brand")}
              </Button>
            </ShowForPermission>
          </Space>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={brand_data} />
    </div>
  );
};

export default BrandManagement;
