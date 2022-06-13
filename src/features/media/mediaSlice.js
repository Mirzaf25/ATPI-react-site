import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	media: [],
};
const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setMedia: (state, { payload }) => {
			state.media = payload.map(({ id, title, source_url }) => ({
				id: id,
				title: title,
				source_url: source_url,
			}));
		},
	},
});

export const {
	actions: { setMedia },
} = mediaSlice;
export default mediaSlice.reducer;
