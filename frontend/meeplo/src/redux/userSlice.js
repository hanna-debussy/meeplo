import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import { MEEPLO_SERVER_BASE_URL } from '@env';
import Images from '../assets/image/index';
import { axiosPrivate } from '../auth/axiosInstance';

export const getUserInfo = createAsyncThunk('user/getUserInfo', async () => {
  try {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    const response = await axiosPrivate.get(`/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error('ERROR in getUserInfo!', err.response.data);
    return isRejectedWithValue(err.response.data);
  }
});

export const editUserInfo = createAsyncThunk('user/editUserInfo', async ({ form, Alert, navigation }) => {
  try {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    await axiosPrivate
      .put(
        `/member`,
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then(() => {
        Alert.alert(`프로필을 수정했습니다.`, '', [
          {
            text: '확인',
          },
        ]);
      });
    console.log('userInfo EDITED!');
  } catch (err) {
    console.error('ERROR in editUserInfo!', err);
    return isRejectedWithValue(err.response?.data);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async ({ Alert, navigation }) => {
  try {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    await axiosPrivate
      .delete(`/member`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        Alert.alert(`성공적으로 탈퇴하였습니다.`, '', [
          {
            text: '확인',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]);
      });
    console.log('user DELETED!');
  } catch (err) {
    console.error('ERROR in deleteUser!', err);
    return isRejectedWithValue(err.response?.data);
  }
});

export const createStartLocation = createAsyncThunk('user/createStartLocation', async ({ form }) => {
  try {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    await axiosPrivate.post(
      `/member/location`,
      { ...form },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (err) {
    console.error('ERROR in createStartLocation', err);
    return isRejectedWithValue(err.response?.data);
  }
});

export const deleteStartLocation = createAsyncThunk('user/deleteStartLocation', async ({ locationId }) => {
  try {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    await axiosPrivate.delete(`/member/location/${locationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    console.error('ERROR in deleteStartLocation', err);
    return isRejectedWithValue(err.response?.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {
      nickname: 'String',
      id: 1,
      profilePhoto: Images.frame.defaultImage.uri,
      startLocations: [
        {
          id: -1,
          name: 'String',
          lat: 0.1,
          lng: 0.1,
          address: 'String',
        },
      ],
    },
    isLoginLoading: false,
    isLoggedIn: false,
  },
  extraReducers: {
    [getUserInfo.pending]: (state, { payload }) => {
      state.isLoginLoading = true;
      state.isLoggedIn = false;
    },
    [getUserInfo.fulfilled]: (state, { payload }) => {
      state.isLoginLoading = false;
      state.isLoggedIn = true;
      state.info = payload;
    },
  },
});

export { userSlice };