import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Form,
  Modal,
  Typography,
  Switch,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import LoadingOverlay from "react-loading-overlay";

import { getLocaleMessages } from "redux/helper";
import { ShowForPermission } from "redux/userPermissions";
import settingsAction from "../../../../redux/admin/address/actions";

import { formProps, DEFAULT_CURRENCY } from "../../../../helpers/constant";

import "../../../../assets/css/adminStyle.css";

LoadingOverlay.propTypes = undefined;

const { Title } = Typography;

const CurrencyComponent = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();

  const { currency_data, isLoading } = useSelector((state) => state.Address);

  const [visible, setvisible] = useState(false);
  const [SelectedCurrencyId, setSelectedCurrencyId] = useState(0);

  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: getLocaleMessages("Name"),
      dataIndex: "name",
      key: "currencyname",
    },
    {
      title: getLocaleMessages("Code"),
      dataIndex: "code",
      key: "currencycode",
    },
    {
      title: getLocaleMessages("Symbol"),
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (status, row) => (
        <Switch
          disabled={row.code.trim() === DEFAULT_CURRENCY}
          onChange={(e) => handleStatus(e, row)}
          defaultChecked={status == 1 ? true : false}
        />
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <ShowForPermission permission="update" module="city">
            <Button
              shape="circle"
              disabled={record.code.trim() === DEFAULT_CURRENCY}
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            ></Button>
          </ShowForPermission>
        </div>
      ),
    },
  ];

  const handleStatus = (check, { code }) => {
    dispatch({
      type: settingsAction.CHANGE_CURRENCY_STATUS,
      payload: { code: code.trim(), status: check ? 1 : 0 },
    });
  };

  const handleEdit = (currency) => {
    setSelectedCurrencyId(currency.id);
    setvisible(!visible);
    usedForm.setFieldsValue({
      ...currency,
    });
  };

  const onFinishDetails = (values) => {
    if (SelectedCurrencyId) {
      dispatch({
        type: settingsAction.UPDATE_CURRENCY,
        payload: {
          ...values,
          id: SelectedCurrencyId,
          code: values.code.trim(),
        },
      });
    } else {
      dispatch({
        type: settingsAction.CREATE_NEW_CURRENCY,
        payload: {
          ...values,
          code: values.code.trim(),
        },
      });
    }
    setvisible(!visible);
    setSelectedCurrencyId(0);
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CURRENCY_LIST,
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
          title={getLocaleMessages("Create Currency")}
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
                name="name"
                label={getLocaleMessages("Currency Name")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Currency Name")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="code"
                label={getLocaleMessages("Currency Code")}
                rules={[
                  {
                    required: true,
                    whitespace: false,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Currency Code")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="symbol"
                label={getLocaleMessages("Currency Symbol")}
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Currency Symbol")}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="button-center">
                <Button type="primary" htmlType="submit">
                  {getLocaleMessages("Save")}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Row className="head-filter" justify="space-between" align="middle">
          <Col span={8}>
            <Title level={2}>{getLocaleMessages("Currency Management")}</Title>
          </Col>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <ShowForPermission permission="create" module="city">
                <Button
                  onClick={() => {
                    usedForm.resetFields();
                    setvisible(!visible);
                  }}
                  type="primary"
                >
                  {getLocaleMessages("Create Currency")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>

        <Table rowKey="id" columns={columns} dataSource={currency_data} />
      </div>
    </LoadingOverlay>
  );
};

export default CurrencyComponent;
