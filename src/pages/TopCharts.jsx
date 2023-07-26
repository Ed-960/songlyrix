import { useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { useGetTopChartsByGenreQuery } from '../redux/services/shazamCore';

const TopCharts = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: TopChartsSongs, isFetching, error } = useGetTopChartsByGenreQuery('POP');

  if (isFetching) return <Loader title="Loading top charts" />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Discover Top Charts</h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {TopChartsSongs?.tracks?.map((song, i) => (
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

export default TopCharts;
