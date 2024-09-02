import React from "react";
import ImageUploader from "react-images-upload";
import PropTypes from "prop-types";
import { getLocaleMessages } from "redux/helper";

const CustomImageUpload = (props) => {
  const { isSingleImage, onDropImage, images } = props;

  const constructImageList = (imageData, index) => {
    const { isRemoved, keyPath, deleteImage } = props;
    return (
      <div className="periview-section" key={index}>
        {isRemoved ? (
          <>
            <i
              className="remove-upload-image las la-times"
              onClick={() => deleteImage(imageData["id"])}
            />
            <img
              alt={"please check"}
              src={`http://lamsat.duceapps.com:9011/${imageData[keyPath]}`}
            />
          </>
        ) : (
          <img
            alt={"please check"}
            src={`http://lamsat.duceapps.com:9011/${imageData}`}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <ImageUploader
          withIcon={false}
          withPreview={true}
          buttonText={getLocaleMessages("Upload Images")}
          onChange={onDropImage}
          imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
          maxFileSize={1048576}
          fileSizeError={getLocaleMessages("file size is too big")}
          singleImage={isSingleImage}
        />
      </div>
      {images.length > 0 && (
        <div className="imgPreview">
          {images.map((imageList, index) =>
            constructImageList(imageList, index)
          )}
        </div>
      )}
    </div>
  );
};

CustomImageUpload.defaultProps = {
  isSingleImage: false,
  images: [],
  isRemoved: false,
  keyPath: "",
};

CustomImageUpload.propTypes = {
  isSingleImage: PropTypes.bool,
  onDropImage: PropTypes.func.isRequired,
  images: PropTypes.array,
  isRemoved: PropTypes.bool,
  keyPath: PropTypes.string,
  deleteImage: PropTypes.func,
};

export default CustomImageUpload;
