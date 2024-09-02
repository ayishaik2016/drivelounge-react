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

const CMSManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { cmsinfo_data, isLoading } = useSelector(
    (state) => state.PageManagament
  );
  const { subLang } = useSelector((state) => state.Auth);
  //const [CMSFilter, setCMSFilter] = useState({'name': '','sortorder': '', 'status':0})
  const [showFilter, setshowFilter] = useState(false);
  const [CMSFilter, setCMSFilter] = useState([]);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("CMS Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getLocaleMessages("Related Page"),
      dataIndex: "relatedpage",
      key: "relatedpage",
    },
    {
      title: getLocaleMessages("Sort Order"),
      dataIndex: "sortorder",
      key: "sortorder",
    },

    {
      title: getLocaleMessages("Status"),
      dataIndex: "cmsstatus",
      key: "cmsstatus",
      render: (id, data) => (
        <Select
          showSearch
          onChange={(e) => handleChangeStatus(data.id, e)}
          defaultValue={data.cmsstatus}
          allowClear
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
          <ShowForPermission permission="update" module="cms">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditCMS(record.id)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="cms">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCMS(record.cmsid)}
              type="remove"
            />
          </ShowForPermission>
        </span>
      ),
    },
  ];

  const handleEditCMS = (id) => {
    history.push({
      pathname: "cms/update",
      state: { cmsid: id },
    });
  };

  const handleChangeStatus = (id, status) => {
    dispatch({
      type: settingsAction.CHANGE_CMS_STATUS,
      payload: { id: id, status: status, subLang: subLang == "en" ? 1 : 2 },
    });
  };

  const handleDeleteCMS = (cmsid) => {
    dispatch({
      type: settingsAction.REMOVE_CMS_DETAILS,
      payload: { cmsid: cmsid, subLang: subLang == "en" ? 1 : 2 },
    });
  };
  const onFormLayoutChange = () => {
    const { name, sortorder } = usedForm.getFieldsValue();
    const filter = {};
    if (name !== undefined && name !== "") {
      filter["name"] = name;
    }
    if (sortorder !== undefined && sortorder !== "") {
      filter["sortorder"] = sortorder;
    }
    let filters = cmsinfo_data.filter((props) =>
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
      setCMSFilter(filters);
    }

    if (filters.length == 0) {
      setCMSFilter([]);
    }
    if (
      filter &&
      Object.keys(filter).length === 0 &&
      filter.constructor === Object
    ) {
      setCMSFilter(cmsinfo_data);
    }
    // if(filters.length > 0)
    //   setCMSFilter(filters)
    // else
    //   setCMSFilter(cmsinfo_data)
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const handleCreateCMS = () => {
    usedForm.resetFields();
    history.push("cms/create");
  };

  useEffect(() => {
    if (cmsinfo_data !== undefined && cmsinfo_data.length > 0) {
      setCMSFilter(cmsinfo_data);
    }
  }, [cmsinfo_data]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CMS_INFO,
      payload: subLang == "en" ? 1 : 2,
    });
  }, [subLang]);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={8}>
            <Title level={2}>{getLocaleMessages("CMS Management")}</Title>
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
              <ShowForPermission permission="create" module="cms">
                <Button onClick={handleCreateCMS}>
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
                <Form.Item label={getLocaleMessages("CMS Name")} name="name">
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
                    name={'cmsstatus'}
                    rules={[{ required: true, message: 'Select cms status' }]}
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
        {CMSFilter && (
          <Table rowKey="id" columns={columns} dataSource={CMSFilter} />
        )}
      </div>
    </LoadingOverlay>
  );
};

export default CMSManagement;
