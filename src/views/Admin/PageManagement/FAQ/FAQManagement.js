import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
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
  Form,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../../helpers/constant";
import settingsAction from "./../../../../redux/admin/pageManagement/actions";
import "./../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Option } = Select;
const { Title } = Typography;

const FAQManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { faqinfo_data, isLoading } = useSelector(
    (state) => state.PageManagament
  );
  const { subLang } = useSelector((state) => state.Auth);
  const [FAQFilter, setFAQFilter] = useState([]);
  const [showFilter, setshowFilter] = useState(false);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, row, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("FAQ Name"),
      dataIndex: "question",
      key: "question",
    },
    {
      title: getLocaleMessages("Sort Order"),
      dataIndex: "sortorder",
      key: "sortorder",
    },

    {
      title: getLocaleMessages("Status"),
      dataIndex: "faqstatus",
      key: "faqstatus",
      render: (id, data) => (
        <Select
          showSearch
          onChange={(e) => handleChangeStatus(data.id, e)}
          defaultValue={[data.faqstatus]}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          autoComplete={"off"}
          placeholder={"Status"}
          dropdownStyle={{ minWidth: "200px" }}
        >
          <Option key={1} value={1}>
            {getLocaleMessages("Active")}
          </Option>
          <Option key={2} value={2}>
            {getLocaleMessages("InActive")}
          </Option>
        </Select>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <span>
          <ShowForPermission permission="update" module="faq">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditFAQ(record.id)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="faq">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteFAQ(record.id)}
              type="remove"
            />
          </ShowForPermission>
        </span>
      ),
    },
  ];

  const handleEditFAQ = (id) => {
    history.push({
      pathname: "faq/update",
      state: { faqid: id },
    });
  };

  const handleChangeStatus = (id, status) => {
    dispatch({
      type: settingsAction.CHANGE_FAQ_STATUS,
      payload: { id: id, status: status },
    });
  };
  const handleDeleteFAQ = (faqid) => {
    dispatch({
      type: settingsAction.REMOVE_FAQ_DETAILS,
      payload: { faqid: faqid },
    });
  };
  const onFormLayoutChange = () => {
    const { name, sortorder } = usedForm.getFieldsValue();
    const filter = {};
    if (name !== undefined && name !== "") {
      filter["question"] = name;
    }
    if (sortorder !== undefined && sortorder !== "") {
      filter["sortorder"] = sortorder;
    }
    let filters = faqinfo_data.filter((props) =>
      Object.entries(filter).every(
        ([key, val]) =>
          !val.length ||
          props[key]
            .toString()
            .toLowerCase()
            ?.trim()
            .includes(val.toLowerCase()?.trim())
      )
    );
    if (filters.length > 0) {
      setFAQFilter(filters);
    }

    if (filters.length == 0) {
      setFAQFilter([]);
    }
    if (
      filter &&
      Object.keys(filter).length === 0 &&
      filter.constructor === Object
    ) {
      setFAQFilter(faqinfo_data);
    }
  };

  useEffect(() => {
    setFAQFilter(faqinfo_data);
  }, [faqinfo_data]);

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const handleCreateFAQ = () => {
    history.push("faq/create");
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_FAQ_INFO,
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
        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={8}>
            {" "}
            <Space>
              <Title level={2}>{getLocaleMessages("FAQ Management")}</Title>
            </Space>
          </Col>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <Button
                onClick={handleFilterShow}
                type="primary"
                icon={<FilterOutlined />}
              >
                {getLocaleMessages("Filter")}
              </Button>
              <ShowForPermission permission="create" module="faq">
                <Button onClick={handleCreateFAQ}>
                  {getLocaleMessages("Create")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>
        {showFilter && (
          <Form
            {...formProps}
            layout="horizontal"
            form={usedForm}
            onValuesChange={() => onFormLayoutChange()}
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item label={getLocaleMessages("FAQ Name")} name="name">
                  <Input placeholder="" allowClear />
                </Form.Item>
              </Col>

              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Sort Order")}
                  name="sortorder"
                >
                  <Input placeholder="" type="number" allowClear />
                </Form.Item>
              </Col>

              {/* <Col span={6} className="inner-content">
                  <Form.Item
                    label={'Status'}
                    name={'faqstatus'}
                    rules={[{ required: true, message: 'Select faq status' }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      autoComplete={'off'}
                      placeholder={''}
                      dropdownStyle={{ minWidth: '200px' }}
                    >
                      <Option key={0} value={0}>All</Option>
                      <Option key={1} value={1}>Active</Option>
                      <Option key={2} value={2}>InActive</Option>
                    </Select>
                  </Form.Item>
                </Col> */}
            </Row>
          </Form>
        )}
        <Table rowKey="id" columns={columns} dataSource={FAQFilter} />
      </div>
    </LoadingOverlay>
  );
};

export default FAQManagement;
