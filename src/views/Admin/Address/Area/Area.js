import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  Switch,
  Modal,
  Form,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formProps } from "../../../../helpers/constant";
import settingsAction from "../../../../redux/admin/address/actions";
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Option } = Select;
const { Title } = Typography;

const AreaComponent = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { area_data, city_data, country_data, isLoading } = useSelector(
    (state) => state.Address
  );
  const [visible, setvisible] = useState(false);
  const [SelectedAreaId, setSelectedAreaId] = useState(0);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, idx, i) => <p>{i + 1}</p>,
    },
    {
      title: getLocaleMessages("Area Name"),
      dataIndex: "areaname",
      key: "areaname",
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
      title: getLocaleMessages("Status"),
      dataIndex: "areastatus",
      key: "areastatus",
      render: (areastatus, row, idx) => (
        <Switch
          onChange={(e) => handleAreaStatus(e, row.id)}
          defaultChecked={row.areastatus == 1 ? true : false}
        />
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="area">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="area">
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

  const handleEdit = (id) => {
    var filter = area_data.filter((area) => area.id == id);
    if (filter.length) {
      setvisible(!visible);
      setSelectedAreaId(filter[0].id);
      usedForm.setFieldsValue({ areaname: "fadfadadfa" });
      usedForm.setFieldsValue({
        areaname: filter[0].areaname,
        cityid: filter[0].cityid,
        countryid: filter[0].countryid,
      });
    }
  };

  const handleDelete = (area) => {
    dispatch({
      type: settingsAction.REMOVE_AREA_MANAGEMENT,
      payload: { id: area.id },
    });
  };

  const handleAreaStatus = (event, id) => {
    dispatch({
      type: settingsAction.CHANGE_AREA_MANAGEMENT,
      payload: { id: id, areastatus: event },
    });
  };

  const handleCreate = (e) => {
    setvisible(!visible);
    usedForm.resetFields();
    setSelectedAreaId(0);
  };

  const onFinishDetails = (values) => {
    var data = {
      action: "I",
      areaname: values.areaname,
      cityid: values.cityid,
      countryid: values.countryid,
    };
    if (SelectedAreaId !== undefined && SelectedAreaId > 0) {
      data["id"] = SelectedAreaId;
      data["action"] = "U";
    }
    dispatch({
      type: settingsAction.AREA_MANAGEMENT_IUD,
      payload: data,
    });
    setvisible(!visible);
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_AREA_MANAGEMENT,
      payload: false,
    });
    dispatch({
      type: settingsAction.GET_COUNTRY_LIST,
      payload: false,
    });
    dispatch({
      type: settingsAction.GET_CITY_MANAGEMENT,
      payload: false,
    });
  }, [visible]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Modal
          title={
            SelectedAreaId > 0
              ? getLocaleMessages("Update Area")
              : getLocaleMessages("Create Area")
          }
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
                name="areaname"
                label={getLocaleMessages("Area Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: getLocaleMessages("Please input your area name"),
                  },
                ]}
              >
                <Input placeholder={getLocaleMessages("Area Name")} />
              </Form.Item>
              <Row gutter={30}>
                <Col span={24}>
                  <Form.Item
                    name="cityid"
                    label={getLocaleMessages("City Name")}
                    rules={[
                      {
                        required: true,
                        message: `${getLocaleMessages(
                          "Select"
                        )} ${getLocaleMessages("City Name")}`,
                      },
                    ]}
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
                      placeholder={getLocaleMessages("City Name")}
                      dropdownStyle={{ minWidth: "200px" }}
                    >
                      {city_data &&
                        city_data.map((city) => {
                          return (
                            <Option key={city.id} value={city.id}>
                              {city.cityname}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={30}>
                <Col span={24}>
                  <Form.Item
                    name="countryid"
                    label={getLocaleMessages("Country Name")}
                    rules={[
                      {
                        required: true,
                        message: `${getLocaleMessages(
                          "Select"
                        )} ${getLocaleMessages("Country Name")}`,
                      },
                    ]}
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
                      placeholder={"Country Name"}
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
                </Col>
              </Row>

              <div className="button-center">
                <Button type="primary" htmlType="submit">
                  {getLocaleMessages("Save")}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            {" "}
            <Space>
              <Title level={2}>{getLocaleMessages("Area Management")}</Title>
            </Space>
          </Col>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <ShowForPermission permission="create" module="area">
                <Button onClick={handleCreate} type="primary">
                  {getLocaleMessages("Create")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={area_data} />
      </div>
    </LoadingOverlay>
  );
};

export default AreaComponent;
