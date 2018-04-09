import { API_ADDRESS } from '../config/connections';

const axios = require('axios');

export const GET_CAR_REQUEST = 'GET_CAR_REQUEST';
export const GET_CAR_SUCCESS = 'GET_CAR_SUCCESS';
export const GET_CAR_FAILURE = 'GET_CAR_FAILURE';

export function carFetchFailure(bool) {
  return {
    type: 'GET_CAR_FAILURE',
    hasErrored: bool,
  };
}
export function carFetchLoading(bool) {
  return {
    type: 'GET_CAR_REQUEST',
    isLoading: bool,
  };
}
export function carFetchSuccess(car) {
  return {
    type: 'GET_CAR_SUCCESS',
    car,
  };
}

export function getCar(nr) {
  return (dispatch) => {
    dispatch(carFetchLoading(true));

    axios.post(API_ADDRESS + '/api/dsm?regnr=' + nr)
      .then((response) => {
        dispatch(carFetchLoading(false));

        if (!response.ok) {
          dispatch(carFetchFailure(true));
        }
        dispatch(carFetchFailure(false));
        dispatch(carFetchSuccess(JSON.stringify(response.data)));
      })
      .catch((error) => {
        dispatch(carFetchLoading(false));
        dispatch(carFetchSuccess(''));

        if (error.response.status === 404) {
          dispatch(carFetchFailure(true));
        } else {
          console.error(error);
          throw error;
        }
      });
  };
}
