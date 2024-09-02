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
  Checkbox,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "../../../../redux/admin/address/actions";
import { uploadRequest } from "../../../../helpers/axiosClient";
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Title } = Typography;
const { Option } = Select;
const CityComponent = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const [usedCForm] = Form.useForm();
  const { city_data, country_data, isLoading } = useSelector(
    (state) => state.Address
  );
  const [visible, setvisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [SelectedCityId, setSelectedCityId] = useState(0);
  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: getLocaleMessages("Country Name"),
      dataIndex: "countryname",
      key: "countryname",
    },
    {
      title: getLocaleMessages("Country Short Name"),
      dataIndex: "countryshortname",
      key: "countryshortname",
    },
    // {
    //   title: getLocaleMessages("Status"),
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     return (
    //       <Switch
    //         onChange={(e) => handleStatus(e, status)}
    //         defaultChecked={status === 1 ? true : false}
    //       />
    //     );
    //   },
    // },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="city">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            ></Button>
          </ShowForPermission>
          <ShowForPermission permission="remove" module="city">
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

  const [ImageName, setImageName] = useState("");
  const onChange = ({ file, onSuccess, onError }) => {
    let form = new FormData();
    form.append("file", file);
    uploadRequest("public/upload", form)
      .then((res) => {
        let image = res.data[0].data;
        let imageName = image.filePath.split("__uploads/")[1];
        setImageName(imageName);
        usedForm.setFieldsValue({ cityimage: imageName });
        onSuccess("ok");
      })
      .catch((err) => {
        onError({ err });
      });
  };

  const onFinishDetails = (values) => {
    if (Object?.keys(selectedCountry)?.length === 0) {
      let data = {
        countryname: values.countryname,
        countryshortname: values.countryshortname,
      };
      dispatch({
        type: settingsAction.CREATE_NEW_COUNTRY,
        payload: data,
      });
      setvisible(!visible);
      setSelectedCountry({});
    } else {
      let data = {
        countryname: usedForm?.getFieldValue("countryname"),
        countryshortname: usedForm?.getFieldValue("countryshortname"),
        id: selectedCountry?.id,
      };
      dispatch({
        type: settingsAction.UPDATE_COUNTRY,
        payload: data,
      });
      setvisible(false);
      setSelectedCountry({});
    }
  };

  const handleEdit = (city) => {
    setSelectedCountry(city);
    const { countryname, countryshortname } = city;
    setSelectedCityId(city.id);
    setvisible(!visible);
    usedForm.setFieldsValue({
      countryname: countryname,
      countryshortname: countryshortname,
    });
  };

  const handleDelete = (country) => {
    dispatch({
      type: settingsAction.DELETE_COUNTRY,
      payload: { id: country.id },
      callBackAction: (resp) => {
        dispatch({
          type: settingsAction.GET_COUNTRY_LIST,
          payload: false,
        });
      },
    });
  };

  const handleStatus = (check, { id }) => {
    dispatch({
      type: settingsAction.CHANGE_CITY_MANAGEMENT_STATUS,
      payload: { id: id, status: check },
    });
  };

  const handleDashboardStatus = (check, { id }) => {
    dispatch({
      type: settingsAction.CHANGE_CITY_MANAGEMENT_DASHBOARD,
      payload: { id: id, status: check },
    });
  };

  const [visibleCountry, setvisibleCountry] = useState(false);

  const handleNewCounry = (values) => {
    let data = {
      countryname: values.countryname,
      countryshortname: values.countryshortname,
    };
    dispatch({
      type: settingsAction.CREATE_NEW_COUNTRY,
      payload: data,
    });
    setvisibleCountry(!visibleCountry);
  };

  const handlecountryEdit = () => {};

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_COUNTRY_LIST,
      payload: false,
    });
  }, [visible, visibleCountry]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Modal
          title={getLocaleMessages(
            usedForm.getFieldValue("countryname") !== undefined
              ? "Update Country"
              : "Create Country"
          )}
          visible={visible}
          centered
          footer={false}
          width={480}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisible(!visible)}
        >
          <div>
            <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
              <Form.Item
                name="countryname"
                label={getLocaleMessages("Country Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Country Name")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="countryshortname"
                label={getLocaleMessages("Country Short Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Country Short Name")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="button-center">
                <Button type="primary" htmlType="submit">
                  {usedForm?.getFieldValue("countryname") !== undefined
                    ? "Update"
                    : getLocaleMessages("Save")}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Modal
          title={getLocaleMessages("Create Country")}
          visible={visibleCountry}
          centered
          footer={false}
          width={400}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisibleCountry(!visibleCountry)}
        >
          <div>
            <Form form={usedCForm} onFinish={handleNewCounry} {...formProps}>
              <Form.Item
                name="countryname"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Country Name")}`,
                  },
                ]}
              >
                <Input placeholder={getLocaleMessages("Country Name")} />
              </Form.Item>
              <Form.Item
                name="countryshortname"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Country Short Name")}`,
                  },
                ]}
              >
                <Input placeholder={getLocaleMessages("Country Short Name")} />
              </Form.Item>

              <div className="button-center">
                <Button type="primary" htmlType="submit">
                  {getLocaleMessages("Save")}
                </Button>
                <Button
                  onClick={() => setvisibleCountry(!visibleCountry)}
                  type="primary"
                >
                  {getLocaleMessages("Cancel")}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={8}>
            <Title level={2}>{getLocaleMessages("Country Management")}</Title>
          </Col>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <ShowForPermission permission="create" module="city">
                <Button
                  onClick={() => {
                    usedForm.resetFields();
                    setvisible(!visible);
                    setSelectedCityId(0);
                  }}
                  type="primary"
                >
                  {getLocaleMessages("Create Country")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>

        <Table rowKey="id" columns={columns} dataSource={country_data} />
      </div>
    </LoadingOverlay>
  );
};

export default CityComponent;
