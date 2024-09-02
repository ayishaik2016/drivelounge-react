import actions from './actions';

const initState = {
    isLoading: false,
    admin_dashboard_count: [],
    admin_dashboard_bookings: [],
    admin_dashboard_car: [],
    piechartcount: [],
    barchartcount: [],
    initialDataLoader: true,
};

export default function dashboardInformationReducer(state = initState, action) {
    switch (action.type) {

        case actions.GET_DASHBOARD_COUNTS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_DASHBOARD_COUNTS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    admin_dashboard_count: action.payload
                };
            }
        case actions.GET_DASHBOARD_COUNTS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_DASHBOARD_PIE_COUNTS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_DASHBOARD_PIE_COUNTS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    piechartcount: action.payload
                };
            }
        case actions.GET_DASHBOARD_PIE_COUNTS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_DASHBOARD_BAR_COUNTS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_DASHBOARD_BAR_COUNTS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    barchartcount: action.payload
                };
            }
        case actions.GET_DASHBOARD_BAR_COUNTS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }
        case actions.GET_DASHBOARD_BOOKINGS:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_DASHBOARD_BOOKINGS_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    admin_dashboard_bookings: action.payload
                };
            }
        case actions.GET_DASHBOARD_BOOKINGS_FAILURE:
            {
                return {
                    ...state,
                    isLoading: false
                };
            }

        case actions.GET_DASHBOARD_CARLIST:
            {
                return {
                    ...state,
                    isLoading: true,
                };
            }
        case actions.GET_DASHBOARD_CARLIST_SUCCESS:
            {
                return {
                    ...state,
                    isLoading: false,
                    admin_dashboard_car: action.payload
                };
            }
        case actions.GET_DASHBOARD_CARLIST_FAILURE:
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