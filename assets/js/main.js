
const pokemonList = document.getElementById('pokemonList'); //é a <ol>

const loadMoreButton = document.getElementById('loadMoreButton');

let loadMoreOffset = 0;
let maxRecord = 151;

const inputNumeroResultados = document.getElementById('resultsInput');
const botaoEnviar = document.getElementById('botaoEnviar');

function verificarInput() {
    if (inputNumeroResultados.value.trim() !== '') {
        botaoEnviar.disabled = false; // habilita o botão se o input tiver um valor
    } else {
        botaoEnviar.disabled = true; // desabilita o botão se o input estiver vazio
    }
}

inputNumeroResultados.addEventListener('input', verificarInput);



//gen 1 -- 1 a 151   | gen2 -- 152 a 251  |  gen3 -- 252 a 386
function getPokemonGenRange(){

    const selectGen = document.getElementById('genSelect');
    const selectedGenValue = selectGen.value;

    const limitSelected = document.getElementById('resultsInput');
    const limit = parseInt(limitSelected.value);

    if(selectedGenValue === 'gen1'){
        let offset = 0
        maxRecord = 151
        loadPokemonItens(offset, limit);

    } else if(selectedGenValue ==='gen2'){
        let offset = 151
        maxRecord = 251
        loadPokemonItens(offset, limit);

     } else if(selectedGenValue ==='gen3'){
        let offset = 251
        maxRecord = 386
        loadPokemonItens(offset, limit);

     }else{
        alert("Escolha uma geração de pokemons")
    } 
    showLoadMoreButton();
}


function loadPokemonItens(offset, limit){    
    pokemonList.innerHTML = '';      
    //pokeApi.getPokemons é uma função que foi definir em poke-api.js    
    pokeApi.getPokemons(offset, limit).then((pokemons = [])=> { //pokemons é uma lista definirda pelo offset e pelo limit
        const newHtml = pokemons.map((pokemon)=> 
               `<li class="pokemon ${pokemon.type}" id=${pokemon.number} onclick="showDetailsOnclick(${pokemon.number}, ${offset}, ${limit})">
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

genSelect.addEventListener('click', ()=>{
    const selectGen = document.getElementById('genSelect');
    const selectedGenValue = selectGen.value;
    
    if(selectedGenValue === 'gen1'){
        loadMoreOffset = 0;

    } else if(selectedGenValue ==='gen2'){
        loadMoreOffset = 151;

    } else if(selectedGenValue ==='gen3'){
        loadMoreOffset = 251;
    }
})


loadMoreButton.addEventListener('click', ()=>{
   
    const searchLimit = document.getElementById('resultsInput');
    const limit = parseInt(searchLimit.value);
    loadMoreOffset += limit


    const qtdRecordNextPage = loadMoreOffset + limit

    if(qtdRecordNextPage >= maxRecord){
        const newLimit =  maxRecord - loadMoreOffset
        loadPokemonItens(loadMoreOffset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else{
        loadPokemonItens(loadMoreOffset, limit);
    }
    
})

function showLoadMoreButton(){
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.style.visibility = "visible";
}

function hideModal(){
    const modal = document.getElementById('modal');
    modal.style.visibility = "hidden";
}

function showDetailsOnclick(idElemento, offset, limit){ //criada em loadPokemonsItens

    const modal =  document.getElementById("modal");
    modal.style.visibility = "visible" 

    const mainContent = document.getElementById('modalContent');
    mainContent.innerHTML = '';

   //para essa chamada, offset = 0 e limit = maxRecord permite que seja mostrado o modal de todos que estão na tela
    pokeApi.getPokemons(offset, limit).then((pokemons = [])=> { //pokemons é uma lista definirda pelo offset e pelo limit
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
                                       <span> ${convertWeight(pokemon.weight)} Kg </span>
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
                statsBar(pokemonStats);
            }        
        })
    })
    
}


function statsBar(pokemonStats){

    const labels = [
        "hp",
        "attack",
        "defense",
        "specialAttack",
        "specialDefense",
        "speed",
    ]

    labels.forEach((label, index) => {
        const valor = pokemonStats[index];
        const bar = document.getElementById(label + "Bar");
        const barFill = document.createElement("div");

        barFill.classList.add("barFill" + label);
        barFill.style.width = valor + "%";
        bar.innerHTML = "";
        bar.appendChild(barFill);

    })
}

function convertWeight(weight){
    if(weight === "unknown"){
        return "desconhecido"
    }

    return (weight / 10).toFixed(2);
}

