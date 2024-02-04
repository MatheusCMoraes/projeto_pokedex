
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

   //para essa chamada, offset = 0 e limit = maxRecord permite que seja mostrado o modal de todos que estão na tela
    pokeApi.getPokemons(0, maxRecord).then((pokemons = [])=> { //pokemons é uma lista definirda pelo offset e pelo limit
        pokemons.forEach((pokemon) => {
            const pokemonStats = [`${pokemon.hp}` , `${pokemon.attack}` , `${pokemon.defense}`, `${pokemon.special_attack}` ,`${pokemon.special_defense}`, `${pokemon.speed}`]  
            if(pokemon.number == idElemento) { //pokemon.number == pokeDetail.id
                const newHtml = `
                            <div class="pokemonModal ${pokemon.type}">
                                <span class="name">${pokemon.name}</span>
                                <span class="number">#${pokemon.number}</span>
                                    
                                    <div class="detail">
                                        <ol class="types">
                                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                        </ol>
                                    </div> 
                                        
                                    <img src="${pokemon.photo}" 
                                    alt="${pokemon.name}">         
                            </div>
                            <div class="stats">
                                <div class="stat">
                                    <div class="label">Weight</div>
                                       <span> ${pokemon.weight} Kg </span>
                                </div>

                                <div class="stat">
                                    <div class="label">HP</div>
                                    <div class="statBar" id="hpBar"></div>
                                </div>

                                <div class="stat">
                                    <div class="label">Attack</div>
                                    <div class="statBar" id="attackBar"></div>
                                </div>

                                <div class="stat">
                                    <div class="label">Defense</div>
                                    <div class="statBar" id="defenseBar"></div>
                                </div>

                                <div class="stat">
                                    <div class="label">Sp. Attack</div>
                                    <div class="statBar" id="specialAttackBar"></div>
                                </div>

                                <div class="stat">
                                    <div class="label">Sp. Defense</div>
                                    <div class="statBar" id="specialDefenseBar"></div>
                                </div>
                                
                                <div class="stat">
                                    <div class="label">Speed</div>
                                    <div class="statBar" id="speedBar"></div>
                                </div> 
                            </div>     
                            
                            `
                mainContent.innerHTML += newHtml
            }        
        })
    })
    
}


function statsBar(pokemonStats){

    const labels = [
        "hp",
        "attack",
        "defense",
        "special_attack",
        "special_defense",
        "speed",
    ]

    labels.forEach((label, index) => {
        const valor = pokemonStats[index];
        const bar = document.getElementById(label + "Bar");
        const barFill = document.createElement("div");

        barFill.classList.add("barFill");
        barFill.style.width = valor + "%";
        bar.innerHTML = "";
        bar.appendChild(barFill);

    })
}

