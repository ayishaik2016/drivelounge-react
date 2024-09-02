import actions from "./actions";

const initState = {
  isLoading: false,
  couponList: [],
  couponCode: "",
  userList: [],
  agencyList: [],
  initialDataLoader: true,
  coupon: {},
};

export default function CouponManagementReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_COUPON_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_COUPON_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        couponList: action.payload,
      };
    }
    case actions.GET_COUPON_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        coupon: action.payload,
      };
    }
    case actions.GET_COUPON_BY_ID__FAILURE: {
      return {
        ...state,
        isLoading: false,
        coupon: {},
      };
    }
    case actions.GET_COUPON_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GENERATE_COUPON_CODE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GENERATE_COUPON_CODE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        couponCode: action.payload.data,
      };
    }
    case actions.GENERATE_COUPON_CODE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.CREATE_NEW_COUPON: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_NEW_COUPON_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        couponList: action.payload,
      };
    }
    case actions.CREATE_NEW_COUPON_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.REMOVE_COUPON: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_COUPON_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        couponList: action.payload,
      };
    }
    case actions.REMOVE_COUPON_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.GET_USERS_AGENCY_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_USERS_AGENCY_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userList: action.payload.user,
        agencyList: action.payload.agency,
      };
    }
    case actions.GET_USERS_AGENCY_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
