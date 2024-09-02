import actions from "./actions";

const initState = {
  isLoading: false,
  bookings: [],
  initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_BOOKING_LOADER: {
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    }
    case actions.GET_CARBOOKING_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CARBOOKING_INFO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        bookings: action.payload,
      };
    }
    case actions.GET_CARBOOKING_INFO_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CHANGE_BOOKING_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_BOOKING_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CHANGE_BOOKING_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
