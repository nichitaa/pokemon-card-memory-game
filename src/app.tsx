import { useEffect } from 'react';
import { game } from '@/game/game.ts';
import { GameWinDialog, Header, PokeDeck } from '@/components';

const App = () => {
  useEffect(() => {
    game.start();
  }, []);

  return (
    <>
      <GameWinDialog />
      <Header />
      <PokeDeck />
    </>
  );
};

export default App;
