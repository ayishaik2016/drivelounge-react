import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "redux/store";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Select,
  Form,
  Typography,
} from "antd";
import {
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/agency/actions";
import format from "date-fns/format";
import "./../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import MyCsvLink from "../../../components/shared/ExportCsv";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
import { formatPhoneNumberIntl } from "react-phone-number-input";
LoadingOverlay.propTypes = undefined;
const { Option } = Select;
const { Title } = Typography;

const ApplicatonManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { agency_data, isLoading } = useSelector((state) => state.Agency);
  const [FilteredAgency, setFilteredAgency] = useState([]);
  const [ExportData, setExportData] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  console.log("agency_data", agency_data);

  const getAgency = () => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: 1 },
    });
  };
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Application Date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => {
        return (
          <span>
            {created_at !== undefined
              ? format(new Date(created_at), "dd/MM/yyyy hh:mm a")
              : format(new Date(), "dd/MM/yyyy hh:mm a")}
          </span>
        );
      },
    },
    {
      title: getLocaleMessages("Agency Name"),
      dataIndex: "username",
      key: "username",
      render: (id, agency) => <span>{agency.agencyname} </span>,
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
      width: 200,
      render: (id, data, idx) => {
        return (
          <p className="number_ltr">
            {data?.contactnumber !== undefined && data?.contactnumber !== null
              ? formatPhoneNumberIntl(data?.contactnumber)
              : ""}
          </p>
        );
      },
    },
    {
      title: getLocaleMessages("Service Location"),
      dataIndex: "servicelocation",
      key: "servicelocation",
      render: (id, data) => (
        <span>
          {data.servicelocation} {" - "} {data.address}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (id, row) => (
        <Select
          showSearch
          onChange={(e) => handleAgencyStatus(e, row.id)}
          value={row.status}
          //allowClear
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
          <Option key={0} value={0}>
            {getLocaleMessages("InActive")}
          </Option>
        </Select>
      ),
    },
    {
      title: getLocaleMessages("Application Status"),
      dataIndex: "agentstatus",
      key: "agentstatus",
      render: (id, status) => (
        <Select
          showSearch
          onChange={(e) => handleChangeStatus(e, status.id)}
          // defaultValue={[status.agentstatus]}
          value={status.agentstatus}
          //allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          autoComplete={"off"}
          placeholder={"Status"}
          dropdownStyle={{ minWidth: "200px" }}
        >
          {console.log("status", status.agentstatus)}
          <Option key={1} value={1}>
            {getLocaleMessages("Approved")}
          </Option>
          <Option key={2} value={2}>
            {getLocaleMessages("Rejected")}
          </Option>
          {status.agentstatus !== 1 && status.agentstatus !== 2 && (
            <Option key={3} value={3}>
              {getLocaleMessages("Pending")}
            </Option>
          )}
        </Select>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (status, data, idx) => (
        <span>
          <ShowForPermission permission="update" module="agency">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleAgentEdit(data.id)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="agency">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleAgentDelete(data.id)}
              type="remove"
            />
          </ShowForPermission>
        </span>
      ),
    },
  ];

  const handleAgentEdit = (id) => {
    history.push({
      pathname: "application/update",
      state: id,
    });
  };

  const handleAgentDelete = (agentid) => {
    dispatch({
      type: settingsAction.REMOVE_AGENCY_DETAILS,
      payload: { id: agentid },
      callBackAction: () => {
        getAgency();
      },
    });
  };

  const handleAgencyStatus = (value, agentid) => {
    if (value !== undefined) {
      setLoader(true);
      dispatch({
        type: settingsAction.CHANGE_AGENCY_STATUS,
        payload: { status: value, id: agentid },
        callBackAction: () => {
          getAgency();
          setLoader(false);
        },
      });
    }
  };

  const handleChangeStatus = (value, agentid) => {
    if (value !== undefined) {
      setLoader(true);
      dispatch({
        type: settingsAction.CHANGE_AGENCY_STATUS,
        payload: { agentstatus: value, id: agentid },
        callBackAction: () => {
          getAgency();
          setLoader(false);
        },
      });
    }
  };

  const handleFilterStatus = (status) => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: status },
    });
  };

  const onFormLayoutChange = (values) => {
    const {
      name,
      email,
      contactnumber,
      agentstatus,
      servicelocation,
    } = usedForm.getFieldsValue();
    const filter = {};
    if (name !== undefined && name !== "") {
      filter["agencyname"] = name;
    }
    if (email !== undefined && email !== "") {
      filter["email"] = email;
    }
    if (contactnumber !== undefined && contactnumber !== "") {
      filter["contactnumber"] = contactnumber;
    }

    if (agentstatus !== undefined && agentstatus !== "") {
      filter["agentstatus"] = agentstatus;
    }
    if (servicelocation !== undefined && servicelocation !== "") {
      filter["servicelocation"] = servicelocation;
    }
    if (Object.keys(filter)?.length > 0) {
let lea = agency_data.filter((props) =>
  Object.entries(filter).every(
    ([key, val]) =>
      !val.length ||
      (props[key] &&
        props[key]
          .toString()
          .toLowerCase()
          ?.trim()
          .includes(val.toString().toLowerCase()?.trim()))
  )
);

      if (lea.length > 0) {
        setFilteredAgency(lea);
      }

      if (lea.length == 0) {
        setFilteredAgency([]);
      }
    }
    if (
      filter &&
      Object.keys(filter).length === 0 &&
      filter.constructor === Object
    ) {
      setFilteredAgency(agency_data);
    }
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const handleCreateAgency = () => {
    history.push("application/create");
  };

  useEffect(() => {
    if (agency_data?.length > 0) {
      setFilteredAgency(agency_data);
    }
  }, [agency_data]);

  useEffect(() => {
    if (agency_data.length > 0) {
      var arr = [];
      for (var i = 0; i < agency_data.length; i++) {
        arr.push({
          "Agency Name": agency_data[i].agencyname,
          Email: agency_data[i].email,
          "Contact Number": agency_data[i].contactnumber,
          Address: agency_data[i].address,
          "Cr Number": agency_data[i].crnumber,
          "Vat Number": agency_data[i].vatnumber,
          "Service Location": agency_data[i].servicelocation,
        });
      }
      setExportData(arr);
    }
  }, [agency_data]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: 1 },
    });
    window.scrollTo(0, 0);
  }, []);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              {getLocaleMessages("Application Management")}
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                onClick={handleFilterShow}
                type="primary"
                icon={<FilterOutlined />}
              >
                {getLocaleMessages("Filter")}
              </Button>
              {ExportData.length > 0 && (
                <MyCsvLink csvData={ExportData} filename="agency_detail" />
              )}
              <ShowForPermission permission="create" module="agency">
                <Button onClick={handleCreateAgency} type="primary">
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
            onValuesChange={onFormLayoutChange}
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item name="name">
                  <Input placeholder={getLocaleMessages("Name")} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item name="email">
                  <Input placeholder={getLocaleMessages("Email")} allowClear />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item name="contactnumber">
                  <Input
                    placeholder={getLocaleMessages("Contact Number")}
                    type="number"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item name="servicelocation">
                  <Input
                    placeholder={getLocaleMessages("Service Location")}
                    allowClear
                  />
                </Form.Item>
              </Col>
              {/* <Col span={6} className="inner-content">
                <Form.Item name={'agentstatus'}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={'off'}
                    placeholder={'Status'}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    <Option key={1} value={1}>
                      Approved
                    </Option>
                    <Option key={2} value={2}>
                      Rejected
                    </Option>
                    <Option key={3} value={3}>
                      Pending
                    </Option>
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        )}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={FilteredAgency}
          loading={loader}
        />
      </div>
    </LoadingOverlay>
  );
};

export default ApplicatonManagement;
