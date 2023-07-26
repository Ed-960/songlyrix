import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { setSearchCount } from '../redux/features/countSlice';
import { useGetSongsBySearchQuery } from '../redux/services/shazamCore';

const Search = () => {
  const dispatch = useDispatch();
  const { searchTerm } = useParams();
  const [clickCountonMore, setClickCountonMore] = useState(0);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { searchCount } = useSelector((state) => state.count);

  const getMoreMusics = () => {
    setClickCountonMore((prev) => prev + 1);
    dispatch(setSearchCount());
  };

  const { data: SearchedSongs, isFetching, error } = useGetSongsBySearchQuery({ searchTerm, searchCount });

  const songs = SearchedSongs?.tracks?.hits?.map((song) => ({
    adamid: song.artists[0]?.adamid,
    title: song.heading?.title,
    subtitle: song.heading?.subtitle,
    key: song.key,
    images: {
      coverart: song.stores?.apple?.coverarturl,
    },
    hub: {
      actions: [{}, { uri: song.stores?.apple?.previewurl }],
    },
  }));

  if (isFetching) return <Loader title="Loading top charts" />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Results for <span className="font-black">{searchTerm}</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {songs?.map((song, i) => (
          <SongCard
            key={song.key}
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            i={i}
          />
        ))}
      </div>
      <button
        onClick={getMoreMusics}
        type="button"
        disabled={clickCountonMore >= 2}
        className="mt-12 text-lg text-white bg-indigo-600 py-3 px-6 rounded-lg shadow-md
         hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105
          disabled:scale-100 disabled:bg-red-500 mx-20"
      >
        more songs
      </button>
    </div>
  );
};

export default Search;
