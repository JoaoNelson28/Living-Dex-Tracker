const https = require('https');
const fs = require('fs');

const typeMap = {
    'normal': 'Normal', 'fire': 'Fogo', 'water': 'Água', 'grass': 'Grama',
    'electric': 'Elétrico', 'ice': 'Gelo', 'fighting': 'Lutador', 'poison': 'Venenoso',
    'ground': 'Terrestre', 'flying': 'Voador', 'psychic': 'Psíquico', 'bug': 'Inseto',
    'rock': 'Pedra', 'ghost': 'Fantasma', 'dragon': 'Dragão', 'steel': 'Aço',
    'fairy': 'Fada', 'dark': 'Sombrio'
};

// Detailed Location Map for FireRed/LeafGreen
// Based on standard encounter tables.
const locationMap = {
    // Starters
    'bulbasaur': 'Pallet Town (Inicial)',
    'ivysaur': 'Evolução',
    'venusaur': 'Evolução',
    'charmander': 'Pallet Town (Inicial)',
    'charmeleon': 'Evolução',
    'charizard': 'Evolução',
    'squirtle': 'Pallet Town (Inicial)',
    'wartortle': 'Evolução',
    'blastoise': 'Evolução',

    // Early Game
    'caterpie': 'Viridian Forest, Route 2, Route 24, Route 25',
    'metapod': 'Viridian Forest, Route 24, Route 25 (ou Evolução)',
    'butterfree': 'Evolução',
    'weedle': 'Viridian Forest, Route 2, Route 24, Route 25',
    'kakuna': 'Viridian Forest, Route 24, Route 25 (ou Evolução)',
    'beedrill': 'Evolução',
    'pidgey': 'Route 1, 2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 24, 25',
    'pidgeotto': 'Route 13, 14, 15, Bond Bridge, Five Isle Meadow (ou Evolução)',
    'pidgeot': 'Evolução',
    'rattata': 'Route 1, 2, 4, 9, 16, 17, 18, 22, Pokémon Mansion',
    'raticate': 'Route 16, 17, 18, Pokémon Mansion (ou Evolução)',
    'spearow': 'Route 3, 4, 9, 10, 11, 16, 17, 18, 22, 23',
    'fearow': 'Route 17, 18, 23, Bond Bridge, Canyon Entrance (ou Evolução)',
    'ekans': 'Route 4, 8, 9, 10, 11, 23 (FireRed Exclusivo)',
    'arbok': 'Route 23, Victory Road (FireRed Exclusivo)',
    'pikachu': 'Viridian Forest, Power Plant',
    'raichu': 'Evolução (Thunder Stone)',
    'sandshrew': 'Route 4, 8, 9, 10, 11, 23 (LeafGreen Exclusivo)',
    'sandslash': 'Route 23, Victory Road (LeafGreen Exclusivo)',
    'nidoran-f': 'Route 3, Safari Zone',
    'nidorina': 'Safari Zone (ou Evolução)',
    'nidoqueen': 'Evolução (Moon Stone)',
    'nidoran-m': 'Route 3, Safari Zone',
    'nidorino': 'Safari Zone (ou Evolução)',
    'nidoking': 'Evolução (Moon Stone)',
    'clefairy': 'Mt. Moon, Rocket Game Corner',
    'clefable': 'Evolução (Moon Stone)',
    'vulpix': 'Route 7, 8, Pokémon Mansion (LeafGreen Exclusivo)',
    'ninetales': 'Evolução (Fire Stone)',
    'jigglypuff': 'Route 3',
    'wigglytuff': 'Evolução (Moon Stone)',
    'zubat': 'Mt. Moon, Rock Tunnel, Seafoam Islands, Victory Road',
    'golbat': 'Seafoam Islands, Victory Road (ou Evolução)',
    'oddish': 'Route 5, 6, 7, 12, 13, 14, 15, 24, 25 (FireRed Exclusivo)',
    'gloom': 'Route 12, 13, 14, 15 (FireRed Exclusivo)',
    'vileplume': 'Evolução (Leaf Stone)',
    'paras': 'Mt. Moon, Safari Zone',
    'parasect': 'Safari Zone, Cerulean Cave (ou Evolução)',
    'venonat': 'Route 12, 13, 14, 15, Safari Zone',
    'venomoth': 'Safari Zone, Berry Forest (ou Evolução)',
    'diglett': 'Diglett\'s Cave',
    'dugtrio': 'Diglett\'s Cave (ou Evolução)',
    'meowth': 'Route 5, 6, 7, 8, Bond Bridge',
    'persian': 'Bond Bridge, Five Isle Meadow (ou Evolução)',
    'psyduck': 'Surf/Fish: Safari Zone, Cerulean City, Route 6, 22 (FireRed Exclusivo)',
    'golduck': 'Surf: Cape Brink, Berry Forest (FireRed Exclusivo)',
    'mankey': 'Route 3, 4, 22, 23, Rock Tunnel',
    'primeape': 'Route 23, Victory Road (ou Evolução)',
    'growlithe': 'Route 7, 8, Pokémon Mansion (FireRed Exclusivo)',
    'arcanine': 'Evolução (Fire Stone)',
    'poliwag': 'Fish: Pallet Town, Viridian City, Route 22, etc.',
    'poliwhirl': 'Fish: Route 6, 22, 23, etc. (ou Evolução)',
    'poliwrath': 'Evolução (Water Stone)',
    'abra': 'Route 24, 25, Rocket Game Corner',
    'kadabra': 'Cerulean Cave (ou Evolução)',
    'alakazam': 'Evolução (Troca)',
    'machop': 'Rock Tunnel, Victory Road, Mt. Ember',
    'machoke': 'Victory Road, Mt. Ember (ou Evolução)',
    'machamp': 'Evolução (Troca)',
    'bellsprout': 'Route 5, 6, 7, 12, 13, 14, 15, 24, 25 (LeafGreen Exclusivo)',
    'weepinbell': 'Route 12, 13, 14, 15 (LeafGreen Exclusivo)',
    'victreebel': 'Evolução (Leaf Stone)',
    'tentacool': 'Surf: Most sea routes (Route 19, 20, 21, etc.)',
    'tentacruel': 'Surf: Most sea routes (ou Evolução)',
    'geodude': 'Mt. Moon, Rock Tunnel, Victory Road',
    'graveler': 'Rock Tunnel, Victory Road, Cerulean Cave (ou Evolução)',
    'golem': 'Evolução (Troca)',
    'ponyta': 'Pokémon Mansion, Kindle Road, Mt. Ember',
    'rapidash': 'Kindle Road, Mt. Ember (ou Evolução)',
    'slowpoke': 'Surf/Fish: Safari Zone, Cerulean City, Route 6, 22 (LeafGreen Exclusivo)',
    'slowbro': 'Surf: Cape Brink, Berry Forest (LeafGreen Exclusivo)',
    'magnemite': 'Power Plant',
    'magneton': 'Power Plant, Cerulean Cave (ou Evolução)',
    'farfetchd': 'Troca em Vermilion City (Spearow)',
    'doduo': 'Route 16, 17, 18, Safari Zone',
    'dodrio': 'Route 17 (ou Evolução)',
    'seel': 'Seafoam Islands, Icefall Cave',
    'dewgong': 'Seafoam Islands, Icefall Cave (ou Evolução)',
    'grimer': 'Pokémon Mansion, Celadon City (Surf)',
    'muk': 'Pokémon Mansion (ou Evolução)',
    'shellder': 'Fish: Pallet Town, Vermilion City, Route 6, 19, 20, 21 (FireRed Exclusivo)',
    'cloyster': 'Evolução (Water Stone)',
    'gastly': 'Pokémon Tower',
    'haunter': 'Pokémon Tower (ou Evolução)',
    'gengar': 'Evolução (Troca)',
    'onix': 'Rock Tunnel, Victory Road',
    'drowzee': 'Route 11, Berry Forest',
    'hypno': 'Berry Forest (ou Evolução)',
    'krabby': 'Fish: Route 4, 10, 11, 12, 13, 19, 20, 21, 24',
    'kingler': 'Fish: Route 19, 20, 21, 23 (ou Evolução)',
    'voltorb': 'Route 10, Power Plant',
    'electrode': 'Power Plant, Cerulean Cave (ou Evolução)',
    'exeggcute': 'Safari Zone',
    'exeggutor': 'Evolução (Leaf Stone)',
    'cubone': 'Pokémon Tower',
    'marowak': 'Victory Road (ou Evolução)',
    'hitmonlee': 'Fighting Dojo (Saffron City - Escolha 1)',
    'hitmonchan': 'Fighting Dojo (Saffron City - Escolha 1)',
    'lickitung': 'Troca na Route 18 (Golduck/Slowbro)',
    'koffing': 'Pokémon Mansion, Celadon City (Surf)',
    'weezing': 'Pokémon Mansion (ou Evolução)',
    'rhyhorn': 'Safari Zone',
    'rhydon': 'Evolução',
    'chansey': 'Safari Zone',
    'tangela': 'Route 21 (Grass)',
    'kangaskhan': 'Safari Zone',
    'horsea': 'Fish: Route 4, 10, 11, 12, 13, 19, 20, 21, 24',
    'seadra': 'Fish: Route 19, 20, 21, 23 (ou Evolução)',
    'goldeen': 'Fish: Most freshwater ponds',
    'seaking': 'Fish: Safari Zone, Fuchsia City (ou Evolução)',
    'staryu': 'Fish: Pallet Town, Vermilion City, Route 6, 19, 20, 21 (LeafGreen Exclusivo)',
    'starmie': 'Evolução (Water Stone)',
    'mr-mime': 'Troca na Route 2 (Abra)',
    'scyther': 'Safari Zone, Rocket Game Corner (FireRed Exclusivo)',
    'jynx': 'Troca em Cerulean City (Poliwhirl)',
    'electabuzz': 'Power Plant (FireRed Exclusivo)',
    'magmar': 'Mt. Ember (LeafGreen Exclusivo)',
    'pinsir': 'Safari Zone, Rocket Game Corner (LeafGreen Exclusivo)',
    'tauros': 'Safari Zone',
    'magikarp': 'Fish: Everywhere (Old Rod)',
    'gyarados': 'Fish: Fuchsia City, Safari Zone (ou Evolução)',
    'lapras': 'Silph Co. (Gift)',
    'ditto': 'Route 13, 14, 15, Pokémon Mansion, Cerulean Cave',
    'eevee': 'Celadon Mansion (Gift)',
    'vaporeon': 'Evolução (Water Stone)',
    'jolteon': 'Evolução (Thunder Stone)',
    'flareon': 'Evolução (Fire Stone)',
    'porygon': 'Rocket Game Corner',
    'omanyte': 'Reviver Fossil (Mt. Moon -> Cinnabar Lab)',
    'omastar': 'Evolução',
    'kabuto': 'Reviver Fossil (Mt. Moon -> Cinnabar Lab)',
    'kabutops': 'Evolução',
    'aerodactyl': 'Reviver Old Amber (Pewter Museum -> Cinnabar Lab)',
    'snorlax': 'Route 12, Route 16 (Fixo - Poké Flute)',
    'articuno': 'Seafoam Islands (Lendário Fixo)',
    'zapdos': 'Power Plant (Lendário Fixo)',
    'moltres': 'Mt. Ember (Lendário Fixo)',
    'dratini': 'Safari Zone, Rocket Game Corner',
    'dragonair': 'Safari Zone (ou Evolução)',
    'dragonite': 'Evolução',
    'mewtwo': 'Cerulean Cave (Lendário Fixo)',
    'mew': 'Evento / Glitch'
};

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        });
    });
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

async function main() {
    try {
        const list = await fetchUrl('https://pokeapi.co/api/v2/pokemon?limit=151');
        const results = [];
        const batchSize = 10;

        for (let i = 0; i < list.results.length; i += batchSize) {
            const batch = list.results.slice(i, i + batchSize);
            const promises = batch.map(async (p) => {
                const details = await fetchUrl(p.url);
                const types = details.types.map(t => typeMap[t.type.name] || capitalize(t.type.name));
                
                // Get location from map or default
                let location = locationMap[p.name] || "Kanto Region (Verificar Pokédex)";
                let notes = "Verifique o mapa para detalhes.";

                if (location.includes("FireRed Exclusivo")) {
                    notes = "Apenas na versão FireRed.";
                } else if (location.includes("LeafGreen Exclusivo")) {
                    notes = "Apenas na versão LeafGreen.";
                } else if (location.includes("Evolução")) {
                    notes = "Obtido através de evolução.";
                } else if (location.includes("Inicial")) {
                    notes = "Escolhido no início do jogo.";
                }

                return {
                    id: details.id,
                    lumioseId: details.id,
                    name: capitalize(p.name),
                    type: types,
                    image: details.sprites.other['official-artwork'].front_default,
                    captureInfo: {
                        location: location,
                        method: location.includes("Fish") ? "Pesca" : (location.includes("Surf") ? "Surf" : "Captura Padrão"),
                        time: "Qualquer",
                        weather: "Qualquer",
                        notes: notes
                    }
                };
            });
            const batchResults = await Promise.all(promises);
            results.push(...batchResults);
            // console.log(`Processed ${i + batchResults.length}/151`);
        }

        results.sort((a, b) => a.id - b.id);
        
        fs.writeFileSync('kanto_data.json', JSON.stringify(results, null, 2));
        console.log("Data written to kanto_data.json");

    } catch (e) {
        console.error(e);
    }
}

main();
