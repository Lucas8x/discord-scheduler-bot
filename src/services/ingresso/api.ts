import axios from 'axios';
import { StatesResponse } from '../../interfaces/IIngresso';

const api = axios.create({
  baseURL: 'https://api-content.ingresso.com/v0/',
});

// events
export const getMovieDataByID = async (id: string) =>
  await api.get(`/events/${id}`);

export const getMovieDataByUrlKey = async (urlKey: string) =>
  await api.get(`/events/url-key/${urlKey}`);

// states
export const getStates = async (): Promise<Array<StatesResponse>> =>
  await api.get('/states');

export const getCities = async (uf: string): Promise<StatesResponse> =>
  await api.get(`/states/${uf}`);

// sessions
export const getSessions = async (
  cityId: number | string,
  eventId: number | string
) =>
  await api.get(
    `/sessions/city/${cityId}/event/${eventId}?&includeOperationPolicies=false`
  );
