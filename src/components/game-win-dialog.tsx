import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useObservableEagerState } from 'observable-hooks';
import { Button } from '@/components/ui/button.tsx';
import { game, Game } from '@/game/game.ts';

export const GameWinDialog = () => {
  const state = useObservableEagerState(game.status$);

  return (
    <Dialog
      open={state === Game.STATUS.win}
      onOpenChange={(open) => {
        if (!open) game.start();
      }}
    >
      <DialogContent className={'w-[300px]'}>
        <DialogHeader>
          <DialogTitle className={'text-4xl tracking-widest text-center'}>WINNER</DialogTitle>
        </DialogHeader>
        <DialogFooter className='justify-end'>
          <DialogClose asChild>
            <Button className={'w-full tracking-widest'} onClick={() => game.start()}>
              Play again
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
