import react, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import {
  Row,
  Col,
  Button,
  Table,
  DatePicker,
  Form,
  Typography,
  Space,
} from "antd";
import { format } from "date-fns";
import "./../../../assets/css/adminStyle.css";
import { FilterOutlined } from "@ant-design/icons";
import actions from "./../../../redux/admin/report/actions";
import { formProps } from "../../../helpers/constant";
import MyCsvLink from "../../../components/shared/ExportCsv";
import { getLocaleMessages } from "redux/helper";

const { Title } = Typography;

const ZatVatComponent = () => {
  const dispatch = useDispatch();
  const [filterForm] = Form.useForm();
  const [showFilter, setshowFilter] = useState(false);
  const [reports, setReports] = useState([]);
  const [ExportData, setExportData] = useState([]);
  const { zatvatrept_list, isLoading } = useSelector((State) => State.Reports);
  const columns = [
    {
      title: "#",
      dataIndex: "row",
      key: "row",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Agency Name"),
      dataIndex: "agencyname",
      key: "agencyname",
    },
    {
      title: getLocaleMessages("Total Count of Confirmed Booking"),
      dataIndex: "count",
      key: "count",
    },
    {
      title: getLocaleMessages("Total Sales Invoice of Comfirmed Booking"),
      dataIndex: "confirmedbookingrevenue",
      key: "confirmedbookingrevenue",
    },
    {
      title: getLocaleMessages("Total Revenue"),
      dataIndex: "totalrevenue",
      key: "totalrevenue",
    },
    {
      title: getLocaleMessages("(ZAT) Total * Revenue %2.5"),
      dataIndex: "zakat",
      key: "zakat",
    },
    {
      title: getLocaleMessages("(VAT) Total Net Sales Invoice %15*"),
      dataIndex: "vat",
      key: "vat",
    },
  ];
  const datefunc = (val) => {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    return {
      fdate: format(new Date(firstDay), "yyyy-MM-dd"),
      ldate: format(new Date(lastDay), "yyyy-MM-dd"),
    };
  };
  useEffect(() => {
    dispatch({
      type: actions.GET_ZATVATREPT_LIST,
      payload: { fdate: datefunc().fdate, ldate: datefunc().ldate },
    });
  }, []);
  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };
  const onFormFilterLayoutChange = () => {
    const { fromdate, todate } = filterForm.getFieldsValue();
    if (fromdate !== undefined && todate !== undefined) {
      dispatch({
        type: actions.GET_ZATVATREPT_LIST,
        payload: {
          fdate:
            fromdate !== undefined
              ? format(new Date(fromdate), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
          ldate:
            todate !== undefined
              ? format(new Date(todate), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
        },
      });
    }
  };
  useEffect(() => {
    setReports(zatvatrept_list);
  }, [zatvatrept_list]);

  useEffect(() => {
    if (reports.length > 0) {
      var arr = [];
      for (var i = 0; i < reports.length; i++) {
        arr.push({
          "Agency Name": reports[i].agencyname,
          "Total Count of Confirmed Booking": reports[i].count,
          "Total Sales Invoice of Comfirmed Booking":
            reports[i].confirmedbookingrevenue,
          "Total Revenue": reports[i].totalrevenue,
          "(ZAT) Total * Revenue %2.5": reports[i].zakat,
          "(VAT) Total Net Sales Invoice %15*": reports[i].vat,
        });
      }
      setExportData(arr);
    }
  }, [reports]);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter" justify="space-between" align="middle">
          <Col>
            <Title level={2}>{getLocaleMessages("Zakat and VAT Report")}</Title>
          </Col>
          <Col>
            <Space>
              {ExportData.length > 0 && (
                <MyCsvLink csvData={ExportData} filename="Zakatvat_Report" />
              )}

              <Button
                onClick={handleFilterShow}
                type="primary"
                icon={<FilterOutlined />}
              >
                {getLocaleMessages("Filter")}
              </Button>
            </Space>
          </Col>
        </Row>
        {showFilter && (
          <Form
            {...formProps}
            layout="horizontal"
            form={filterForm}
            onValuesChange={onFormFilterLayoutChange}
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item
                  name="fromdate"
                  label={getLocaleMessages("From Date")}
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    inputReadOnly
                    placeholder={getLocaleMessages("From Date")}
                  />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item name="todate" label={getLocaleMessages("To Date")}>
                  <DatePicker
                    format="DD-MM-YYYY"
                    inputReadOnly
                    placeholder={getLocaleMessages("To Date")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        <Table columns={columns} dataSource={reports} />
      </div>
    </LoadingOverlay>
  );
};

export default ZatVatComponent;
