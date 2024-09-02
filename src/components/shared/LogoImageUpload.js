import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uploadRequest } from "./../../helpers/axiosClient";
import { getLocaleMessages } from "redux/helper";
var Path = require("path");

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class LogoImageUpload extends React.Component {
  state = {
    previewImage: "",
    previewTitle: "",
    previewVisible: false,
    fileList: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.ImagePath !== prevProps.ImagePath) {
      this.setState({ fileList: [this.props.ImagePath] });
    }
  }
  componentDidMount() {
    this.props.ImagePath.name !== "" &&
      this.setState({ fileList: [this.props.ImagePath] });
  }
  //   handleCancel = () => this.setState({ previewVisible: false });

  //   handlePreview = async (file) => {
  //     if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj);
  //     }

  //     this.setState({
  //       previewImage: file.url || file.preview,
  //       previewVisible: true,
  //       previewTitle:
  //         file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
  //     });
  //   };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    this.setState({ fileList });
    if (fileList.length) {
      let form = new FormData();
      form.append("file", fileList[0].originFileObj);
      await uploadRequest("public/upload", form).then((res) => {
        let image = res.data;
        let imageName = image[0].data.filePath.split("__uploads/")[1];
        if (imageName) {
          this.props.setCoverImage({
            name: imageName,
            url: `https://api.drivelounge.com/${imageName}`,
          });
        } else {
          var filename = Path.resolve(image[0].data.filePath)
            .split(Path.sep)[1]
            .split("__uploads");
          imageName = filename[1].replace(Path.delimiter, "").slice(1);
          this.props.setCoverImage({
            name: imageName,
            url: `https://api.drivelounge.com/${imageName}`,
          });
        }
      });
    }
    if (file.status == "removed") {
      this.props.setCoverImage({
        name: "",
      });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}> {getLocaleMessages("Upload Logo")}</div>
      </div>
    );
    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={() => false}
          accept={"image/png, image/jpeg, image/jpg"}
        >
          {fileList.length == 0 && uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default LogoImageUpload;
