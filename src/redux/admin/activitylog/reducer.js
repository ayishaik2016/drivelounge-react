import actions from './actions';

const initState = {
    isLoading: false,
    activitylog: [],
    pagination: [],
    initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_ACTIVITYLOG_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.GET_ACTIVITYLOG_INFO_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          activitylog: action.payload.data,
          pagination: action.payload.metadata
        };
    }
    case actions.GET_ACTIVITYLOG_INFO_FAILURE: {
        return {
            ...state,
            isLoading: false
        };
    }
    case actions.REMOVE_ACTIVITYLOG_INFO: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.REMOVE_ACTIVITYLOG_INFO_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          activitylog: action.payload.data,
          pagination: action.payload.metadata
        };
    }
    case actions.REMOVE_ACTIVITYLOG_INFO_FAILURE: {
        return {
            ...state,
            isLoading: false
        };
    }
    
    default:
      return state;
  }
}
