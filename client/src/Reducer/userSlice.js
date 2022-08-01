import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    displayName: '',
    uid: '',
    accessToken: '',
    photoURL: '',
    isLoading: false,
  },
  reducers: {
    loginUser: (state, action) => {
        state.displayName = action.payload.displayName;
        state.uid = action.payload.uid;
        state.accessToken = action.payload.accessToken;
        state.photoURL = action.payload.photoURL;
        state.isLoading = true;
    },
    clearUser: (state) => {
        state.displayName = '';
        state.uid = '';
        state.accessToken = '';
        state.photoURL = '';
        state.isLoading = true;
    }
  }
});

export const { loginUser, clearUser } = userSlice.actions;

export default configureStore({
  reducer: {
    user: userSlice.reducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
});
