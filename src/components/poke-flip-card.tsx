import { cn } from '@/lib/utils.ts';
import PokeBall from '../assets/ball.svg?react';
import { game, PokeCard } from '@/game/game.ts';

export const PokeFlipCard = ({ svg, name, open, cardId }: PokeCard) => {
  return (
    <div className='cursor-pointer h-[250px] [perspective:1000px] ' onClick={() => game.flip(cardId)}>
      <div
        className={cn(
          'p-4 relative h-full w-full border-2 rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] [backface-visibility:hidden]',
          { '[transform:rotateY(180deg)]': open }
        )}
      >
        <div className={'absolute inset-0 size-full flex items-center justify-center'}>
          <div className={'w-[100px]'}>
            <PokeBall />
          </div>
        </div>
        <div className='p-4 absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 rounded-xl'>
          <div className={'flex flex-col gap-2 h-full justify-center items-center'}>
            <h3 className={'text-center tracking-widest'}>{name}</h3>
            <div
              style={{ backgroundImage: `url(${svg})` }}
              className={`bg-no-repeat bg-contain bg-center w-full h-full`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
