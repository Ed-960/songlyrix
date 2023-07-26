import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const AroundYou = () => {
  const [countryCode, setCountryCode] = useState('');
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: aroundYouSongs, isFetching, error } = useGetSongsByCountryQuery(countryCode);

  useEffect(() => {
    axios.get('https://geo.ipify.org/api/v2/country?apiKey=at_RYm8QjXIH4oAAf0q6i3uxvbZWEpFD')
      .then((res) => setCountryCode(res?.data?.location?.country))
      .catch(() => new Error(error.message))
      .finally(() => setLoading(false));
  }, [countryCode]);

  if (isFetching && loading) return <Loader title="Loading songs around you" />;
  if (error) {
    setCountryCode('US');
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Around you
        &#40;{' '}
        <span className="font-black">{countryCode}</span>
        {' '}&#41;
      </h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {aroundYouSongs?.map((song, i) => (
          <SongCard
            key={song.key}
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;
