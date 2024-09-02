import React, { useState, useEffect, useRef } from "react";
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
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import LoadingOverlay from "react-loading-overlay";

import { getLocaleMessages } from "redux/helper";
import { ShowForPermission } from "redux/userPermissions";
import settingsAction from "../../../../redux/admin/address/actions";

import { formProps, DEFAULT_CURRENCY } from "../../../../helpers/constant";

import "../../../../assets/css/adminStyle.css";

LoadingOverlay.propTypes = undefined;

const { Title, Text } = Typography;
const { Option } = Select;

const CurrencyConversionComponent = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();

  const { currency_conversion_data, currency_data, isLoading } = useSelector(
    (state) => state.Address
  );
  const [visible, setvisible] = useState(false);
  const [
    SelectedCurrencyConversionId,
    setSelectedCurrencyConversionId,
  ] = useState(0);
  const currencies = useRef(currency_conversion_data);

  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: getLocaleMessages("Currency From"),
      dataIndex: "from",
      key: "from",
    },
    {
      title: getLocaleMessages("Currency To"),
      dataIndex: "to",
      key: "to",
    },
    {
      title: getLocaleMessages("Equal To"),
      dataIndex: "equalto",
      key: "equalto",
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
              disabled={record.to.trim() === DEFAULT_CURRENCY}
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="edit"
            ></Button>
          </ShowForPermission>
        </div>
      ),
    },
  ];

  const handleEdit = (currencyConversion) => {
    setSelectedCurrencyConversionId(Number(currencyConversion.id));
    setvisible(!visible);
    usedForm.setFieldsValue({
      code: currencyConversion.to,
      conversion: currencyConversion.equalto
    });
  };

  const onFinishDetails = (values) => {
    if (SelectedCurrencyConversionId) {
      dispatch({
        type: settingsAction.UPDATE_CURRENCY_CONVERSION,
        payload: {
          id: SelectedCurrencyConversionId,
          from: DEFAULT_CURRENCY,
          to: values.code.trim(),
          equalto: values.conversion,
        },
      });
    } else {
      dispatch({
        type: settingsAction.CREATE_NEW_CURRENCY_CONVERSION,
        payload: {
          from: DEFAULT_CURRENCY,
          to: values.code.trim(),
          equalto: values.conversion,
        },
      });
    }

    setvisible(!visible);
    setSelectedCurrencyConversionId(0);
  };

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CURRENCY_CONVERSION_LIST,
      payload: false,
    });
    dispatch({
      type: settingsAction.GET_CURRENCY_LIST,
      payload: false,
    });
    currencies.current = currency_data.filter(
      (data) => data.code.trim() !== DEFAULT_CURRENCY
    );
  }, [visible]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container medium">
        <Modal
          title={getLocaleMessages("Create Conversion")}
          visible={visible}
          centered
          footer={false}
          width={480}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisible(!visible)}
        >
          <div>
            <Text> 1 SAR is equal to</Text>
            <Form form={usedForm} onFinish={onFinishDetails} {...formProps}>
              <Form.Item
                name="conversion"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please input"
                    )} ${getLocaleMessages("Currency Conversion")}`,
                  },
                ]}
              >
                <Input type="number" placeholder="currency conversion" />
              </Form.Item>

              <Form.Item
                name="code"
                label={getLocaleMessages("Currency Code")}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: `${getLocaleMessages(
                      "Please select"
                    )} ${getLocaleMessages("Currency")}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  autoComplete={"off"}
                  disabled={SelectedCurrencyConversionId !== 0}
                  placeholder={getLocaleMessages("Currency")}
                  dropdownStyle={{ minWidth: "200px" }}
                >
                  {currencies.current &&
                    currencies.current.map((currency) => {
                      return (
                        <Option key={currency.id} value={currency.code.trim()}>
                          {currency.code.trim()}
                        </Option>
                      );
                    })}
                </Select>
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
            <Title level={2}>
              {getLocaleMessages("Currency Conversion Management")}
            </Title>
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
                  {getLocaleMessages("Create Conversion")}
                </Button>
              </ShowForPermission>
            </Space>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={currency_conversion_data}
        />
      </div>
    </LoadingOverlay>
  );
};

export default CurrencyConversionComponent;
