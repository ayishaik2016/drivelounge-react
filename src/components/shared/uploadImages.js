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

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    hasImageChanged: false,
    fileList: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        fileList: [
          {
            uid: this.props.id,
            name: this.props.carinterriorimagename,
            status: "done",
            url: `https://api.drivelounge.com/${this.props.carinterriorimagename}`,
          },
        ],
      });
    }
  }

  handleFileUpload = () => {
    let form = new FormData();
    form.append("file", this.state.fileList[0].originFileObj);
    uploadRequest("admin/upload", form);
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  //   handleChange = ({ fileList }) => this.setState({ fileList });
  handleChange = (info) => {
    if (info.file.status !== "uploading" && info.file.status !== "removed") {
      let form = new FormData();
      form.append("file", info.fileList[0].originFileObj);

      uploadRequest("admin/upload", form).then((res) => {
        let image = res.data;
        let imageName = image[0].data.filePath.split("__uploads/")[1];
        this.props.handleCarImages({
          type: this.props.Image,
          name: imageName,
          hasRemoved: true,
        });
      });
      this.setState({ fileList: info.fileList });
    }
    if (info.file.status == "removed") {
      this.props.handleCarImages({
        type: this.props.Image,
        name: "",
        hasRemoved: true,
      });
      this.setState({ fileList: info.fileList });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>{getLocaleMessages("Upload")}</div>
      </div>
    );
    return (
      <>
        <Upload
          {...this.props}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          //   {uploadRequest('admin/upload',fileList[0],config)}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onDownload={this.handleFileUpload}
          accept={"image/png, image/jpeg, image/jpg"}
        >
          {fileList.length == 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;
