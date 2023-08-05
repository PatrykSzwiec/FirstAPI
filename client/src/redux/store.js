import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// import reducers
import concerts from './concertsRedux';
import seats, { startRefreshInterval, clearRefreshInterval} from './seatsRedux';

// combine reducers
const rootReducer = combineReducers({
  concerts,
  seats,
});

const store = createStore(
  rootReducer,
  compose(
		applyMiddleware(thunk),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

// Start the refresh interval when the store is initialized
startRefreshInterval(store.dispatch);

// Clear the refresh interval when the app is unmounted
window.addEventListener('beforeunload', () => {
  clearRefreshInterval();
});

export default store;
