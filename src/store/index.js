import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import rcpUrlReducer from '../features/rcp/rcpSlice';
import levelReducer from '../features/levels/levelsSlice';
import filrReducer from '../features/filr/filrSlice';

const store = configureStore({
	reducer: {
		user: userReducer,
		rcp_url: rcpUrlReducer,
		levels: levelReducer,
		filr: filrReducer,
	},
	middleware: getDefaultMiddleware({
		serializableCheck: false,
	}),
});

export default store;
