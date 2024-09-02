import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
import { Tree, Card, Form, Button, Input, Radio, Row, Col } from "antd";
import { formProps } from "./../../../helpers/constant";
import actions from "./../../../redux/admin/roleandrights/actions";
import { set, groupBy } from "lodash";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "redux/helper";

const RolePermission = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { modulelist, rolelist, permissionlist, isLoading } = useSelector(
    (state) => state.RolesRights
  );

  const [expandedKeys, setExpandedKeys] = useState(["bok", "car"]);
  const [checkedKeys, setCheckedKeys] = useState(["bok"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [Status, setStatus] = useState(1);
  const [Permission, setPermission] = useState([]);
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue, e) => {
    let data = {};
    let moduleName = "";
    e.node.key !== undefined
      ? (moduleName = e.node.key.split("-")[0])
      : (moduleName = "");
    data.key = moduleName;
    if (e.checkedNodes.length === 5) {
      e.checkedNodes.map((el) => {
        if (el.id !== undefined) data.id = el.id;
      });
    } else {
      data.id = GetModuleID(moduleName);
    }
    setPermission(e);
    setCheckedKeys(checkedKeysValue);
  };

  const GetModuleID = (modulename) => {
    if (modulelist.length > 0) {
      const result = modulelist.filter((mod) => mod.key == modulename);
      return result && result[0].id;
    }
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  const handleSubmit = (values) => {
    let roleid =
      props.location.state !== undefined ? props.location.state.roleid : -1;
    let role_data = {};
    if (roleid > 0) role_data["id"] = roleid;
    role_data.rolename = values.rolename;
    role_data.status = Status;
    let rights_data = [];

    const data = groupBy(Permission.checkedNodes, "id");
    for (const [key, value] of Object.entries(data)) {
      let obj = {};
      value.forEach((el) => {
        obj.id = key;
        if (el.children !== undefined) {
          obj.access = 1;
          obj.create = 1;
          obj.update = 1;
          obj.delete = 1;
          obj.status = 1;
          return;
        } else {
          if (el.title !== undefined && el.title == "Create") obj.create = 1;
          if (el.title !== undefined && el.title == "Update") obj.update = 1;
          if (el.title !== undefined && el.title == "Delete") obj.delete = 1;
          if (el.title !== undefined && el.title == "Status") obj.status = 1;
        }
      });
      rights_data.push(obj);
    }
    dispatch({
      type: actions.ROLE_RIGHTS_IUD,
      payload: {
        action: roleid > 0 ? "U" : "I",
        role: role_data,
        rights: rights_data,
      },
    });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    usedForm.setFieldsValue({ status: e.target.value });
  };

  useEffect(() => {
    let data = [];
    if (data.id !== undefined) {
      usedForm.setFieldsValue({
        rolename: data.rolename,
        status: data.status,
      });
    }
  }, []);

  useEffect(() => {
    if (permissionlist) {
      setExpandedKeys(permissionlist.expandedKeys);
      setCheckedKeys(permissionlist.checkedKeys);
    }
  }, [permissionlist]);

  useEffect(() => {
    if (props.location.state !== undefined) {
      const result = rolelist.filter(
        (role) => role.id == props.location.state.roleid
      );
      if (result.length) {
        usedForm.setFieldsValue({
          rolename: result[0].rolename,
          status: result[0].status,
        });
      }

      dispatch({
        type: actions.GET_PERMISSION_BYID,
        payload: props.location.state.roleid,
      });
    }
    dispatch({
      type: actions.GET_ACCESS_MODULES,
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
        <div className="page-container small">
          <Card>
            <Form
              form={usedForm}
              onFinish={handleSubmit}
              {...formProps}
              initialValues={{ status: 1 }}
            >
              <Form.Item
                name="rolename"
                label={getLocaleMessages("Role Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Role Name")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="roles"
                label={getLocaleMessages("Module Permission")}
              >
                <Tree
                  checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={modulelist}
                />
              </Form.Item>

              <Form.Item
                label={getLocaleMessages("Role Status")}
                name={"status"}
              >
                <Radio.Group onChange={handleStatusChange} value={Status}>
                  <Radio value={1} style={{ fontSize: "14px" }}>
                    {getLocaleMessages("Active")}
                  </Radio>
                  <Radio value={2} style={{ fontSize: "14px" }}>
                    {getLocaleMessages("InActive")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <div className="button-center">
                <Button
                  onClick={() => {
                    history.push("/admin/role");
                  }}
                  className="save-btn"
                >
                  {getLocaleMessages("Cancel")}
                </Button>
                <Button type="primary" htmlType="submit" className="save-btn">
                  {props.location.state === undefined
                    ? getLocaleMessages("Create")
                    : getLocaleMessages("Update")}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default RolePermission;
