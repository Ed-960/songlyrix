import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, Loader, SongBar } from '../components';
import { useGetArtistDetailsQuery } from '../redux/services/shazamCore';

const ArtistDetails = () => {
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: artistData, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery(artistId);

  if (isFetchingArtistDetails) {
    return <Loader title="Searching song details" />;
  }

  if (error) return <Error />;
  const artist = artistData?.data[0]?.attributes;

  return (
    <div className="flex flex-col">
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />
        <div className="absolute inset-0 flex items-center">
          <img
            src={artist?.artwork?.url.replace('{w}', '125').replace('{h}', '125')}
            alt="art"
            className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover
              border-2 shadow-xl shadow-black"
          />
          <div className="ml-5">
            <p className="font-bold sm:text-3xl text-xl text-white">{artist?.artistName}</p>
            <p className="text-base text-gray-400 mt-2">
              {artist?.genreNames[0]}
            </p>
          </div>
        </div>
        <div className="w-full sm:h-44 h-24" />
      </div>
      <h1 className="font-bold text-3xl text-white">Related Songs:</h1>
      <div className="mt-6 w-full flex flex-col">
        {artistData?.data.map((song, i) => (
          <SongBar
            key={`${song.id}-${artistId}`}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistDetails;
