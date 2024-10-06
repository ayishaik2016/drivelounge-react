import actions from "./actions";

const initState = {
  isLoading: false,
  reservationinfo: [],
  paymentOption: [],
  bookinginfo: [],
  userinfo: [],
  profile: [],
  userreviewlist: [],
  initialDataLoader: true,
  mybookinginfo: [],
  SelectedBookingInfo: [],
  DropoffList: [],
  PickupList: [],
};

export default function carReservationReducer(state = initState, action) {
  switch (action.type) {
    case actions.CREATE_CAR_RESERVATION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_CAR_RESERVATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        reservationinfo: action.payload,
      };
    }
    case actions.CREATE_CAR_RESERVATION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_CAR_RESERVATION_BYID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CAR_RESERVATION_BYID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        reservationinfo: action.payload,
      };
    }
    case actions.GET_CAR_RESERVATION_BYID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_PAYMENT_OPTION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_PAYMENT_OPTION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        paymentOption: action.payload,
      };
    }
    case actions.GET_PAYMENT_OPTION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_USER_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userinfo: action.payload,
      };
    }
    case actions.GET_USER_INFO_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_BOOKING_CONFIRMATION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_PAYMENT_CONFIRMATION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_BOOKING_CONFIRMATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        bookinginfo: action.payload,
      };
    }
    case actions.GET_BOOKING_CONFIRMATION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_MYBOOKING_INFORMATION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_MYBOOKING_INFORMATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        mybookinginfo: action.payload,
      };
    }
    case actions.GET_MYBOOKING_INFORMATION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_USER_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
      };
    }
    case actions.GET_USER_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PROFILE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
      };
    }
    case actions.UPDATE_USER_PROFILE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_AGENCY_PASSWORD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_AGENCY_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_AGENCY_PASSWORD_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PASSWORD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_USER_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_USER_PASSWORD_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_USER_REVIEW: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_USER_REVIEW_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userreviewlist: action.payload,
      };
    }
    case actions.GET_USER_REVIEW_FALIURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CANCEL_BOOKING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CANCEL_BOOKING_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        mybookinginfo: action.payload,
      };
    }
    case actions.CANCEL_BOOKING_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.EDIT_BOOKING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.EDIT_BOOKING_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        mybookinginfo: action.payload,
      };
    }
    case actions.EDIT_BOOKING_REQUEST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.MAKE_ADMIN_PAYMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.MAKE_ADMIN_PAYMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.MAKE_ADMIN_PAYMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.GET_BOOKING_INFOBYID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_BOOKING_INFOBYID_SUCCESS: {
      let pi = [];
      let pick = action.payload.data.filter((obj) =>
        Object.keys(obj).includes("pickup")
      );
      let pick1 = pick.map((pick) =>
        pi.push({
          imageurl: pick.imageurl,
          name: pick.imageurl,
          status: "done",
          url: `https://api.drivelounge.com/${pick.imageurl}`,
        })
      );
      let dro = [];

      let drop = action.payload.data.filter((obj) =>
        Object.keys(obj).includes("dropoff")
      );
      let drop1 = drop.map((drop) =>
        dro.push({
          imageurl: drop.imageurl,
          name: drop.imageurl,
          status: "done",
          url: `https://api.drivelounge.com/${drop.imageurl}`,
        })
      );

      return {
        ...state,
        isLoading: false,
        DropoffList: dro?.length > 0 ? dro : [],
        PickupList: pi,
        SelectedBookingInfo: action.payload.data[0],
      };
    }
    case actions.GET_BOOKING_INFOBYID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.SET_BOOKING_START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.SET_BOOKING_START_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        SelectedBookingInfo: action.payload,
      };
    }
    case actions.SET_BOOKING_START_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.SET_BOOKING_STOP: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.SET_BOOKING_STOP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        SelectedBookingInfo: action.payload,
      };
    }
    case actions.SET_BOOKING_STOP_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPLOAD_PICKUP_IMAGES: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPLOAD_PICKUP_IMAGES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        PickupList: action.payload,
      };
    }
    case actions.UPLOAD_PICKUP_IMAGES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPLOAD_DROPOFF_IMAGES: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPLOAD_DROPOFF_IMAGES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        DropoffList: action.payload,
      };
    }
    case actions.UPLOAD_DROPOFF_IMAGES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
