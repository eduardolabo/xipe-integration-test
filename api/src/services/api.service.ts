import axios from 'axios';

import { PokemonApiResponse } from '../interfaces/api';

export default class ApiService {
    public baseApi: string;

    constructor() {
        this.baseApi = process.env.BASE_API || "https://pokeapi.co/api/v2";
    }

    async getPokemon(id: string): Promise<PokemonApiResponse> {
        const response = await axios.get(`${this.baseApi}/pokemon/${id}`);

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data as PokemonApiResponse;
    }
}
