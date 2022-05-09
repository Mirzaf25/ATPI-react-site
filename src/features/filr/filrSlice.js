import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	files: [],
	loading: false,
};

const filrSlice = createSlice({
	name: 'filr',
	initialState,
	reducers: {
		// createFolder: (state, payload) => {
		// 	console.log('Called...', payload);
		// },
		setFilrLoading: (state, { payload }) => {
			state.loading = payload;
		},
	},
});

export const { setFilrLoading } = filrSlice.actions;

export default filrSlice.reducer;
