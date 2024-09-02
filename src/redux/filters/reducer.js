import actions from './actions';
import _ from 'lodash';

const initState = {
    filters: {}
}

export default function Filters(state = initState, action){
    switch (action.type) {
      case "ADD_FILTER":
        let currentAddFilter =
          state.filters[action.payload.name] && state.filters[action.payload.name].length
            ? state.filters[action.payload.name]
            : [];
        currentAddFilter.push(action.payload.value);
        const newAddState = Object.assign({}, state.filters, {
          [action.payload.name]: [...new Set(currentAddFilter)]
        });
        return Object.assign({}, state, { filters: newAddState });
      case "REMOVE_FILTER":
        let currentRemoveFilter =
          state.filters[action.payload.name] && state.filters[action.payload.name].length
            ? state.filters[action.payload.name]
            : [];
        currentRemoveFilter = _.pull(currentRemoveFilter, action.payload.value);
  
        const newRemoveState = Object.assign({}, state.filters, {
          [action.payload.name]: currentRemoveFilter
        });
        return Object.assign({}, state, { filters: newRemoveState });
      case "CLEAR_FILTERS":
        return Object.assign({}, state, { filters: {} });
      default:
        return state;
    }
  };