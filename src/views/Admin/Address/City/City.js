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
  const [SelectedCityId, setSelectedCityId] = useState(0);
  const [visibleCountry, setvisibleCountry] = useState(false);

  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: getLocaleMessages("City Name"),
      dataIndex: "cityname",
      key: "cityname",
    },
    {
      title: getLocaleMessages("Country Name"),
      dataIndex: "countryname",
      key: "countryname",
    },
    {
      title: getLocaleMessages("Show User"),
      dataIndex: "showdashboard",
      key: "showdashboard",
      render: (showdashboard, row) => (
        <Switch
          onChange={(e) => handleDashboardStatus(e, row)}
          defaultChecked={showdashboard}
        />
      ),
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "citystatus",
      key: "citystatus",
      render: (citystatus, row) => (
        <Switch
          onChange={(e) => handleStatus(e, row)}
          defaultChecked={citystatus == 1 ? true : false}
        />
      ),
    },
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
    var data = {
      action: "I",
      cityname: values.cityname,
      countryid: values.countryid,
      cityimage: values.cityimage,
      showdashboard: values.showdashboard,
    };
    // if (city_selected.id !== undefined) {
    //   data["id"] = city_selected.id;
    //   data["action"] = "U";
    // }
    if (SelectedCityId !== undefined && SelectedCityId > 0) {
      data["id"] = SelectedCityId;
      data["action"] = "U";
    }
    dispatch({
      type: settingsAction.CITY_MANAGEMENT_IUD,
      payload: data,
    });
    setvisible(!visible);
  };

  const handleEdit = (city) => {
    const { cityname, countryid, cityimage, showdashboard } = city;
    setSelectedCityId(city.id);
    setvisible(!visible);
    usedForm.setFieldsValue({
      cityname: cityname,
      countryid: countryid,
      cityimage: cityimage,
      showdashboard: showdashboard,
    });
  };
  const handleDelete = (city) => {
    dispatch({
      type: settingsAction.REMOVE_CITY_MANAGEMENT,
      payload: { id: city.id },
      callBackAction: () => {
        dispatch({
          type: settingsAction.GET_CITY_MANAGEMENT,
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

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_COUNTRY_LIST,
      payload: false,
    });
    dispatch({
      type: settingsAction.GET_CITY_MANAGEMENT,
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
          title={getLocaleMessages("Create City")}
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
                name="cityname"
                label={getLocaleMessages("City Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("City Name")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="countryid"
                label={getLocaleMessages("Country Name")}
                rules={[
                  {
                    required: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Country Name")}`,
                  },
                ]}
                help={
                  <a onClick={() => setvisibleCountry(!visibleCountry)}>
                    {getLocaleMessages("Add")}
                  </a>
                }
              >
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  autoComplete={"off"}
                  placeholder={getLocaleMessages("Country Name")}
                  dropdownStyle={{ minWidth: "200px" }}
                >
                  {country_data &&
                    country_data.map((country) => {
                      return (
                        <Option key={country.id} value={country.id}>
                          {country.countryname}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>

              <div className="upload_position">
                <Form.Item
                  name="cityimage"
                  label={getLocaleMessages("City Image")}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `${getLocaleMessages(
                        "Please input"
                      )} ${getLocaleMessages("City Image")}`,
                    },
                  ]}
                >
                  <Input
                    disabled
                    placeholder={getLocaleMessages("City Image")}
                  />
                </Form.Item>
                <Upload customRequest={onChange} icon={<UploadOutlined />}>
                  <Button icon={<UploadOutlined />}></Button>
                </Upload>{" "}
              </div>

              <Form.Item name="showdashboard" valuePropName="checked">
                <Checkbox>{getLocaleMessages("Show on home page")}</Checkbox>
              </Form.Item>

              <div className="button-center">
                <Button type="primary" htmlType="submit">
                  {getLocaleMessages("Save")}
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
            <Title level={2}>{getLocaleMessages("City Management")}</Title>
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
                  {getLocaleMessages("Create City")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>

        <Table rowKey="id" columns={columns} dataSource={city_data} />
      </div>
    </LoadingOverlay>
  );
};

export default CityComponent;
