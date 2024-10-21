// Redux store configuration (store.js)

import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { trackEvent } from 'react-tracking'; // Import trackEvent function
import { thunk } from 'redux-thunk'; // This is incorrect
import axios from 'axios'; //'
// import { useSelector, useDispatch } from "react-redux";
 


// Define action types
const ADD_TRACKING_DATA = 'ADD_TRACKING_DATA';
const SEND_TRACKING_DATA_SUCCESS = 'SEND_TRACKING_DATA_SUCCESS';
const SEND_TRACKING_DATA_FAILURE = 'SEND_TRACKING_DATA_FAILURE';

// Define initial state
const initialState = {
  accountInfo: null,
  conversation: [], // Initialize conversation as an empty array
  // Other initial state properties
  trackingData: [],
};

// Define reducer function
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ACCOUNT_INFO':
      return { ...state, accountInfo: action.payload };
    case 'CLEAR_ACCOUNT_INFO':
      return { ...state, accountInfo: null };
      case 'ADD_MESSAGE':
        // Assuming action.payload includes both role and content
        const newMessage = { ...action.payload, isNew: true }; // Set isNew property to true for new messages
        return {
          ...state,
          conversation: [...state.conversation, newMessage],
        };
    case 'CLEAR_MESSAGES':
      return { ...state, conversation: [] }; // Clear all messages
    // Handle other actions
    case 'ADD_TRACKING_DATA':
      return {
        ...state,
        trackingData: [...state.trackingData, { data: action.payload, timestamp: getCurrentTime() }],
      };
    case SEND_TRACKING_DATA_SUCCESS:
      return state; // No need to update state further on success
    case SEND_TRACKING_DATA_FAILURE:
      return state; // No need to update state further on failure
    default:
      return state;
  }
}

// Function to get current time
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Configure Redux persist
const persistConfig = {
  key: 'root',
  storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Apply Redux Thunk middleware
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create Redux persistor
export const persistor = persistStore(store);

export const addTrackingData = (trackingData) => {
  return (dispatch, getState) => {
    const accountInfo = getState().accountInfo; // Renamed from data
    // console.log('Account info:', accountInfo); // Debugging statement
    if (!accountInfo) {
      console.error('Account info is null'); // Debugging statement
      return; // Exit early if accountInfo is null
    }

    const username = accountInfo.account.userName;
    // console.log('Username:', username); // Debugging statement

    dispatch({
      type: 'ADD_TRACKING_DATA',
      payload: { username, trackingData }, // Changed data to trackingData
    });

    // console.log('Tracking data to be sent to the database:', trackingData);
    sendTrackingDataToDB(dispatch, trackingData, username);
  };
};


// Wrap trackEvent to dispatch tracking data to Redux store
export const trackEventToReduxStore = (dispatch) => (data) => {
  dispatch(addTrackingData(data));
};

export const addMessage = (message) => ({
  type: 'ADD_MESSAGE',
  payload: message,
});

export const clearMessages = () => ({
  type: 'CLEAR_MESSAGES',
});


export const sendTrackingDataToDB = (dispatch, trackingData, username) => {
  const requestData = { data: trackingData, username };
  // console.log('Request Data:', requestData);
  
  axios.post('http://localhost:3001/api/tracking', requestData)
    .then(response => {
      dispatch({ type: SEND_TRACKING_DATA_SUCCESS });
    })
    .catch(error => {
      dispatch({ type: SEND_TRACKING_DATA_FAILURE, payload: error.message });
    });
};
// Export store
export default store;
