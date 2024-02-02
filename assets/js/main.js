
const pokemonList = document.getElementById('pokemonList'); //é a <ol>

const loadMoreButton = document.getElementById('loadMoreButton');


const limit = 10;
let offset = 0;



const maxRecord = 151


function loadPokemonItens(offset, limit){          
    //pokeApi.getPokemons é uma função que foi definir em poke-api.js    
    pokeApi.getPokemons(offset, limit).then((pokemons = [])=> { //pokemons é uma lista definirda pelo offset e pelo limit
        const newHtml = pokemons.map((pokemon)=> 
               `<li class="pokemon ${pokemon.type}" id=${pokemon.number} onclick="showDetailsOnclick(${pokemon.number})">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" 
                            alt="${pokemon.name}">
                    </div>                
                </li>
                `

        ).join('')
        pokemonList.innerHTML += newHtml
        })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', ()=>{
    offset += limit

    const qtdRecordNextPage = offset + limit

    if(qtdRecordNextPage >= maxRecord){
        const newLimit =  maxRecord - offset
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else{
        loadPokemonItens(offset, limit);
    }
    
})

function hideModal(){
    const modal = document.getElementById('modal');
    modal.style.visibility = "hidden";
}

function showDetailsOnclick(idElemento){

    const modal =  document.getElementById("modal");
    modal.style.visibility = "visible" 

    const mainContent = document.getElementById('modalContent');
    mainContent.innerHTML = '';

    
    //const number = document.querySelector(`${pokemon.number}`).textContent; //vai obter o número do elemento htm
    //pokeApi.getPokemons é uma função que foi definir em poke-api.js    
    pokeApi.getPokemons(offset, limit).then((pokemons = [])=> { //pokemons é uma lista definirda pelo offset e pelo limit
        pokemons.forEach((pokemon) => {
            if(pokemon.number == idElemento) { //pokemon.number == pokeDetail.id
                const newHtml = `<li class="pokemon ${pokemon.type}">
                                <span class="number">#${pokemon.number}</span>
                                    <span class="name">${pokemon.name}</span>
                                    <div class="detail">
                                        <ol class="types">
                                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                        </ol>
                                    <img src="${pokemon.photo}" 
                                        alt="${pokemon.name}">
                                    </div>                
                            </li>`
                mainContent.innerHTML += newHtml
            }        
        })
    })
    
}

