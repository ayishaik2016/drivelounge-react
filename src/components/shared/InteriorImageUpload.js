import React from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uploadRequest } from "./../../helpers/axiosClient";
import { getLocaleMessages } from "redux/helper";

class InteriorImageUpload extends React.Component {
  state = {
    previewImage: this.props.IntPath.url,
    previewTitle: "",
    previewVisible: false,
    fileList: this.props.IntPath.length > 0 || [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.IntPath !== prevProps.IntPath) {
      this.setState({ fileList: this.props.IntPath });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    let files = [];
    if (fileList !== undefined && fileList.length) {
      fileList.map(async (image, idx) => {
        if (image.originFileObj !== undefined) {
          let form = new FormData();
          form.append("file", image.originFileObj);
          await uploadRequest("admin/upload", form).then((res) => {
            let image = res.data;
            let imageName = image[0].data.filePath.split("__uploads/")[1];
            image.uploaded = imageName;
            files.push({
              uid: idx,
              name: imageName,
              status: "done",
              url: `https://api.drivelounge.com/${imageName}`,
              thumbUrl: `https://api.drivelounge.com/${imageName}`,
            });
          });
        } else {
          files.push(image);
        }
      });
    }
    this.setState({ fileList });
    this.props.setIntImage(files);
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
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={() => {
            /* update state here */
            return false;
          }}
          accept={"image/png, image/jpeg, image/jpg"}
        >
          {uploadButton}
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

export default InteriorImageUpload;
