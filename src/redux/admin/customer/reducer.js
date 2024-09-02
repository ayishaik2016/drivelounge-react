import actions from "./actions";

const initState = {
  isLoading: false,
  customer_list: [],
  card_list: [],
  initialDataLoader: true,
};

export default function customerInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_CUSTOMER_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CUSTOMER_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        customer_list: action.payload,
      };
    }
    case actions.GET_CUSTOMER_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.SET_CUSTOMER_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CARD_LIST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_CARD_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        card_list: action.payload,
      };
    }
    case actions.GET_CARD_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.SET_CUSTOMER_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.SET_CUSTOMER_STATUS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        customer_list: action.payload,
      };
    }
    case actions.SET_CUSTOMER_STATUS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.SETUP_NEW_CUSTOMER: {
      return {
        ...state,
        loader: true,
      };
    }

    case actions.SETUP_NEW_CUSTOMER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        loader: false,
      };
    }

    case actions.REMOVE_CUSTOMER_DETAILS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_CUSTOMER_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        customer_list: action.payload,
      };
    }
    case actions.REMOVE_CUSTOMER_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
