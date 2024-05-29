import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-content.ingresso.com/v0/',
});

// events
/* export async function getMovieDataByID(id: string) {
  return await api.get<IIngressoMovieDataResponse>(`/events/${id}`);
} */

export async function getMovieDataByUrlKey(urlKey: string) {
  return await api.get<IIngressoMovieDataResponse>(`/events/url-key/${urlKey}`);
}

// states
export async function getStates() {
  return await api.get<IIngressoStatesResponse[]>('/states');
}

/* export async function getCities(uf: string) {
  return await api.get<IIngressoStatesResponse>(`/states/${uf}`);
} */

// sessions
export async function getSessions(
  cityId: number | string,
  eventId: number | string,
) {
  return await api.get<IIngressoGetSessionsResponse>(
    `/sessions/city/${cityId}/event/${eventId}?&includeOperationPolicies=false`,
  );
}
