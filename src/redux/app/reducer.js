import actions from './actions';
// import { getCurrentPath } from 'redux/helper';

const initState = {
  currentKey: '',
  siderSubMenu: [],
  siderCollapsed: false
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_CURRENT_MENU: {
      return {
        ...state,
        currentKey: action.payload,
      };
    }
    case actions.SHOW_SUBSIDER_MENU: {
      return {
        ...state,
        siderSubMenu: action.payload,
      };
    }
    case actions.CHANGE_SIDERMENU_COLLAPSED: {
      return {
        ...state,
        siderCollapsed: action.payload,
      };
    }
    default:
      return state;
  }
}
