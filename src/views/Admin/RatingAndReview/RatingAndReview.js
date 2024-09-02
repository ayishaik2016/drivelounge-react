import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Select,
  Form,
  Rate,
  Modal,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import ratingsAction from "./../../../redux/admin/ratingsManagement/actions";
import carAction from "./../../../redux/admin/car/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Option } = Select;

const RatingAndReview = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { ratingList, isLoading } = useSelector((state) => state.Rating);
  const { carmanagement_data, agencyinfo } = useSelector(
    (state) => state.CarInfo
  );
  const [showModel, setshowModel] = useState(false);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Customer Name"),
      dataIndex: "username",
      key: "username",
      render: (username) => <span>{username ? username : "Unknown"}</span>,
    },
    {
      title: getLocaleMessages("Rating"),
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: getLocaleMessages("Review"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: getLocaleMessages("Comment"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: getLocaleMessages("Agent Name"),
      dataIndex: "agentname",
      key: "agentname",
    },
    {
      title: getLocaleMessages("Image"),
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <img
          height="40px"
          width="60px"
          src={`https://api.drivelounge.com/${url}`}
        />
      ),
    },
    {
      title: getLocaleMessages("Brand"),
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: getLocaleMessages("Model"),
      dataIndex: "model",
      key: "model",
    },
    {
      title: getLocaleMessages("Created Date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => (
        <span>{format(new Date(created_at), "dd/MM/yyyy hh:mm a")}</span>
      ),
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "isreview",
      key: "isreview",
      render: (id, status) => (
        <ShowForPermission permission="update" module="rate">
          <Select
            showSearch
            onChange={(e) => handleChangeStatus(status.id, e)}
            defaultValue={[status.isreview]}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            autoComplete={"off"}
            placeholder={"Status"}
            dropdownStyle={{ minWidth: "200px" }}
          >
            <Option key={0} value={0}>
              {getLocaleMessages("Pending")}
            </Option>
            <Option key={1} value={1}>
              {getLocaleMessages("Accepted")}
            </Option>
            <Option key={2} value={2}>
              {getLocaleMessages("Rejected")}
            </Option>
          </Select>{" "}
        </ShowForPermission>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <ShowForPermission permission="remove" module="rate">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleRemove(record.id)}
            type="edit"
          />
        </ShowForPermission>
      ),
    },
  ];

  const handleChangeStatus = (id, event) => {
    dispatch({
      type: ratingsAction.STATUS_RATING_LIST,
      payload: { id: id, isreview: event },
    });
  };
  const handleRemove = (id) => {
    dispatch({
      type: ratingsAction.REMOVE_RATING_LIST,
      payload: id,
      callBackAction: () => {
        dispatch({
          type: ratingsAction.GET_RATING_LIST,
          payload: false,
        });
      },
    });
  };
  const onFinish = (values) => {
    dispatch({
      type: ratingsAction.CREATE_RATING_LIST,
      payload: { ...values, userid: 0 },
    });
  };

  const handleModel = () => {
    usedForm.resetFields();
    setshowModel(!showModel);
  };

  const handleRate = () => {
    setshowModel(!showModel);
  };

  useEffect(() => {
    dispatch({
      type: carAction.GET_AGENCY_INFO,
      payload: false,
    });
    dispatch({
      type: carAction.GET_CAR_MANAGEMENT_INFO,
      payload: true,
    });
    dispatch({
      type: ratingsAction.GET_RATING_LIST,
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
          footer={false}
          title={getLocaleMessages("Create Rating & Review")}
          centered
          visible={showModel}
          onCancel={() => setshowModel(!showModel)}
          destroyOnClose
        >
          <Row gutter={12}>
            <Form
              name="validate_other"
              form={usedForm}
              {...formProps}
              onFinish={onFinish}
            >
              <Form.Item
                name="agentid"
                label={getLocaleMessages("Agency Name")}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Please select the agency"),
                  },
                ]}
              >
                <Select
                  placeholder={getLocaleMessages("Please select the agency")}
                >
                  {agencyinfo &&
                    agencyinfo.map((value) => {
                      return (
                        <Option key={value.id} value={value.id}>
                          {value.firstname + ", " + value.lastname}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>

              <Form.Item
                name="carid"
                label={getLocaleMessages("Car Name")}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: getLocaleMessages("Please select the car number"),
                  },
                ]}
              >
                <Select
                  placeholder={getLocaleMessages(
                    "Please select the car number"
                  )}
                >
                  {carmanagement_data &&
                    carmanagement_data.map((value) => {
                      return (
                        <Option key={value.carid} value={value.carid}>
                          {value.carno}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>

              <Form.Item name="rating" label={getLocaleMessages("Rate")}>
                <Rate />
              </Form.Item>

              <Form.Item
                name="title"
                label={getLocaleMessages("Title")}
                rules={[
                  {
                    required: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Title")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label={getLocaleMessages("Comments")}
                rules={[
                  {
                    required: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Comments")}`,
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit" onClick={handleRate}>
                  {getLocaleMessages("Submit")}
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Modal>
        <Row className="head-filter">
          <Col span={20}>
            <Space>
              <h2>{getLocaleMessages("Rating & Review")}</h2>
            </Space>
          </Col>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={ratingList} />
      </div>
    </LoadingOverlay>
  );
};

export default RatingAndReview;
