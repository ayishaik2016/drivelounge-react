import actions from './actions';

const initState = {
    isLoading: false,
    carList: [],
    carFullInformationList: [],
    carInterriorImagesList: [],
    carReivewList: [],
    selectedCarDetails: [],
    agencyList: [],
    carbrand_data: [],
    cartype_data: [],
    caryear_data: [],
    initialDataLoader: true,
};

export default function carInformationReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_CAR_MODEL_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CAR_MODEL_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    carList: action.payload
                };
            }
        case actions.GET_CAR_MODEL_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
            // information list for displaying cards
        case actions.GET_CAR_FULL_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CAR_FULL_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    carFullInformationList: action.payload
                };
            }
        case actions.GET_CAR_FULL_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_CAR_INTERIOR_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CAR_INTERIOR_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    carInterriorImagesList: action.payload
                };
            }
        case actions.GET_CAR_INTERIOR_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_CAR_REVIEW_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_CAR_REVIEW_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    carReivewList: action.payload
                };
            }
        case actions.GET_CAR_REVIEW_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }

            case actions.GET_CARBRAND_LIST:
                {
                    return {
                        ...state,
                        isLoading: true,
                    };
                }
            case actions.GET_CARBRAND_LIST_SUCCESS:
                {
                    return {
                        ...state,
                        isLoading: false,
                        carbrand_data: action.payload
                    };
                }
            case actions.GET_CARBRAND_LIST_FAILURE:
                {
                    return {
                        ...state,
                        isLoading: false
                    };
                }
                case actions.GET_CARTYPE_LIST:
                    {
                        return {
                            ...state,
                            isLoading: true,
                        };
                    }
                case actions.GET_CARTYPE_LIST_SUCCESS:
                    {
                        return {
                            ...state,
                            isLoading: false,
                            cartype_data: action.payload
                        };
                    }
                case actions.GET_CARTYPE_LIST_FAILURE:
                    {
                        return {
                            ...state,
                            isLoading: false
                        };
                    }
                case actions.GET_CARYEAR_LIST:
                    {
                        return {
                            ...state,
                            isLoading: true,
                        };
                    }
                case actions.GET_CARYEAR_LIST_SUCCESS:
                    {
                        return {
                            ...state,
                            isLoading: false,
                            caryear_data: action.payload
                        };
                    }
                case actions.GET_CARYEAR_LIST_FAILURE:
                    {
                        return {
                            ...state,
                            isLoading: false
                        };
                    }

        default:
            return state;
    }
}