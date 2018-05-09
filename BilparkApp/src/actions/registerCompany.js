import { API_ADDRESS } from '../config/connections';

const axios = require('axios');

/* Save company for user */

export const REGISTER_COMPANY_REQUEST = 'REGISTER_COMPANY_REQUEST';
export const REGISTER_COMPANY_COMPLETE = 'REGISTER_COMPANY_COMPLETE';
export const REGISTER_COMPANY_FAILURE = 'REGISTER_COMPANY_FAILURE';

export function registerCompanyRequest(boolean) {
  return {
    type: REGISTER_COMPANY_REQUEST,
    isLoading: boolean,
  };
}

export function registerCompanyComplete(company) {
  return {
    type: REGISTER_COMPANY_COMPLETE,
    company,
  };
}

export function registerCompanyFailure(boolean) {
  return {
    type: REGISTER_COMPANY_FAILURE,
    hasErrored: boolean,
  };
}

export function saveCompany(CompanyID) {
  return (dispatch) => {
    dispatch(registerCompanyRequest(true));

    return axios.post(API_ADDRESS + '/api/company/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      CompanyID,
    })
      .then((response) => {
        if (!response.ok) {
          dispatch(registerCompanyFailure(true));
        }
      })
      .then((company) => {
        dispatch(registerCompanyComplete(company));
      })
      .catch(() => {
        dispatch(registerCompanyFailure(true));
      });
  };
}


/* Get all companies */

// HENRIK
// fjern det under hvis du ikke bruker det, har ikke laget reducers, og det er ikke ferdig

export const GET_COMPANIES_REQUEST = 'GET_COMPANIES_REQUEST';
export const GET_COMPANIES_COMPLETE = 'GET_COMPANIES_COMPLETE';
export const GET_COMPANIES_FAILURE = 'GET_COMPANIES_FAILURE';

export function getCompaniesRequest(isLoading) {
  return {
    type: GET_COMPANIES_REQUEST,
    isLoading,
  };
}

export function getCompaniesComplete(companies) {
  return {
    type: GET_COMPANIES_COMPLETE,
    companies,
  };
}

export function getCompaniesError(hasErrored) {
  return {
    type: GET_COMPANIES_FAILURE,
    hasErrored,
  };
}

export function getCompanies() {
  return (dispatch) => {
    dispatch(getCompaniesRequest(true));
    dispatch(getCompaniesError(false));

    return axios.get(API_ADDRESS + '/api/company/find')
      .then((response) => {
        dispatch(getCompaniesRequest(false));
        if (response.ok) {
          dispatch(getCompaniesComplete(response.data));
        }
        dispatch(getCompaniesError(true));
      })
      .catch(() => {
        dispatch(getCompaniesError(true));
      });
  };
}
