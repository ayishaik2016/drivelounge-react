import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uploadRequest } from "./../../helpers/axiosClient";
import { getLocaleMessages } from "redux/helper";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class CoverImageUpload extends React.Component {
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
      previewImage: file.thumbUrl !== undefined ? file.thumbUrl : file.url,
      previewVisible: true,
    });
  };
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  handleChange = async ({ file, fileList }) => {
    this.setState({ fileList });
    if (fileList.length > 0) {
      let form = new FormData();
      form.append("file", fileList[0].originFileObj);
      await uploadRequest("admin/upload", form)
        .then((res) => {
          let image = res.data;
          let imageName = image[0].data.filePath.split("__uploads/")[1];
          this.props.setCoverImage({
            name: imageName,
            url: `https://api.drivelounge.com/${imageName}`,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (file.status == "removed") {
      this.props.setCoverImage({
        name: "",
      });
    }
  };

  beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (!isJpgOrPng) {
      message.error(getLocaleMessages("You can only upload JPG/PNG file"));
    }

    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isLt2M) {
      message.error(getLocaleMessages("Image must smaller than 5MB"));
    }

    return isJpgOrPng && isLt2M;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>{getLocaleMessages("Upload")} </div>
      </div>
    );
    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          customRequest={this.dummyRequest}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
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

export default CoverImageUpload;
