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
  Radio,
  Form,
  DatePicker,
  Modal,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Formatcurrency, formProps, DEFAULT_CURRENCY } from "./../../../helpers/constant";
import couponAction from "./../../../redux/admin/coupon/actions";
import "./../../../assets/css/adminStyle.css";
import { getLocaleMessages, getLocalDataType } from "./../../../redux/helper";
import format from "date-fns/format";
import { compareAsc, endOfDay } from "date-fns";
import moment from "moment";
import { ShowForPermission } from "redux/userPermissions";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const { Title } = Typography;
LoadingOverlay.propTypes = undefined;

const CouponManagement = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const {
    couponList,
    couponCode,
    userList,
    agencyList,
    isLoading,
    coupon,
  } = useSelector((state) => state.Coupon);
  const [viewIconClicked, setViewIconClicked] = useState(false);
  const [SelectedCoupon, setSelectedCoupon] = useState({});
  const [UserList, setUserList] = useState([]);
  const [AgencyList, setAgencyList] = useState([]);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (curValue, List, index) => <span>{index + 1}</span>,
    },
    {
      title: getLocaleMessages("Coupon Code"),
      dataIndex: "couponcode",
      key: "couponcode",
    },
    {
      title: getLocaleMessages("Coupon Min Cart Value"),
      dataIndex: "minvalue",
      key: "minvalue",
      render: (minvalue) => (
        <span>{`${Formatcurrency(minvalue)} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
      ),
    },
    {
      title: `${getLocaleMessages("Coupon Value")} %`,
      dataIndex: "couponvalue",
      key: "couponvalue",
      // ${getLocaleMessages("SAR")}
      render: (couponvalue) => <span>{`${couponvalue}`}</span>,
    },
    {
      title: getLocaleMessages("Coupon Start"),
      dataIndex: "startdate",
      key: "startdate",
      render: (startdate) => (
        <span>
          {startdate !== undefined
            ? format(new Date(startdate), "MM/dd/yyyy")
            : format(new Date(), "MM/dd/yyyy")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Coupon End"),
      dataIndex: "expirydate",
      key: "expirydate",
      render: (expirydate) => (
        <span>
          {expirydate !== undefined
            ? format(new Date(expirydate), "MM/dd/yyyy")
            : format(new Date(), "MM/dd/yyyy")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "value",
      key: "value",
      render: (id, data) => <span>{handleCouponStatus(data.expirydate)}</span>,
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="cop">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            />
          </ShowForPermission>
          <Space />
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            type="edit"
          />
          <Space />
          <ShowForPermission permission="remove" module="cop">
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

  const handleCouponStatus = (expirydate) => {
    let result = getLocaleMessages("Expired");
    if (compareAsc(new Date(), new Date(expirydate)) < 0) {
      result = getLocaleMessages("Active");
    }
    return result;
  };

  const handleEdit = (data) => {
    dispatch({
      type: couponAction.GET_COPON_BY_ID,
      payload: { id: data.id },
      callBackAction: (resp) => {
        if (resp?.status < 400) {
          setViewIconClicked(false);
          setModalVisible(true);
        }
      },
    });
  };

  const handleView = (data) => {
    dispatch({
      type: couponAction.GET_COPON_BY_ID,
      payload: { id: data.id },
      callBackAction: (resp) => {
        if (resp?.status < 400) {
          setViewIconClicked(true);
          setModalVisible(true);
        }
      },
    });
  };

  useEffect(() => {
    if (coupon !== undefined && coupon !== null) {
      if (Object.keys(coupon)?.length > 0) {
        //setModalVisible(!modalVisible);
        let filter = [coupon];
        if (filter.length > 0) {
          setSelectedCoupon(filter[0]);
          setIsAllAgencySelected(filter[0].isallagent);
          setIsAllUserSelected(filter[0].isalluser);
          usedForm.setFieldsValue({
            couponcode: filter[0].couponcode,
            minvalue: filter[0].minvalue,
            couponvalue: filter[0].couponvalue,
            rangepicker: [
              moment(filter[0].startdate),
              moment(filter[0].expirydate),
            ],
            status: filter[0].status == 1 ? true : false,
            agents:
              filter[0].agents !== null
                ? filter[0].agents.split`,`.map((x) => +x)
                : [],
            users:
              filter[0].users !== null
                ? filter[0].users.split`,`.map((x) => +x)
                : [],
          });
          setAgencyList(
            filter[0].agents !== null
              ? filter[0].agents.split`,`.map((x) => +x)
              : []
          );
          setUserList(
            filter[0].users !== null
              ? filter[0].users.split`,`.map((x) => +x)
              : []
          );
        }
      }
    }
  }, [coupon]);

  const handleDelete = (data) => {
    dispatch({
      type: couponAction.REMOVE_COUPON,
      payload: { id: data.id, isagency: data.isallagent },
      callBackAction: (resp) => {
        if (resp?.status < 400) {
          dispatch({
            type: couponAction.GET_COUPON_LIST,
            payload: false,
          });
        }
      },
    });
  };

  const handleAgencySelect = (values) => {
    setAgencyList(values);
    usedForm.setFieldsValue({
      agents: values,
    });
  };

  const handleUserSelect = (values) => {
    setUserList(values);
    usedForm.setFieldsValue({
      users: values,
    });
  };
  const [IsAllAgencySelected, setIsAllAgencySelected] = useState(true);
  const handleAllAgency = (e) => {
    setIsAllAgencySelected(e.target.value);
    usedForm.setFieldsValue({ isallagent: e.target.value });
  };

  const [IsAllUserSelected, setIsAllUserSelected] = useState(true);
  const handleAllUser = (e) => {
    setIsAllUserSelected(e.target.value);
    usedForm.setFieldsValue({ isalluser: e.target.value });
  };

  const [modalVisible, setModalVisible] = useState(false);

  const onFinish = (values) => {
    let _userlist = [];
    if (!IsAllUserSelected) {
      UserList &&
        UserList.map((id) => {
          userList.map((user) => {
            if (user.id == id) {
              _userlist.push(user);
            }
          });
        });
    } else {
      _userlist = userList;
    }
    if (values.couponVal > 20) {
      message.warn(
        getLocaleMessages("Coupon value cannot be greater than 20%")
      );
      return;
    }

    if (!values?.isalluser) {
      if (_userlist?.length <= 0) {
        message.error(getLocaleMessages("Please Select Users from the list"));
        return;
      }
    }
    if (!values?.isallagent) {
      if (AgencyList?.length <= 0) {
        message.error(getLocaleMessages("Please Select Agents from the list"));
        return;
      }
    }

    let data = {
      action: SelectedCoupon.id !== undefined ? "U" : "I",
      id: SelectedCoupon.id,
      couponcode: values.couponcode,
      couponvalue: values.couponvalue,
      startdate: values.rangepicker[0],
      expirydate: values.rangepicker[1],
      minvalue: values.minvalue,
      isallagent: IsAllAgencySelected,
      agentslist: AgencyList,
      isalluser: IsAllUserSelected,
      userslist: _userlist,
    };
    dispatch({
      type: couponAction.CREATE_NEW_COUPON,
      payload: data,
      callBackAction: (resp) => {
        if (resp?.status < 400) {
          setModalVisible(false);
          dispatch({
            type: couponAction.GET_COUPON_LIST,
            payload: false,
          });
        }
      },
    });
    setViewIconClicked(false);
    setIsAllAgencySelected(true);
    setIsAllUserSelected(true);
  };

  const disabledDate = (current) => {
    let date = new Date(current);
    return new Date() > endOfDay(date);
  };

  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: getLocaleMessages("Please select valid util!"),
      },
    ],
  };

  const handleCreate = () => {
    usedForm.resetFields();
    setSelectedCoupon({});
    setViewIconClicked(false);
    setModalVisible(true);
    // handleGenerateCode();
  };

  useEffect(() => {
    dispatch({
      type: couponAction.GET_USERS_AGENCY_LIST,
      payload: false,
    });
    dispatch({
      type: couponAction.GET_COUPON_LIST,
      payload: false,
    });
  }, []);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Modal
          className="ant_modal_car"
          centered
          title={getLocaleMessages("Coupon")}
          visible={modalVisible}
          onOk={() => setModalVisible(false)}
          onCancel={() => {
            setModalVisible(false);
            setIsAllAgencySelected(true);
            setIsAllUserSelected(true);
            setViewIconClicked(false);
            dispatch({
              type: couponAction.GET_COUPON_BY_ID__FAILURE,
            });
            usedForm.resetFields();
            setUserList([]);
            setAgencyList([]);
          }}
          width={480}
          footer={false}
        >
          <Form
            form={usedForm}
            {...formProps}
            onFinish={onFinish}
            initialValues={{
              couponvalue: 0,
              minvalue: 0,
              isallagent: true,
              isalluser: true,
              agents: [],
              users: [],
            }}
          >
            <Form.Item
              className="coupon-disabled"
              label={getLocaleMessages("Coupon Code")}
              name={"couponcode"}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `${getLocaleMessages(
                    "Please input"
                  )} ${getLocaleMessages("Coupon Code")}`,
                },
              ]}
              // help={<a onClick={handleGenerateCode}>Generate coupon code here</a>}
            >
              <Input
                disabled={viewIconClicked}
                style={{
                  "& .ant-input-disabled": {
                    color: "black",
                  },
                }}
              />
            </Form.Item>

            <Form.Item
              className="coupon-disabled"
              label={getLocaleMessages("Coupon Min Cart Value")}
              name={"minvalue"}
              rules={[
                {
                  required: true,
                  message: `${getLocaleMessages(
                    "Please input"
                  )} ${getLocaleMessages("Coupon Min Cart Value")}`,
                },
              ]}
            >
              <Input type="number" disabled={viewIconClicked} />
            </Form.Item>
            <Form.Item
              className="coupon-disabled"
              label={`${getLocaleMessages("Coupon Value")} %`}
              name={"couponvalue"}
              rules={[
                {
                  required: true,
                  message: `${getLocaleMessages(
                    "Please input"
                  )} ${getLocaleMessages("Coupon Value")} %`,
                },
              ]}
            >
              <Input
                type="number"
                disabled={viewIconClicked}
                onChange={(e) => {
                  let couponVal = e.target.value;
                  if (couponVal > 20) {
                    message.warn(
                      getLocaleMessages(
                        "Coupon value cannot be greater than 20%"
                      )
                    );
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label={getLocaleMessages("Valid Date")}
              name="rangepicker"
              {...rangeConfig}
            >
              <RangePicker
                className="coupon-disabled"
                disabled={viewIconClicked}
                disabledDate={disabledDate}
                placeholder={[
                  `${getLocaleMessages("Start Date")}`,
                  `${getLocaleMessages("End Date")}`,
                ]}
              />
            </Form.Item>

            {getLocalDataType() === "admin" && (
              <Space style={{ width: "100%" }} direction="vertical">
                <Form.Item
                  label={getLocaleMessages("Is All Agency")}
                  name={"isallagent"}
                >
                  <Radio.Group
                    className="coupon-disabled"
                    onChange={handleAllAgency}
                    value={IsAllAgencySelected}
                    disabled={viewIconClicked}
                  >
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

                  {!IsAllAgencySelected && (
                    <Select
                      mode="multiple"
                      name="agents"
                      size="large"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder={getLocaleMessages("Please select agents")}
                      onChange={handleAgencySelect}
                      disabled={viewIconClicked}
                      value={usedForm.getFieldValue("agents") || []}
                    >
                      {agencyList &&
                        agencyList.map((agency) => {
                          return (
                            <Option key={agency.id} value={agency.id}>
                              {`${agency.firstname}, ${agency.lastname}`}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
              </Space>
            )}

            <Form.Item
              label={getLocaleMessages("Is All Users")}
              name={"isalluser"}
            >
              <Radio.Group
                className="coupon-disabled"
                onChange={handleAllUser}
                value={IsAllUserSelected}
                disabled={viewIconClicked}
              >
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

              {!IsAllUserSelected && (
                <Select
                  className="coupon-disabled"
                  name="users"
                  mode="multiple"
                  size="large"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder={getLocaleMessages("Please select users")}
                  onChange={handleUserSelect}
                  disabled={viewIconClicked}
                  value={usedForm.getFieldValue("users") || []}
                >
                  {userList &&
                    userList.map((user) => {
                      return (
                        <Option key={user.id} value={user.id}>
                          {user.username}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={getLocaleMessages("Status")}
              name={"status"}
              rules={[
                { required: true, message: getLocaleMessages("Select status") },
              ]}
            >
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                autoComplete={"off"}
                placeholder={""}
                dropdownStyle={{ minWidth: "200px" }}
                disabled={viewIconClicked}
              >
                <Option value={true}>{getLocaleMessages("Active")}</Option>
                <Option value={false}>{getLocaleMessages("InActive")}</Option>
              </Select>
            </Form.Item>

            <div className="button-center">
              {!viewIconClicked && (
                <Button type="primary" htmlType="submit" className="save-btn">
                  {SelectedCoupon.id == undefined &&
                    getLocaleMessages("Create")}{" "}
                  {!viewIconClicked &&
                    SelectedCoupon.id > 0 &&
                    getLocaleMessages("Update")}
                </Button>
              )}
            </div>
          </Form>
        </Modal>

        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            <Title level={2}>{getLocaleMessages("Coupon Management")}</Title>
          </Col>
          <Col>
            <ShowForPermission permission="create" module="cop">
              <Button onClick={handleCreate} type="primary">
                {getLocaleMessages("Create")}
              </Button>
            </ShowForPermission>
          </Col>
        </Row>

        <Table rowKey="id" columns={columns} dataSource={couponList} />
      </div>
    </LoadingOverlay>
  );
};
export default CouponManagement;
