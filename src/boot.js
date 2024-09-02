import { store } from 'redux/store';
import actions from 'redux/auth/actions';

export default () => new Promise(() => {
    store.dispatch({ type: actions.VALIDATE_AUTH_TOKEN });
  });