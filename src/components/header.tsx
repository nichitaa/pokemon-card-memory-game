import { ThemeToggle } from '@/components/theme-toggle.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { useObservableEagerState } from 'observable-hooks';
import { Game, game } from '@/game/game.ts';

export const Header = () => {
  const matchLimit = useObservableEagerState(game.matchLimit$);
  const groupLimit = useObservableEagerState(game.groupLimit$);

  return (
    <div className={'flex justify-between px-4 py-2 flex-col sticky top-0 z-10 bg-background shadow-lg sm:flex-row'}>
      <h1 className='scroll-m-20 text-4xl lg:text-5xl tracking-wide'>Remember them?</h1>
      <div className={'flex items-center gap-2 justify-between sm:justify-center'}>
        <div className={'flex items-center justify-center gap-2'}>
          <Select value={matchLimit?.toString()} onValueChange={(value) => game.matchLimit$.next(parseInt(value))}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue className={'tracking-widest'} placeholder='Match Limit' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='tracking-widest text-sm text-muted-foreground'>Match Limit</SelectLabel>
                {Game.SUPPORTED_CARDS_MATCH_LIMIT.map((limit) => (
                  <SelectItem key={limit} className={'tracking-wider'} value={limit.toString()}>
                    {limit} cards
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={groupLimit?.toString()} onValueChange={(value) => game.groupLimit$.next(parseInt(value))}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue className={'tracking-widest'} placeholder='Group Limit' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='tracking-widest text-sm text-muted-foreground'>Group Limit</SelectLabel>
                {Game.SUPPORTED_GROUPS_MATCH_LIMIT.map((limit) => (
                  <SelectItem key={limit} className={'tracking-wider'} value={limit.toString()}>
                    {limit} groups
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};
