import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shazamCoreApi = createApi({
  reducerPath: 'shazamCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shazam-api7.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', '4f618068dbmsh016ca202ea35ff7p1f1f4cjsn2fca70a2505e');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopChartsByGenre: builder.query({
      query: ({ genreListId, songCount }) => `/charts/get-top-songs-in_world_by_genre?genre=${genreListId || 'POP'}&limit=${songCount || '20'}`,
    }),
    getSongDetails: builder.query({
      query: (songid) => `/songs/get_details?id=${songid}` }),
    getSongRelated: builder.query({
      query: (songid) => `/songs/list-recommendations?id=${songid}&limit=10` }),
    getArtistDetails: builder.query({
      query: (artistId) => `/artist/get-top-songs?id=${artistId}&offset=0` }),
    getSongsByCountry: builder.query({
      query: (countryCode) => `/charts/get-top-songs-in-country?country_code=${countryCode}&limit=20` }),
    getSongsBySearch: builder.query({
      query: ({ searchTerm, searchCount }) => `/search?term=${searchTerm}&limit=${searchCount || 20} ` }),
    PostSongToIdentify: builder.query({
      query: (base64Data) => ({
        headers: {
          'Content-Type': 'audio/wav',
        },
        url: '/songs/recognize-song',
        method: 'post',
        body: base64Data,
      }),
    }),
  }),
});

export const {
  useGetTopChartsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  usePostSongToIdentifyQuery,
} = shazamCoreApi;
