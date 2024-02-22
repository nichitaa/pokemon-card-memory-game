import { BehaviorSubject, combineLatest, forkJoin, from, map, of, Subject, switchMap, take } from 'rxjs';
import { Poke, pokeApi } from '@/services/poke-api.ts';
import { exhaustMapWithTrailing } from '@/lib/rxjs-operators/exhaust-map-with-trailing.ts';

type GameState = keyof typeof Game.STATUS;

export interface PokeCard extends Poke {
  cardId: string;
  open?: boolean;
  matched?: boolean;
}

export class Game {
  private static instance: Game;

  static STATUS = {
    loading: 'loading',
    started: 'started',
    win: 'win',
  } as const;
  /** player must consecutively select X same cards to construct a match */
  static SUPPORTED_CARDS_MATCH_LIMIT = [2, 3, 4, 5, 6, 7];
  /** increase deck size with more card "variants" */
  static SUPPORTED_GROUPS_MATCH_LIMIT = [3, 4, 5, 6, 7, 8, 9, 10];
  static FLIP_TIMEOUT = 1000;

  #status$ = new BehaviorSubject<GameState>(Game.STATUS.loading);
  #cards$ = new BehaviorSubject<PokeCard[]>([]);
  #startGameNotifier$ = new Subject<void>();
  #flippedCardIds: string[] = [];
  #apiOffset = 0;

  // public state
  cards$ = this.#cards$.asObservable();
  status$ = this.#status$.asObservable();
  matchLimit$ = new BehaviorSubject<number>(Game.SUPPORTED_CARDS_MATCH_LIMIT[0]);
  groupLimit$ = new BehaviorSubject<number>(Game.SUPPORTED_GROUPS_MATCH_LIMIT[2]);

  #gameSubscription = combineLatest([this.matchLimit$, this.groupLimit$, this.#startGameNotifier$])
    .pipe(
      exhaustMapWithTrailing(([matchLimit, groupLimit]) => {
        this.#status$.next(Game.STATUS.loading);
        this.#flippedCardIds = [];
        return from(pokeApi.getPokes(groupLimit, this.#apiOffset)).pipe(
          switchMap((response) => {
            if (response.success) {
              this.#apiOffset += groupLimit;
              const promises = response.data.results.map(({ url }) => pokeApi.getPoke(url));
              return forkJoin(promises);
            }
            return of([]);
          }),
          map((pokes) => {
            const extended = Game.shuffle(Game.extendArray(pokes, matchLimit));
            const cards: PokeCard[] = extended.map((poke, index) => ({
              ...poke,
              cardId: `${poke.id}_${index}`,
            }));
            return cards;
          }),
          take(1)
        );
      })
    )
    .subscribe((cards) => {
      this.#cards$.next(cards);
      this.#status$.next(Game.STATUS.started);
    });

  start = () => {
    this.#startGameNotifier$.next();
  };

  flip = (cardId: string): void => {
    if (this.#flippedCardIds.includes(cardId)) return;
    const cards = this.#cards$.value;

    if (this.#flippedCardIds.length === this.matchLimit$.value) {
      this.#resetFlippedCards();
      return;
    }

    const card = cards.find((card) => card.cardId === cardId);
    if (!card) throw new Error(`card with id ${cardId} was not found`);

    if (card.open || card.matched) return;

    let isMatch = false;

    this.#flippedCardIds.push(cardId);
    if (this.#flippedCardIds.length === this.matchLimit$.value) {
      const pokemonIds = this.#flippedCardIds
        .map((cardId) => cards.find((card) => card.cardId === cardId)?.id)
        .filter(Boolean);

      isMatch = new Set(pokemonIds).size === 1;

      if (!isMatch) {
        setTimeout(this.#resetFlippedCards, Game.FLIP_TIMEOUT);
      }
    }

    this.#cards$.next(
      cards.map((card) => {
        if (this.#flippedCardIds.includes(card.cardId)) {
          card.open = true;
          card.matched = isMatch;
        }
        return card;
      })
    );

    if (isMatch) {
      this.#flippedCardIds = [];
    }

    const win = this.#cards$.value.every((card) => card.open && card.matched);
    if (win) {
      this.#status$.next(Game.STATUS.win);
    }
  };

  /** privates */

  #resetFlippedCards = () => {
    this.#cards$.next(
      this.#cards$.value.map((card) => {
        if (this.#flippedCardIds.includes(card.cardId)) card.open = false;
        return card;
      })
    );
    this.#flippedCardIds = [];
  };

  private constructor() {}

  /** static utilities */
  static getInstance(): Game {
    if (!Game.instance) Game.instance = new Game();
    return Game.instance;
  }

  static shuffle = <T>(originalArray: T[]) => {
    const array = ([] as T[]).concat(originalArray);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  static extendArray = <T>(array: T[], repeatNo: number): T[] => {
    return Array.from({ length: repeatNo })
      .fill(array)
      .map((array) => structuredClone(array))
      .flat() as T[];
  };
}

export const game = Game.getInstance();
