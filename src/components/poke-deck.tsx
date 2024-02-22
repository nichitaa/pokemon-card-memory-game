import { Game, game } from '@/game/game.ts';
import { useObservableEagerState } from 'observable-hooks';
import { LoadingSpinner } from '@/components/loading-spinner.tsx';
import { PokeFlipCard } from '@/components/poke-flip-card.tsx';

export const PokeDeck = () => {
  const status = useObservableEagerState(game.status$);
  const pokes = useObservableEagerState(game.cards$);

  if (status === Game.STATUS.loading) return <LoadingSpinner />;
  return (
    <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {pokes?.map((poke) => <PokeFlipCard key={poke.cardId} {...poke} />)}
    </div>
  );
};
