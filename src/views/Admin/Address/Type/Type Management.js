import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "redux/store";
import { Row, Col, Button, Table, Space, Switch, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import settingsAction from "../../../../redux/admin/address/actions";
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const { Title } = Typography;

const AddressTypeComponent = () => {
  const dispatch = useDispatch();
  const { addresstype_data, isLoading } = useSelector((state) => state.Address);
  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (id, idx, i) => <p>{i + 1}</p>,
    },
    {
      title: getLocaleMessages("Address Type Name"),
      dataIndex: "addresstypenameen",
      key: "addresstypenameen",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "addresstypestatus",
      key: "addresstypestatus",
      render: (addresstypestatus, row) => (
        <Switch
          onChange={(e) => handleTypeStatusChange(e, row.id)}
          defaultChecked={addresstypestatus == 1 ? true : false}
        />
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="addty">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="addty">
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

  const handleTypeStatusChange = (evnt, id) => {
    dispatch({
      type: settingsAction.CHANGE_ADDRESSTYPE_MANAGEMENT_STATUS,
      payload: { id: id, status: evnt },
    });
  };

  const handleCreate = () => {
    history.push("addresstype/create");
  };

  const handleEdit = (type) => {
    history.push({
      pathname: "addresstype/create",
      state: { typeid: type.id },
    });
  };
  const handleDelete = (type) => {
    dispatch({
      type: settingsAction.REMOVE_ADDRESSTYPE_MANAGEMENT,
      payload: { id: type.id },
    });
  };
  useEffect(() => {
    dispatch({
      type: settingsAction.GET_ADDRESSTYPE_MANAGEMENT,
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
              <Title level={2}>
                {getLocaleMessages("Address Type Management")}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <ShowForPermission permission="create" module="addty">
                <Button onClick={handleCreate} type="primary">
                  {getLocaleMessages("Create")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={addresstype_data} />
      </div>
    </LoadingOverlay>
  );
};

export default AddressTypeComponent;
