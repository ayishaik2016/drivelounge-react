import actions from './actions';

const initState = {
    isLoading: false,
    applications: [],
    initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_APPLICATION_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_APPLICATION_INFO_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          applications: action.payload
        };
    }
    case actions.GET_APPLICATION_INFO_FAILURE: {
        return {
            ...state,
            isLoading: false
        };
    }
    case actions.CHANGE_APPLICATION_STATUS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHANGE_APPLICATION_STATUS_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          applications: action.payload
        };
    }
    case actions.CHANGE_APPLICATION_STATUS_FAILURE: {
        return {
            ...state,
            isLoading: false
        };
    }
    case actions.REMOVE_APPLICATION_DETAILS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_APPLICATION_DETAILS_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          applications: action.payload
        };
    }
    case actions.REMOVE_APPLICATION_DETAILS_FAILURE: {
        return {
            ...state,
            isLoading: false
        };
    }
    default:
      return state;
  }
}
