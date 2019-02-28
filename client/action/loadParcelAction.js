import {
  LOAD_PARCEL_ORDER,
  CURRENT_PARCEL_ORDER
} from '../constants/action-types';

export const loadParcelOrder = parcels => {
  return {
    type: LOAD_PARCEL_ORDER,
    parcels
  };
};

export const singleParcelOrder = parcel => {
  return {
    type: CURRENT_PARCEL_ORDER,
    parcel
  };
};

export const loadParcel = () => dispatch => {
  return fetch(`/api/v1/users/${localStorage.getItem('userid')}/parcels`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'x-access-token': localStorage.getItem('token')
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.message == 'Parcels retrieved successfully') {
        dispatch(loadParcelOrder(res.data));
      }
      return res;
    })
    .catch(error => {
      throw error;
    });
};

export const loadSingleParcel = (parcelId) => dispatch => {
  return fetch(`/api/v1/users/${localStorage.getItem('userid')}/${parcelId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'x-access-token': localStorage.getItem('token')
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.message == 'Parcel retrieved successfully') {
        dispatch(singleParcelOrder(res.data));
      }
      return res;
    })
    .catch(error => {
      throw error;
    });
};
