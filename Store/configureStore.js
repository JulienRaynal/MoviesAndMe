import {createStore} from 'redux';
import toggleFavorite from './Reducers/favoriteReducer';
import setAvatar from './Reducers/avatarReducer';
import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

//We persist the reducers through these actions
const rootPersistConfig = {
  //mandatory paramaters
  //allows our library to identify a unique store that persisted
  key: 'root',
  //the type of storage we use (redux-persist/lib/storage == local storage)
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(rootPersistConfig, {toggleFavorite, setAvatar}),
);
