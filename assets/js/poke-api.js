

const pokeApi = {}

pokeApi.getPokemonDetail = (pokemon) =>{
    return fetch(pokemon.url).then((response) => response.json())
}


//a informação de valores dentro dos ( ) serve como default
pokeApi.getPokemons = (offset = 0, limit = 10)=>{

    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results) //results é a lista de pokemons e faz parte do retorno da API
        .the((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}