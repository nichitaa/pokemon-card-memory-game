import { ajax } from 'rxjs/internal/ajax/ajax';
import { firstValueFrom, retry } from 'rxjs';

export type ServiceResponse<TData, TError> =
  | {
      success: false;
      error: TError;
    }
  | {
      success: true;
      data: TData;
    };

export interface GetPokesResponse {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
}

export interface GetPokeResponse {
  id: string;
  name: string;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
}

export interface Poke extends Pick<GetPokeResponse, 'id' | 'name'> {
  svg: string;
}

export class PokeApi {
  private static instance: PokeApi;
  static BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  private constructor() {}

  public static getInstance(): PokeApi {
    if (!PokeApi.instance) PokeApi.instance = new PokeApi();
    return PokeApi.instance;
  }

  async getPokes(limit: number, offset: number): Promise<ServiceResponse<GetPokesResponse, unknown>> {
    const url = `${PokeApi.BASE_URL}/?limit=${limit}&offset=${offset}`;
    const ajaxResponse$ = ajax<GetPokesResponse>(url).pipe(retry(3));
    const response = await firstValueFrom(ajaxResponse$);
    if (response.status === 200) return { success: true, data: response.response };
    return { success: false, error: response.response };
  }

  async getPoke(url: string): Promise<Poke> {
    const ajaxResponse$ = ajax<GetPokeResponse>(url).pipe(retry(3));
    const response = await firstValueFrom(ajaxResponse$);
    if (response.status === 200) return PokeApi.toPoke(response.response);
    throw new Error(`Failed to get poke ${url}`);
  }

  static toPoke = ({ name, id, sprites }: GetPokeResponse): Poke => {
    return { id, name, svg: sprites.other.dream_world.front_default };
  };
}

export const pokeApi = PokeApi.getInstance();
