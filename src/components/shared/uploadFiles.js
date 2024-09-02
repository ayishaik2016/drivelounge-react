import React, { Component } from "react";
import { Upload, Button, Modal, message } from "antd";
import "antd/dist/antd.css";
import { uploadRequest } from "./../../helpers/axiosClient";
import { getLocaleMessages } from "redux/helper";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class FileUpoload extends Component {
  state = {
    doc: this.props.doc,
    selectedFile: null,
    selectedFileList: [],
  };

  handleRemove = (info) => {
    this.setState({ selectedFileList: [] });
    let data = {
      doc: this.state.doc,
      name: "",
      hasRemoved: true,
      sortorder: this.state.doc,
    };
    this.props.handleSupportDocs(data);
  };

  onChange = (info) => {
    const { file, onSuccess, onError } = info;
    const nextState = {};
    if (file.status !== "uploading" && file.status !== "removed") {
      if (file.type !== "application/pdf") {
        message.error(
          `${file.name} ${getLocaleMessages("File Error Message")}`
        );
        return;
      }
      let form = new FormData();
      nextState.selectedFile = file;
      nextState.selectedFileList = [file];
      form.append("file", info.fileList[0].originFileObj);
      uploadRequest("admin/upload", form).then((res) => {
        let docs = res.data;
        let docsName = docs[0].data.filePath.split("__uploads/")[1];
        let data = {
          doc: this.state.doc,
          name: docsName,
          hasRemoved: false,
          sortorder: this.state.doc,
        };
        this.props.handleSupportDocs(data);
      });
    }

    this.setState(() => nextState);
  };
  render() {
    return (
      <Upload
        fileList={this.state.selectedFileList}
        customRequest={dummyRequest}
        onChange={this.onChange}
        onRemove={this.handleRemove}
      >
        <Button>{getLocaleMessages("Choose File")} </Button>
      </Upload>
    );
  }
}

export default FileUpoload;
