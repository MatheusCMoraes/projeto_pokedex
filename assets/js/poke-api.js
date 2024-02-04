

const pokeApi = {} //objeto

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    const types =  pokeDetail.types.map( (typeSlot) => typeSlot.type.name)
    const [ type ] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.weight = pokeDetail.weight
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    const stats = pokeDetail.stats.map( (statInfo) => {statInfo.stat.name, statInfo.base_stat})
    const [ stat ] = stats

    pokemon.stats = stats
    pokemon.stat = stat

    pokemon.hp = pokeDetail.stats[0].base_stat
    pokemon.attack = pokeDetail.stats[1].base_stat
    pokemon.defense = pokeDetail.stats[2].base_stat
    pokemon.special_attack = pokeDetail.stats[3].base_stat
    pokemon.special_defense = pokeDetail.stats[4].base_stat
    pokemon.speed = pokeDetail.stats[5].base_stat

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) =>{
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
} 


//a informação de valores dentro dos ( ) serve como default
pokeApi.getPokemons = (offset = 0, limit = 5) => {
//função construida diretamente no objeto pokeApi
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}` //retorna um objeto com o nome e url dos pokemons
    return fetch(url) /*fetch() O método global fetch() inicia o processo de busca de um recurso da rede, 
    retornando uma promessa que é cumprida assim que a resposta estiver disponível. 
    A promessa é resolvida para o objeto Response que representa a resposta à sua solicitação*/
        .then((response) => response.json()) //converte o objeto response em json
        .then((jsonBody) => jsonBody.results) //está sendo usado para acessar a propriedade "results" do objeto JSON, 
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //a função vai chamar cada item da lista e transformá-lo em um json,
        //convertPokeApiDetailToPokemon pega cada item desse novo json e atribuí a um campo de uma objeto
        .then((detailRequests) => Promise.all(detailRequests)) //aguarda o map ser concluído
        .then((pokemonsDetails) => pokemonsDetails) //pokemonDetails é uma lista com os objetos dos pokemons
   
}