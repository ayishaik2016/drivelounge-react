import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import { Row, Col, Input, Button, Table, Space, Card, Select, Switch, Form, Typography } from 'antd';
import { SearchOutlined, FilterOutlined,DeleteOutlined, EditOutlined,DownloadOutlined } from '@ant-design/icons';
import { array } from 'prop-types';
import { getLocaleMessages } from 'redux/helper';

class MyCsvLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.csvData, filename: this.props.filename};
        this.csvLink = React.createRef();
    }
  fetchData = () => {
      this.setState(() => {
        this.csvLink.current.link.click()
      })
    
  }

  render() {
    return (
      <div>
        <Button onClick={this.fetchData} type="primary" icon={<DownloadOutlined />}>{getLocaleMessages("Export")}</Button>
        <CSVLink
          data={this.props.csvData}
          filename={this.state.filename+'.csv'}
          className="hidden"
          ref={this.csvLink}
          target="_blank" 
       />
    </div>
    )
  }
}
export default MyCsvLink;