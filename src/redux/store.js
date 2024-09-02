import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [];

middlewares.push(sagaMiddleware);

const appReducer = combineReducers({
  ...reducers,
});

const rootReducer = (state, action) => {
  if (action.type === "AUTHENTICATE_USER_FAILURE") {
    state = undefined;
  }
  return appReducer(state, action);
};

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);

export { store, history };
