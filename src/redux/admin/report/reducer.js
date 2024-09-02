import actions from './actions';

const initState = {
    isLoading: false,
    user_report: [],
    admin_report: [],
    agency_report: [],
    zatvatrept_list: [],
    billrept_list: [],
    bookingrept_list: [],
    canceledbookingrept1_list: [],
    canceledbookingrept2_list: [],
    totalbookingrept_list: []    
};

export default function ReportsReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_USER_REPORT:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_USER_REPORT_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    user_report: action.payload
                };
            }
        case actions.GET_USER_REPORT_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }

            case actions.GET_AGENCY_REPORT:
                {
                    return {
                        ...state,
                        isLoading: true,
                    };
                }
            case actions.GET_AGENCY_REPORT_SUCCESS:
                {
                    return {
                        ...state,
                        isLoading: false,
                        agency_report: action.payload
                    };
                }
            case actions.GET_AGENCY_REPORT_FAILURE:
                {
                    return {
                        ...state,
                        isLoading: false
                    };
                }

                case actions.GET_ADMIN_REPORT:
                    {
                        return {
                            ...state,
                            isLoading: true,
                        };
                    }
                case actions.GET_ADMIN_REPORT_SUCCESS:
                    {
                        return {
                            ...state,
                            isLoading: false,
                            admin_report: action.payload
                        };
                    }
                case actions.GET_ADMIN_REPORT_FAILURE:
                    {
                        return {
                            ...state,
                            isLoading: false
                        };
                    }

        case actions.GET_ZATVATREPT_LIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_ZATVATREPT_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    zatvatrept_list: action.payload
                };
            }
        case actions.GET_ZATVATREPT_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_BILLREPT_LIST:
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case actions.GET_BILLREPT_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    billrept_list: action.payload
                }
            }
        case actions.GET_BILLREPT_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                }
            }   
        case actions.GET_BOOKINGREPT_LIST:
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case actions.GET_BOOKINGREPT_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    bookingrept_list: action.payload
                }
            }
        case actions.GET_BOOKINGREPT_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                }
            }    
        case actions.GET_CANCELEDBOOKINGREPT1_LIST:
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case actions.GET_CANCELEDBOOKINGREPT1_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    canceledbookingrept1_list: action.payload
                }
            }
        case actions.GET_CANCELEDBOOKINGREPT1_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                }
            }     
        case actions.GET_CANCELEDBOOKINGREPT2_LIST:
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case actions.GET_CANCELEDBOOKINGREPT2_LIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    canceledbookingrept2_list: action.payload
                }
            }
        case actions.GET_CANCELEDBOOKINGREPT2_LIST_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                }
            }  
            case actions.GET_TOTALBOOKINGREPT_LIST:
                {
                    return {
                        ...state,
                        isLoading: true
                    }
                }
            case actions.GET_TOTALBOOKINGREPT_LIST_SUCCESS:
                {
                    return {
                        ...state,
                        isLoading: false,
                        totalbookingrept_list: action.payload
                    }
                }
            case actions.GET_TOTALBOOKINGREPT_LIST_FAILURE:
                {
                    return {
                        ...state,
                        isLoading: false
                    }
                }                                                           
        default:
            return state;
    }
}