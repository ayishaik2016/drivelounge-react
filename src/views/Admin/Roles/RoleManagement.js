import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
import { Row, Col, Button, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import actions from "./../../../redux/admin/roleandrights/actions";
import "./../../../assets/css/adminStyle.css";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";
LoadingOverlay.propTypes = undefined;

const { Title } = Typography;
const RoletManagement = () => {
  const dispatch = useDispatch();
  const { rolelist, isLoading } = useSelector((state) => state.RolesRights);
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Role Name"),
      dataIndex: "rolename",
      key: "role",
    },

    {
      title: getLocaleMessages("Status"),
      dataIndex: "role_status",
      key: "role_status",
      render: (role_status, data, idx) => (
        <span>
          {role_status == 1
            ? getLocaleMessages("Active")
            : getLocaleMessages("InActive")}
        </span>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "status",
      key: "status",
      render: (status, data, idx) => (
        <span>
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleRoleEdit(data.id)}
            type="edit"
          ></Button>{" "}
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleRoleDelete(data.id)}
            type="remove"
          ></Button>
        </span>
      ),
    },
  ];

  const handleRoleEdit = (id) => {
    history.push({
      pathname: "role/update",
      state: { roleid: id },
    });
  };

  const handleRoleDelete = (roleid) => {
    dispatch({
      type: actions.REMOVE_USER_ROLE,
      payload: { id: roleid },
    });
  };

  const handleCreateRole = () => {
    history.push("role/create");
  };
  useEffect(() => {
    dispatch({
      type: actions.GET_ROLE_LIST,
      payload: false,
    });
  }, []);
  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text={getLocaleMessages("Loading your content...")}
      >
        <div className="page-container medium">
          <Row className="head-filter" justify="space-between" align="middle">
            <Col span={8}>
              <Title level={2}>{getLocaleMessages("Role Management")}</Title>
            </Col>
            <Col span={5} offset={8}>
              <Button type="primary" onClick={handleCreateRole}>
                {getLocaleMessages("Create")}
              </Button>
            </Col>
          </Row>

          <Table rowKey="id" columns={columns} dataSource={rolelist} />
        </div>
      </LoadingOverlay>
    </>
  );
};

export default RoletManagement;
