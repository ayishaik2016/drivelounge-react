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
  Divider,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formProps } from "./../../../helpers/constant";
import settingsAction from "./../../../redux/admin/activitylog/actions";
import "./../../../assets/css/adminStyle.css";
import format from "date-fns/format";
import { ShowForPermission } from "redux/userPermissions";
import { getLocaleMessages } from "redux/helper";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { Title } = Typography;

const ActivityLog = () => {
  const dispatch = useDispatch();
  const { activitylog, pagination } = useSelector((state) => state.ActivityLog);
  const [showFilter, setshowFilter] = useState(false);
  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (id, idx, i) => <p>{i + 1}</p>,
    },
    {
      title: getLocaleMessages("User Name"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: getLocaleMessages("Log"),
      dataIndex: "log",
      key: "log",
    },
    {
      title: getLocaleMessages("Client IP"),
      dataIndex: "clientip",
      key: "clientip",
    },
    {
      title: getLocaleMessages("Client Platform"),
      dataIndex: "clientplatform",
      key: "clientplatform",
    },
    {
      title: getLocaleMessages("Client Agent"),
      dataIndex: "clientagent",
      key: "clientagent",
    },
    {
      title: getLocaleMessages("Created Date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => (
        <span>{format(new Date(created_at), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <ShowForPermission permission="remove" module="alog">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="edit"
          />
        </ShowForPermission>
      ),
    },
  ];

  const GetActivityLogs = () => {
    dispatch({
      type: settingsAction.GET_ACTIVITYLOG_INFO,
      payload: {
        limit: "10",
        skip: "1",
        status: 1,
      },
    });
  };

  const handleDelete = (type) => {
    dispatch({
      type: settingsAction.REMOVE_ACTIVITYLOG_INFO,
      payload: { id: type.id },
      callBackAction: () => {
        GetActivityLogs();
      },
    });
  };

  useEffect(() => {
    GetActivityLogs();
  }, []);

  return (
    <div className="page-container">
      <Title level={2}>{getLocaleMessages("Activity Log")}</Title>
      <Table rowKey="id" columns={columns} dataSource={activitylog} />
    </div>
  ); //pagination={pagination}
};

export default ActivityLog;
