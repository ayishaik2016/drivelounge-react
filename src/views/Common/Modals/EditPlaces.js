import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Input,
  Form,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Typography,
} from "antd";
import actions from "./../../../redux/Listing/actions";
import "rc-time-picker/assets/index.css";
import "./../../../assets/css/userStyle.css";
import GoogleMaps from "./../../Admin/Agency/AgencyMap";
import Map from "./../../Admin/Agency/MapMarkers";
import { history, store } from "./../../../redux/store";
import AutoComplete from "./../../Admin/Agency/address1";
import { getLocaleMessages } from "redux/helper";

const EditPlaceModal = (props) => {
  let localValue = JSON.parse(localStorage.getItem("searchCriteria"));
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();
  const { filterCarElements } = useSelector((state) => state.Listing);
  const { carFullInformationList } = useSelector((state) => state.CarListing);
  const [PickupPlace, setPickupPlace] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const {
    visible,
    onCancel,
    onOk,
    placetype,
    livelocation,
    setPickupLocation,
    setchangeState,
    setVisible,
    setPickupPlaceLocation,
  } = props;
  const [ShowMap, setShowMap] = useState();
  const [PickupCors, setPickupCors] = useState(livelocation);
  const [DropCors, setDropCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const defaultcenter = { lat: 24.6877, lng: 46.7219 };
  const [Agencylocation, setAgencylocation] = useState({
    lat: "",
    lng: "",
    address: "Agency Location",
  });

  const [Currentlocation, setCurrentlocation] = useState({
    lat: "",
    lng: "",
    address: "",
  });
  const [mapRender, setMapRender] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentlocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `You're Here!`,
      });
    });
  }, []);

  const handleChangeLocation = () => {
    let localValue = JSON.parse(localStorage.getItem("searchCriteria")) || [];

    setPickupPlaceLocation(PickupCors?.address);
    let local = {
      ...localValue,
      PickupCors: {
        lat: PickupCors?.lat,
        lng: PickupCors?.lng,
        address: PickupCors.address,
      },
    };
    localStorage.setItem("searchCriteria", JSON.stringify(local));
    // if (
    //   Currentlocation.lat === "" ||
    //   Currentlocation.lng === "" ||
    //   Currentlocation.address === "You're Here!"
    // ) {
    //   alert("iff");
    //   onOk(!visible);
    //   return;
    // }

    let data =
      placetype == 1 ? { PickupPlace, PickupCors } : { DropPlace, DropCors };
    if (Object.keys(localValue)?.length > 0) {
      // localValue["PickupPlace"] =
      //   placetype == 1
      //     ? PickupPlace
      //     : localValue.PickupPlace !== undefined
      //     ? localValue.PickupPlace
      //     : "";
      // if (
      //   Currentlocation.lat !== "" &&
      //   Currentlocation.lng !== "" &&
      //   Currentlocation.address
      // ) {
      //   localValue["PickupCors"] = Currentlocation;
      // } else {
      // }
      localValue["PickupCors"] =
        placetype == 1
          ? PickupCors
          : localValue.PickupCors !== undefined
          ? localValue.PickupCors
          : "";

      localValue["PickupDate"] = localValue.PickupDate;
      localValue["DropPlace"] =
        placetype == 2
          ? DropPlace
          : localValue.DropPlace !== undefined
          ? localValue.DropPlace
          : "";
      localValue["DropCors"] =
        placetype == 2
          ? DropCors
          : localValue.DropCors !== undefined
          ? localValue.DropCors
          : "";
      localValue["DropoffDate"] = localValue.DropoffDate;
      localValue["DifferentDropoffLocation"] =
        localValue.IsDropoffSelected !== undefined
          ? localValue.IsDropoffSelected
          : "";
      localValue["WithDriver"] =
        localValue.WithDriver !== undefined ? localValue.WithDriver : "";

      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    } else {
      localStorage.removeItem("searchCriteria");
      localStorage.setItem("searchCriteria", JSON.stringify(data));
    }
    setPickupLocation(PickupCors);
    dispatch({
      type:
        placetype == 1
          ? actions.SET_PICKUP_PLACE_CHANGES
          : actions.SET_DROPOFF_PLACE_CHANGES,
      ...data,
    });
    if (
      filterCarElements.IsDropoffSelected !== undefined &&
      !filterCarElements.IsDropoffSelected
    ) {
      dispatch({
        type: actions.SET_DROPOFF_PLACE_CHANGES,
        ...data,
      });
    }

    onOk(!visible);
  };

  useEffect(() => {
    setCurrentlocation(PickupCors);
  }, [PickupCors]);

  useEffect(() => {
    setPickupPlace(filterCarElements.PickupPlace);
    setDropPlace(filterCarElements.DropPlace);
    //setPickupCors(filterCarElements.PickupCors);
    setDropCors(filterCarElements.DropCors);
  }, [filterCarElements]);

  useEffect(() => {
    var caridl = localStorage.getItem("caridl");
    if (carFullInformationList.length > 0) {
      const result = carFullInformationList.filter(
        (carlist) => carlist.carid == caridl
      );
      if (
        result.length > 0 &&
        result[0].latitude != undefined &&
        result[0].longitude != undefined &&
        result[0].latitude != null &&
        result[0].longitude != null
      ) {
        setAgencylocation({
          lat: result[0].latitude,
          lng: result[0].longitude,
          address: result[0].address,
        });
      }
    }
  }, [carFullInformationList]);

  const onPlacePic = (data) => {
    setPickupPlace(data?.address);
    //setPickupPlaceLocation(data?.address);
    setPickupCors(data);

    setPickupLocation(data);
    setCurrentlocation({
      lat: data?.lat,
      lng: data?.lng,
      address: data.address,
    });
  };
  const onAutoCompleteSelect = (data) => {
    setPickupCors(data);
    localValue["PickupCors"] = data;
    localStorage.setItem("searchCriteria", JSON.stringify(localValue));
    setPickupPlace(data?.address);
    setMapRender(true);
    setPickupPlaceLocation(data?.address);
    setPickupLocation(data);
    setVisible(false);
  };
  const RenderMap = () => {
    return (
      <Map
        // google={this.props.google}
        setAddress={onPlacePic}
        //  setPlaces={placetype == 1 ? setPickupPlace : setDropPlace}
        defaultcenter={PickupCors}
        center={PickupCors}
        agency={Agencylocation}
        height="500px"
        width="100%"
        zoom={8}
      />
    );
  };

  return (
    <>
      {" "}
      {visible ? (
        <Modal
          title={getLocaleMessages("Select the pickup location")}
          visible={visible}
          onCancel={onCancel}
          centered
          footer={false}
          className="modal_plan_some"
          width={800}
          forceRender={true}
          maskClosable={false}
          keyboard={false}
        >
          {history.location.pathname == "/detail" &&
            PickupPlace !== undefined && (
              <AutoComplete
                location={PickupPlace !== undefined ? PickupPlace : "unknown"}
                address={PickupPlace !== undefined ? PickupPlace : "unknown"}
                cors={(e) =>
                  placetype == 1 ? onAutoCompleteSelect(e) : setDropCors(e)
                }
              />
            )}
          {RenderMap()}
          {history.location.pathname == "/detail" && (
            <Col span={4}>
              <Button
                type="primary"
                onClick={handleChangeLocation}
                style={{ width: "100px" }}
              >
                {getLocaleMessages("Save")}
              </Button>
            </Col>
          )}
        </Modal>
      ) : (
        <div></div>
      )}{" "}
    </>
  );
};

export default EditPlaceModal;
