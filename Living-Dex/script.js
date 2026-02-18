// MERGED SCRIPT.JS - Combined all modules to avoid loading issues

// SUPABASE CONFIGURATION
const SUPABASE_URL = 'https://idlewpgkdcxjlcndvgqv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rE30kYBuTqmQ8Y25n3gJqQ_rEb3Ze9B';

let supabaseClient;

// Auth listener setup moved to bottom with other init logic


// Auth Functions
async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    } catch (e) {
        console.error("SignIn Error:", e);
        return { data: null, error: { message: "Erro de conexão com o servidor. Verifique sua internet ou as configurações do projeto." } };
    }
}

async function signUp(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });
        return { data, error };
    } catch (e) {
        console.error("SignUp Error:", e);
        return { data: null, error: { message: "Erro de conexão com o servidor." } };
    }
}

async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        return { error };
    } catch (e) {
        return { error: e };
    }
}

async function resetPassword(email) {
    try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href,
        });
        return { data, error };
    } catch (e) {
        return { data: null, error: { message: "Erro de conexão." } };
    }
}

// Data Sync Functions
async function loadUserDataFromSupabase(gameId) {
    if (!currentState.user) return null;

    const { data, error } = await supabaseClient
        .from('user_progress')
        .select('*')
        .eq('user_id', currentState.user.id)
        .eq('game_id', gameId)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // Not found
            console.error('Error loading Supabase data:', error);
        }
        return null;
    }
    return data;
}

async function saveUserDataToSupabase(gameId, capturedData, teamData) {
    if (!currentState.user) return;

    const { data, error } = await supabaseClient
        .from('user_progress')
        .upsert({ 
            user_id: currentState.user.id,
            game_id: gameId,
            captured_data: capturedData,
            team_data: teamData,
            updated_at: new Date()
        }, { onConflict: 'user_id,game_id' });

    if (error) console.error('Error saving to Supabase:', error);
    else showToast("Progresso salvo na nuvem.", "success");
}

// Toast Helper
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// DATA
// Note: We are using var/let to avoid "identifier already declared" if this script runs multiple times or conflicts, 
// but since we are merging, we should stick to const where appropriate, but be careful of duplicates.
// The previous error was because we had TWO blocks defining SUPABASE_URL in the same file due to the merge strategy.

const games = [
    {
        "id": "legends-za",
        "name": "Pokémon Legends: Z-A",
        "region": "Lumiose City (Kalos)",
        "pokemonList": [
            {
                "id": 152,
                "lumioseId": 1,
                "name": "Chikorita",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 153,
                "lumioseId": 2,
                "name": "Bayleef",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png",
                "captureInfo": {
                    "location": "Evoluir Chikorita (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 154,
                "lumioseId": 3,
                "name": "Meganium",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png",
                "captureInfo": {
                    "location": "Evoluir Bayleef (Nvl 32)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 498,
                "lumioseId": 4,
                "name": "Tepig",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 499,
                "lumioseId": 5,
                "name": "Pignite",
                "type": [
                    "Fogo",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/499.png",
                "captureInfo": {
                    "location": "Evoluir Tepig (Nvl 17)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 500,
                "lumioseId": 6,
                "name": "Emboar",
                "type": [
                    "Fogo",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png",
                "captureInfo": {
                    "location": "Evoluir Pignite (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 158,
                "lumioseId": 7,
                "name": "Totodile",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 159,
                "lumioseId": 8,
                "name": "Croconaw",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png",
                "captureInfo": {
                    "location": "Evoluir Totodile (Nvl 18)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 160,
                "lumioseId": 9,
                "name": "Feraligatr",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png",
                "captureInfo": {
                    "location": "Evoluir Croconaw (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 661,
                "lumioseId": 10,
                "name": "Fletchling",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/661.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, Telhados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 662,
                "lumioseId": 11,
                "name": "Fletchinder",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/662.png",
                "captureInfo": {
                    "location": "Zona Selvagem 9, Telhados, Evoluir Fletchling (Nvl 17)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 663,
                "lumioseId": 12,
                "name": "Talonflame",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/663.png",
                "captureInfo": {
                    "location": "Telhados, Evoluir Fletchinder (Nvl 35)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 659,
                "lumioseId": 13,
                "name": "Bunnelby",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/659.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, 5",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 660,
                "lumioseId": 14,
                "name": "Diggersby",
                "type": [
                    "Normal",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Bunnelby (Nvl 20)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 664,
                "lumioseId": 15,
                "name": "Scatterbug",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/664.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, Telhados com grama",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 665,
                "lumioseId": 16,
                "name": "Spewpa",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/665.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4 (Dia), Telhados com grama, Evoluir Scatterbug (Nvl 9)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 666,
                "lumioseId": 17,
                "name": "Vivillon",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/666.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13 (Dia), Telhados, Evoluir Spewpa (Nvl 12)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 13,
                "lumioseId": 18,
                "name": "Weedle",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, Telhados com grama, Parques",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 14,
                "lumioseId": 19,
                "name": "Kakuna",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2, 7 (Árvores), Evoluir Weedle (Nvl 7)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 15,
                "lumioseId": 20,
                "name": "Beedrill",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15 (Dia), Evoluir Kakuna (Nvl 10)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 16,
                "lumioseId": 21,
                "name": "Pidgey",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, 5",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 17,
                "lumioseId": 22,
                "name": "Pidgeotto",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, Evoluir Pidgey (Nvl 18)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 18,
                "lumioseId": 23,
                "name": "Pidgeot",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png",
                "captureInfo": {
                    "location": "Telhados, Evoluir Pidgeotto (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 179,
                "lumioseId": 24,
                "name": "Mareep",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 180,
                "lumioseId": 25,
                "name": "Flaaffy",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png",
                "captureInfo": {
                    "location": "Zona Selvagem 6, 16, Evoluir Mareep (Nvl 15)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 181,
                "lumioseId": 26,
                "name": "Ampharos",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png",
                "captureInfo": {
                    "location": "Alpha: Zona Selvagem 16, Evoluir Flaaffy (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Cuidado: Pokémon Alpha!"
                }
            },
            {
                "id": 504,
                "lumioseId": 27,
                "name": "Patrat",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/504.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2, 4 (Noite), Esgotos (Sudoeste)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 505,
                "lumioseId": 28,
                "name": "Watchog",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/505.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10, Evoluir Patrat (Nvl 20)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 406,
                "lumioseId": 29,
                "name": "Budew",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/406.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 315,
                "lumioseId": 30,
                "name": "Roselia",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/315.png",
                "captureInfo": {
                    "location": "Zona Selvagem 7, Evoluir Budew (Amizade/Dia)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 407,
                "lumioseId": 31,
                "name": "Roserade",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/407.png",
                "captureInfo": {
                    "location": "Zona Selvagem 20, Evoluir Roselia (Pedra do Brilho)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 129,
                "lumioseId": 32,
                "name": "Magikarp",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2, 6",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 130,
                "lumioseId": 33,
                "name": "Gyarados",
                "type": [
                    "Água",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11, Evoluir Magikarp (Nvl 20)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 688,
                "lumioseId": 34,
                "name": "Binacle",
                "type": [
                    "Pedra",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/688.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2, 6",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 689,
                "lumioseId": 35,
                "name": "Barbaracle",
                "type": [
                    "Pedra",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/689.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16 (Noite), Evoluir Binacle (Nvl 39)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 120,
                "lumioseId": 36,
                "name": "Staryu",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10, Zona Selvagem 2 (Noite)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 121,
                "lumioseId": 37,
                "name": "Starmie",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16 (Noite), Evoluir Staryu (Pedra da Água)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 669,
                "lumioseId": 38,
                "name": "Flabébé",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/669.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3, Perto de canteiros de flores",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 670,
                "lumioseId": 39,
                "name": "Floette",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/670.png",
                "captureInfo": {
                    "location": "Zona Selvagem 7, Evoluir Flabébé (Nvl 19)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 671,
                "lumioseId": 40,
                "name": "Florges",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16 (Dia), Evoluir Floette (Pedra do Brilho)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 672,
                "lumioseId": 41,
                "name": "Skiddo",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/672.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 673,
                "lumioseId": 42,
                "name": "Gogoat",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/673.png",
                "captureInfo": {
                    "location": "Zona Selvagem 12, Evoluir Skiddo (Nvl 32)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 677,
                "lumioseId": 43,
                "name": "Espurr",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/677.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3, 9, Telhados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 678,
                "lumioseId": 44,
                "name": "Meowstic",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/678.png",
                "captureInfo": {
                    "location": "Evoluir Espurr (Nvl 25)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 667,
                "lumioseId": 45,
                "name": "Litleo",
                "type": [
                    "Fogo",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/667.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 668,
                "lumioseId": 46,
                "name": "Pyroar",
                "type": [
                    "Fogo",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/668.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Litleo (Nvl 35)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 674,
                "lumioseId": 47,
                "name": "Pancham",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/674.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 675,
                "lumioseId": 48,
                "name": "Pangoro",
                "type": [
                    "Lutador",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/675.png",
                "captureInfo": {
                    "location": "Evoluir Pancham (Nvl 32 + Sombrio na equipe)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 568,
                "lumioseId": 49,
                "name": "Trubbish",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/568.png",
                "captureInfo": {
                    "location": "Becos (perto de lixo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 569,
                "lumioseId": 50,
                "name": "Garbodor",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/569.png",
                "captureInfo": {
                    "location": "Zona Selvagem 20, Becos, Evoluir Trubbish (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 702,
                "lumioseId": 51,
                "name": "Dedenne",
                "type": [
                    "Elétrico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/702.png",
                "captureInfo": {
                    "location": "Telhados (perto de portas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 172,
                "lumioseId": 52,
                "name": "Pichu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1 (Acesso esquerdo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 25,
                "lumioseId": 53,
                "name": "Pikachu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3, Evoluir Pichu (Amizade)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 26,
                "lumioseId": 54,
                "name": "Raichu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
                "captureInfo": {
                    "location": "Evoluir Pikachu (Pedra do Trovão)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 173,
                "lumioseId": 55,
                "name": "Cleffa",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/173.png",
                "captureInfo": {
                    "location": "Zona Selvagem 19 (Noite), Telhados (Raro)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 35,
                "lumioseId": 56,
                "name": "Clefairy",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png",
                "captureInfo": {
                    "location": "Zona Selvagem 19 (Noite), Evoluir Cleffa (Amizade)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 36,
                "lumioseId": 57,
                "name": "Clefable",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png",
                "captureInfo": {
                    "location": "Alpha: Zona Selvagem 19, Evoluir Clefairy (Pedra da Lua)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Cuidado: Pokémon Alpha!"
                }
            },
            {
                "id": 167,
                "lumioseId": 58,
                "name": "Spinarak",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/167.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4 (Lado das criptas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 168,
                "lumioseId": 59,
                "name": "Ariados",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png",
                "captureInfo": {
                    "location": "Esgotos (Noroeste), Evoluir Spinarak (Nvl 22)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 23,
                "lumioseId": 60,
                "name": "Ekans",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4 (Dia), Laboratório Lysandre",
                    "method": "Captura Padrão",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 24,
                "lumioseId": 61,
                "name": "Arbok",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10, Alpha: Lab Lysandre, Evoluir Ekans (Nvl 22)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Cuidado: Pokémon Alpha!"
                }
            },
            {
                "id": 63,
                "lumioseId": 62,
                "name": "Abra",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, Telhados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 64,
                "lumioseId": 63,
                "name": "Kadabra",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png",
                "captureInfo": {
                    "location": "Zona Selvagem 9, Evoluir Abra (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 65,
                "lumioseId": 64,
                "name": "Alakazam",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
                "captureInfo": {
                    "location": "Trocar Kadabra",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 92,
                "lumioseId": 65,
                "name": "Gastly",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4, Esgotos, Pela cidade (Noite)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 93,
                "lumioseId": 66,
                "name": "Haunter",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15 (Noite), Esgotos, Evoluir Gastly (Nvl 25)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 94,
                "lumioseId": 67,
                "name": "Gengar",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
                "captureInfo": {
                    "location": "Trocar Haunter",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 543,
                "lumioseId": 68,
                "name": "Venipede",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/543.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 544,
                "lumioseId": 69,
                "name": "Whirlipede",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/544.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15 (Dia), Evoluir Venipede (Nvl 22)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 545,
                "lumioseId": 70,
                "name": "Scolipede",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/545.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15 (Dia), Evoluir Whirlipede (Nvl 30)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 679,
                "lumioseId": 71,
                "name": "Honedge",
                "type": [
                    "Aço",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/679.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4 (Noite), Laboratório Lysandre",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 680,
                "lumioseId": 72,
                "name": "Doublade",
                "type": [
                    "Aço",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/680.png",
                "captureInfo": {
                    "location": "Laboratório Lysandre, Evoluir Honedge (Nvl 35)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 681,
                "lumioseId": 73,
                "name": "Aegislash",
                "type": [
                    "Aço",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png",
                "captureInfo": {
                    "location": "Evoluir Doublade (Pedra do Crepúsculo)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 69,
                "lumioseId": 74,
                "name": "Bellsprout",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, 10, Telhados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 70,
                "lumioseId": 75,
                "name": "Weepinbell",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13 (Dia), Alpha: Zona Selvagem 13, Evoluir Bellsprout (Nvl 21)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Cuidado: Pokémon Alpha!"
                }
            },
            {
                "id": 71,
                "lumioseId": 76,
                "name": "Victreebel",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png",
                "captureInfo": {
                    "location": "Evoluir Weepinbell (Pedra da Folha)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 511,
                "lumioseId": 77,
                "name": "Pansage",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/511.png",
                "captureInfo": {
                    "location": "Árvores pela cidade",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 512,
                "lumioseId": 78,
                "name": "Simisage",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/512.png",
                "captureInfo": {
                    "location": "Evoluir Pansage (Pedra da Folha)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 513,
                "lumioseId": 79,
                "name": "Pansear",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/513.png",
                "captureInfo": {
                    "location": "Árvores pela cidade",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 514,
                "lumioseId": 80,
                "name": "Simisear",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/514.png",
                "captureInfo": {
                    "location": "Evoluir Pansear (Pedra do Fogo)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 515,
                "lumioseId": 81,
                "name": "Panpour",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/515.png",
                "captureInfo": {
                    "location": "Árvores pela cidade",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 516,
                "lumioseId": 82,
                "name": "Simipour",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/516.png",
                "captureInfo": {
                    "location": "Evoluir Panpour (Pedra da Água)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 307,
                "lumioseId": 83,
                "name": "Meditite",
                "type": [
                    "Lutador",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/307.png",
                "captureInfo": {
                    "location": "Zona Selvagem 6 (Dia)",
                    "method": "Captura Padrão",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 308,
                "lumioseId": 84,
                "name": "Medicham",
                "type": [
                    "Lutador",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16 (Dia), Evoluir Meditite (Nvl 37)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 309,
                "lumioseId": 85,
                "name": "Electrike",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/309.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5 (Dia), Laboratório Lysandre",
                    "method": "Captura Padrão",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 310,
                "lumioseId": 86,
                "name": "Manectric",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/310.png",
                "captureInfo": {
                    "location": "Laboratório Lysandre, Evoluir Electrike (Nvl 26)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 280,
                "lumioseId": 87,
                "name": "Ralts",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/280.png",
                "captureInfo": {
                    "location": "Pátios gramados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 281,
                "lumioseId": 88,
                "name": "Kirlia",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/281.png",
                "captureInfo": {
                    "location": "Evoluir Ralts (Nvl 20)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 282,
                "lumioseId": 89,
                "name": "Gardevoir",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png",
                "captureInfo": {
                    "location": "Zona Selvagem 20, Evoluir Kirlia (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 475,
                "lumioseId": 90,
                "name": "Gallade",
                "type": [
                    "Psíquico",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/475.png",
                "captureInfo": {
                    "location": "Evoluir Kirlia (Macho + Pedra do Amanhecer)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 228,
                "lumioseId": 91,
                "name": "Houndour",
                "type": [
                    "Sombrio",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png",
                "captureInfo": {
                    "location": "Zona Selvagem 6, Laboratório Lysandre",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 229,
                "lumioseId": 92,
                "name": "Houndoom",
                "type": [
                    "Sombrio",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png",
                "captureInfo": {
                    "location": "Laboratório Lysandre, Evoluir Houndour (Nvl 24)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 333,
                "lumioseId": 93,
                "name": "Swablu",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/333.png",
                "captureInfo": {
                    "location": "Zona Selvagem 6, 18 (Dia), Telhados",
                    "method": "Captura Padrão",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 334,
                "lumioseId": 94,
                "name": "Altaria",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/334.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Dia), Evoluir Swablu (Nvl 35)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 531,
                "lumioseId": 95,
                "name": "Audino",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/531.png",
                "captureInfo": {
                    "location": "Zona Selvagem 7, 19",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 682,
                "lumioseId": 96,
                "name": "Spritzee",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/682.png",
                "captureInfo": {
                    "location": "Barracas do Mercado (Topo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 683,
                "lumioseId": 97,
                "name": "Aromatisse",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/683.png",
                "captureInfo": {
                    "location": "Trocar Spritzee (Sachet)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 684,
                "lumioseId": 98,
                "name": "Swirlix",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/684.png",
                "captureInfo": {
                    "location": "Barracas do Mercado (Topo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 685,
                "lumioseId": 99,
                "name": "Slurpuff",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/685.png",
                "captureInfo": {
                    "location": "Trocar Swirlix (Chantilly)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 133,
                "lumioseId": 100,
                "name": "Eevee",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
                "captureInfo": {
                    "location": "Zona Selvagem 19, Telhados (Raro)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 134,
                "lumioseId": 101,
                "name": "Vaporeon",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Pedra da Água)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 135,
                "lumioseId": 102,
                "name": "Jolteon",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Pedra do Trovão)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 136,
                "lumioseId": 103,
                "name": "Flareon",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Pedra do Fogo)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 196,
                "lumioseId": 104,
                "name": "Espeon",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Amizade/Dia)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 197,
                "lumioseId": 105,
                "name": "Umbreon",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Amizade/Noite)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 470,
                "lumioseId": 106,
                "name": "Leafeon",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Pedra da Folha)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 471,
                "lumioseId": 107,
                "name": "Glaceon",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Pedra de Gelo)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 700,
                "lumioseId": 108,
                "name": "Sylveon",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png",
                "captureInfo": {
                    "location": "Evoluir Eevee (Amizade + Golpe Fada)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 427,
                "lumioseId": 109,
                "name": "Buneary",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/427.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, 5",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 428,
                "lumioseId": 110,
                "name": "Lopunny",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13, Evoluir Buneary (Amizade)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 353,
                "lumioseId": 111,
                "name": "Shuppet",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/353.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4 (Noite), Becos",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 354,
                "lumioseId": 112,
                "name": "Banette",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/354.png",
                "captureInfo": {
                    "location": "Becos (Noite), Evoluir Shuppet (Nvl 37)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 582,
                "lumioseId": 113,
                "name": "Vanillite",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/582.png",
                "captureInfo": {
                    "location": "Cafés, Sorveterias",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 583,
                "lumioseId": 114,
                "name": "Vanillish",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/583.png",
                "captureInfo": {
                    "location": "Evoluir Vanillite (Nvl 35)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 584,
                "lumioseId": 115,
                "name": "Vanilluxe",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/584.png",
                "captureInfo": {
                    "location": "Evoluir Vanillish (Nvl 47)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 322,
                "lumioseId": 116,
                "name": "Numel",
                "type": [
                    "Fogo",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/322.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 323,
                "lumioseId": 117,
                "name": "Camerupt",
                "type": [
                    "Fogo",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18, Evoluir Numel (Nvl 33)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 449,
                "lumioseId": 118,
                "name": "Hippopotas",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/449.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 450,
                "lumioseId": 119,
                "name": "Hippowdon",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/450.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Hippopotas (Nvl 34)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 529,
                "lumioseId": 120,
                "name": "Drilbur",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/529.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 530,
                "lumioseId": 121,
                "name": "Excadrill",
                "type": [
                    "Terrestre",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/530.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Drilbur (Nvl 31)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 551,
                "lumioseId": 122,
                "name": "Sandile",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/551.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 552,
                "lumioseId": 123,
                "name": "Krokorok",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/552.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Sandile (Nvl 29)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 553,
                "lumioseId": 124,
                "name": "Krookodile",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/553.png",
                "captureInfo": {
                    "location": "Evoluir Krokorok (Nvl 40)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 66,
                "lumioseId": 125,
                "name": "Machop",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3, Obras",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 67,
                "lumioseId": 126,
                "name": "Machoke",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png",
                "captureInfo": {
                    "location": "Zona Selvagem 12, Obras, Evoluir Machop (Nvl 28)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 68,
                "lumioseId": 127,
                "name": "Machamp",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png",
                "captureInfo": {
                    "location": "Trocar Machoke (Link Cable)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 443,
                "lumioseId": 128,
                "name": "Gible",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/443.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 444,
                "lumioseId": 129,
                "name": "Gabite",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17 (Cavernas), Evoluir Gible (Nvl 24)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 445,
                "lumioseId": 130,
                "name": "Garchomp",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
                "captureInfo": {
                    "location": "Evoluir Gabite (Nvl 48)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 703,
                "lumioseId": 131,
                "name": "Carbink",
                "type": [
                    "Pedra",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/703.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas), Joalherias",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 302,
                "lumioseId": 132,
                "name": "Sableye",
                "type": [
                    "Sombrio",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/302.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas), Becos Escuros",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 303,
                "lumioseId": 133,
                "name": "Mawile",
                "type": [
                    "Aço",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/303.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas), Fábrica de Pokébolas",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 359,
                "lumioseId": 134,
                "name": "Absol",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/359.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Noite), Telhados (Raro)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 447,
                "lumioseId": 135,
                "name": "Riolu",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png",
                "captureInfo": {
                    "location": "Zona Selvagem 3, 6",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 448,
                "lumioseId": 136,
                "name": "Lucario",
                "type": [
                    "Lutador",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16, Evoluir Riolu (Amizade/Dia)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 79,
                "lumioseId": 137,
                "name": "Slowpoke",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png",
                "captureInfo": {
                    "location": "Zona Selvagem 2, 10",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 80,
                "lumioseId": 138,
                "name": "Slowbro",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png",
                "captureInfo": {
                    "location": "Zona Selvagem 14, Evoluir Slowpoke (Nvl 37)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 199,
                "lumioseId": 139,
                "name": "Slowking",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png",
                "captureInfo": {
                    "location": "Trocar Slowpoke (Pedra do Rei)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 318,
                "lumioseId": 140,
                "name": "Carvanha",
                "type": [
                    "Água",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/318.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11 (Pesca)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 319,
                "lumioseId": 141,
                "name": "Sharpedo",
                "type": [
                    "Água",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/319.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11 (Pesca), Evoluir Carvanha (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 602,
                "lumioseId": 142,
                "name": "Tynamo",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/602.png",
                "captureInfo": {
                    "location": "Zona Selvagem 6 (Tempestade)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Tempestade",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 603,
                "lumioseId": 143,
                "name": "Eelektrik",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/603.png",
                "captureInfo": {
                    "location": "Zona Selvagem 16 (Tempestade), Evoluir Tynamo (Nvl 39)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Tempestade",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 604,
                "lumioseId": 144,
                "name": "Eelektross",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/604.png",
                "captureInfo": {
                    "location": "Evoluir Eelektrik (Pedra do Trovão)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 147,
                "lumioseId": 145,
                "name": "Dratini",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10, 14 (Pesca)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 148,
                "lumioseId": 146,
                "name": "Dragonair",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png",
                "captureInfo": {
                    "location": "Zona Selvagem 14 (Pesca), Evoluir Dratini (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 149,
                "lumioseId": 147,
                "name": "Dragonite",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
                "captureInfo": {
                    "location": "Evoluir Dragonair (Nvl 55)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 1,
                "lumioseId": 148,
                "name": "Bulbasaur",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
                "captureInfo": {
                    "location": "Zona Selvagem 12, Estufa",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 2,
                "lumioseId": 149,
                "name": "Ivysaur",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
                "captureInfo": {
                    "location": "Evoluir Bulbasaur (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 3,
                "lumioseId": 150,
                "name": "Venusaur",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
                "captureInfo": {
                    "location": "Evoluir Ivysaur (Nvl 32)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 4,
                "lumioseId": 151,
                "name": "Charmander",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
                "captureInfo": {
                    "location": "Zona Selvagem 9, Área Industrial",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 5,
                "lumioseId": 152,
                "name": "Charmeleon",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
                "captureInfo": {
                    "location": "Evoluir Charmander (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 6,
                "lumioseId": 153,
                "name": "Charizard",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
                "captureInfo": {
                    "location": "Evoluir Charmeleon (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 7,
                "lumioseId": 154,
                "name": "Squirtle",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10, Canais",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 8,
                "lumioseId": 155,
                "name": "Wartortle",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
                "captureInfo": {
                    "location": "Evoluir Squirtle (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 9,
                "lumioseId": 156,
                "name": "Blastoise",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
                "captureInfo": {
                    "location": "Evoluir Wartortle (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 618,
                "lumioseId": 157,
                "name": "Stunfisk",
                "type": [
                    "Terrestre",
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/618.png",
                "captureInfo": {
                    "location": "Zona Selvagem 10 (Lama), Esgotos",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 676,
                "lumioseId": 158,
                "name": "Furfrou",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/676.png",
                "captureInfo": {
                    "location": "Zona Selvagem 1, Salões de Beleza",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 686,
                "lumioseId": 159,
                "name": "Inkay",
                "type": [
                    "Sombrio",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/686.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 687,
                "lumioseId": 160,
                "name": "Malamar",
                "type": [
                    "Sombrio",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/687.png",
                "captureInfo": {
                    "location": "Evoluir Inkay (Nvl 30 + Virar console)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 690,
                "lumioseId": 161,
                "name": "Skrelp",
                "type": [
                    "Venenoso",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/690.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11 (Pesca/Algas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 691,
                "lumioseId": 162,
                "name": "Dragalge",
                "type": [
                    "Venenoso",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/691.png",
                "captureInfo": {
                    "location": "Zona Selvagem 14, Evoluir Skrelp (Nvl 48)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 692,
                "lumioseId": 163,
                "name": "Clauncher",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/692.png",
                "captureInfo": {
                    "location": "Zona Selvagem 11 (Pesca)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 693,
                "lumioseId": 164,
                "name": "Clawitzer",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/693.png",
                "captureInfo": {
                    "location": "Zona Selvagem 14, Evoluir Clauncher (Nvl 37)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 704,
                "lumioseId": 165,
                "name": "Goomy",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/704.png",
                "captureInfo": {
                    "location": "Zona Selvagem 14 (Chuva/Pântano)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Chuva",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 705,
                "lumioseId": 166,
                "name": "Sliggoo",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/705.png",
                "captureInfo": {
                    "location": "Evoluir Goomy (Nvl 40)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 706,
                "lumioseId": 167,
                "name": "Goodra",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/706.png",
                "captureInfo": {
                    "location": "Evoluir Sliggoo (Nvl 50 + Chuva)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Chuva",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 225,
                "lumioseId": 168,
                "name": "Delibird",
                "type": [
                    "Gelo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Neve), Entregas de Presente",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Neve",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 361,
                "lumioseId": 169,
                "name": "Snorunt",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/361.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Neve)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Neve",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 362,
                "lumioseId": 170,
                "name": "Glalie",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/362.png",
                "captureInfo": {
                    "location": "Evoluir Snorunt (Nvl 42)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 478,
                "lumioseId": 171,
                "name": "Froslass",
                "type": [
                    "Gelo",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png",
                "captureInfo": {
                    "location": "Evoluir Snorunt (Fêmea + Pedra do Amanhecer)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 459,
                "lumioseId": 172,
                "name": "Snover",
                "type": [
                    "Grama",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/459.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Neve)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Neve",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 460,
                "lumioseId": 173,
                "name": "Abomasnow",
                "type": [
                    "Grama",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/460.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Neve), Evoluir Snover (Nvl 40)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Neve",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 712,
                "lumioseId": 174,
                "name": "Bergmite",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/712.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Cavernas de Gelo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 713,
                "lumioseId": 175,
                "name": "Avalugg",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/713.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Cavernas de Gelo), Evoluir Bergmite (Nvl 37)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 123,
                "lumioseId": 176,
                "name": "Scyther",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, 13",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 212,
                "lumioseId": 177,
                "name": "Scizor",
                "type": [
                    "Inseto",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png",
                "captureInfo": {
                    "location": "Trocar Scyther (Metal Coat)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 127,
                "lumioseId": 178,
                "name": "Pinsir",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 214,
                "lumioseId": 179,
                "name": "Heracross",
                "type": [
                    "Inseto",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 587,
                "lumioseId": 180,
                "name": "Emolga",
                "type": [
                    "Elétrico",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/587.png",
                "captureInfo": {
                    "location": "Árvores (Planar entre elas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 701,
                "lumioseId": 181,
                "name": "Hawlucha",
                "type": [
                    "Lutador",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/701.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13, Telhados",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 708,
                "lumioseId": 182,
                "name": "Phantump",
                "type": [
                    "Fantasma",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/708.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4, Florestas",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 709,
                "lumioseId": 183,
                "name": "Trevenant",
                "type": [
                    "Fantasma",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/709.png",
                "captureInfo": {
                    "location": "Trocar Phantump",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 559,
                "lumioseId": 184,
                "name": "Scraggy",
                "type": [
                    "Sombrio",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/559.png",
                "captureInfo": {
                    "location": "Zona Selvagem 5, Becos",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 560,
                "lumioseId": 185,
                "name": "Scrafty",
                "type": [
                    "Sombrio",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/560.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15, Becos, Evoluir Scraggy (Nvl 39)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 714,
                "lumioseId": 186,
                "name": "Noibat",
                "type": [
                    "Voador",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/714.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4, 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 715,
                "lumioseId": 187,
                "name": "Noivern",
                "type": [
                    "Voador",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/715.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Noite), Evoluir Noibat (Nvl 48)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 707,
                "lumioseId": 188,
                "name": "Klefki",
                "type": [
                    "Aço",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/707.png",
                "captureInfo": {
                    "location": "Zona Selvagem 19, Hotéis",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 607,
                "lumioseId": 189,
                "name": "Litwick",
                "type": [
                    "Fantasma",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/607.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4, Bibliotecas Antigas",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 608,
                "lumioseId": 190,
                "name": "Lampent",
                "type": [
                    "Fantasma",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/608.png",
                "captureInfo": {
                    "location": "Zona Selvagem 15, Evoluir Litwick (Nvl 41)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 609,
                "lumioseId": 191,
                "name": "Chandelure",
                "type": [
                    "Fantasma",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/609.png",
                "captureInfo": {
                    "location": "Evoluir Lampent (Pedra do Crepúsculo)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 142,
                "lumioseId": 192,
                "name": "Aerodactyl",
                "type": [
                    "Pedra",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png",
                "captureInfo": {
                    "location": "Museu de Fósseis (Reviver Âmbar Velho)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 696,
                "lumioseId": 193,
                "name": "Tyrunt",
                "type": [
                    "Pedra",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/696.png",
                "captureInfo": {
                    "location": "Museu de Fósseis (Reviver Fóssil Mandíbula)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 697,
                "lumioseId": 194,
                "name": "Tyrantrum",
                "type": [
                    "Pedra",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/697.png",
                "captureInfo": {
                    "location": "Evoluir Tyrunt (Nvl 39/Dia)",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 698,
                "lumioseId": 195,
                "name": "Amaura",
                "type": [
                    "Pedra",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/698.png",
                "captureInfo": {
                    "location": "Museu de Fósseis (Reviver Fóssil Vela)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 699,
                "lumioseId": 196,
                "name": "Aurorus",
                "type": [
                    "Pedra",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/699.png",
                "captureInfo": {
                    "location": "Evoluir Amaura (Nvl 39/Noite)",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 95,
                "lumioseId": 197,
                "name": "Onix",
                "type": [
                    "Pedra",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 208,
                "lumioseId": 198,
                "name": "Steelix",
                "type": [
                    "Aço",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png",
                "captureInfo": {
                    "location": "Trocar Onix (Metal Coat)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 304,
                "lumioseId": 199,
                "name": "Aron",
                "type": [
                    "Aço",
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/304.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 305,
                "lumioseId": 200,
                "name": "Lairon",
                "type": [
                    "Aço",
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/305.png",
                "captureInfo": {
                    "location": "Zona Selvagem 17, Evoluir Aron (Nvl 32)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 306,
                "lumioseId": 201,
                "name": "Aggron",
                "type": [
                    "Aço",
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/306.png",
                "captureInfo": {
                    "location": "Evoluir Lairon (Nvl 42)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 694,
                "lumioseId": 202,
                "name": "Helioptile",
                "type": [
                    "Elétrico",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/694.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8, Usina Elétrica",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 695,
                "lumioseId": 203,
                "name": "Heliolisk",
                "type": [
                    "Elétrico",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/695.png",
                "captureInfo": {
                    "location": "Evoluir Helioptile (Pedra do Sol)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 710,
                "lumioseId": 204,
                "name": "Pumpkaboo",
                "type": [
                    "Fantasma",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/710.png",
                "captureInfo": {
                    "location": "Zona Selvagem 4, Jardins",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 711,
                "lumioseId": 205,
                "name": "Gourgeist",
                "type": [
                    "Fantasma",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/711.png",
                "captureInfo": {
                    "location": "Trocar Pumpkaboo",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 246,
                "lumioseId": 206,
                "name": "Larvitar",
                "type": [
                    "Pedra",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 247,
                "lumioseId": 207,
                "name": "Pupitar",
                "type": [
                    "Pedra",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png",
                "captureInfo": {
                    "location": "Evoluir Larvitar (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 248,
                "lumioseId": 208,
                "name": "Tyranitar",
                "type": [
                    "Pedra",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png",
                "captureInfo": {
                    "location": "Evoluir Pupitar (Nvl 55)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 656,
                "lumioseId": 209,
                "name": "Froakie",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 657,
                "lumioseId": 210,
                "name": "Frogadier",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png",
                "captureInfo": {
                    "location": "Evoluir Froakie (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 658,
                "lumioseId": 211,
                "name": "Greninja",
                "type": [
                    "Água",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
                "captureInfo": {
                    "location": "Evoluir Frogadier (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 870,
                "lumioseId": 212,
                "name": "Falinks",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/870.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13, Ruínas",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 650,
                "lumioseId": 213,
                "name": "Chespin",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 651,
                "lumioseId": 214,
                "name": "Quilladin",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/651.png",
                "captureInfo": {
                    "location": "Evoluir Chespin (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 652,
                "lumioseId": 215,
                "name": "Chesnaught",
                "type": [
                    "Grama",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/652.png",
                "captureInfo": {
                    "location": "Evoluir Quilladin (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 227,
                "lumioseId": 216,
                "name": "Skarmory",
                "type": [
                    "Aço",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png",
                "captureInfo": {
                    "location": "Zona Selvagem 13, Telhados Altos",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 653,
                "lumioseId": 217,
                "name": "Fennekin",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png",
                "captureInfo": {
                    "location": "Inicial, Zona Selvagem 20 (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 654,
                "lumioseId": 218,
                "name": "Braixen",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/654.png",
                "captureInfo": {
                    "location": "Evoluir Fennekin (Nvl 16)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 655,
                "lumioseId": 219,
                "name": "Delphox",
                "type": [
                    "Fogo",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png",
                "captureInfo": {
                    "location": "Evoluir Braixen (Nvl 36)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 371,
                "lumioseId": 220,
                "name": "Bagon",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/371.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Penhascos)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 372,
                "lumioseId": 221,
                "name": "Shelgon",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/372.png",
                "captureInfo": {
                    "location": "Evoluir Bagon (Nvl 30)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 373,
                "lumioseId": 222,
                "name": "Salamence",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png",
                "captureInfo": {
                    "location": "Evoluir Shelgon (Nvl 50)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 115,
                "lumioseId": 223,
                "name": "Kangaskhan",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png",
                "captureInfo": {
                    "location": "Zona Selvagem 8 (Cavernas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 780,
                "lumioseId": 224,
                "name": "Drampa",
                "type": [
                    "Normal",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/780.png",
                "captureInfo": {
                    "location": "Zona Selvagem 18 (Montanhas)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 374,
                "lumioseId": 225,
                "name": "Beldum",
                "type": [
                    "Aço",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/374.png",
                "captureInfo": {
                    "location": "Zona Selvagem 9, Área Magnética",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 375,
                "lumioseId": 226,
                "name": "Metang",
                "type": [
                    "Aço",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/375.png",
                "captureInfo": {
                    "location": "Evoluir Beldum (Nvl 20)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 376,
                "lumioseId": 227,
                "name": "Metagross",
                "type": [
                    "Aço",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png",
                "captureInfo": {
                    "location": "Evoluir Metang (Nvl 45)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 716,
                "lumioseId": 228,
                "name": "Xerneas",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png",
                "captureInfo": {
                    "location": "Eventoo da História (Geosenge Town)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 717,
                "lumioseId": 229,
                "name": "Yveltal",
                "type": [
                    "Sombrio",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png",
                "captureInfo": {
                    "location": "Eventoo da História (Geosenge Town)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 718,
                "lumioseId": 230,
                "name": "Zygarde",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png",
                "captureInfo": {
                    "location": "Caverna Terminus (Coletar Células)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 719,
                "lumioseId": 231,
                "name": "Diancie",
                "type": [
                    "Pedra",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/719.png",
                "captureInfo": {
                    "location": "Eventoo / Pesquisa Especial",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            {
                "id": 150,
                "lumioseId": 232,
                "name": "Mewtwo",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
                "captureInfo": {
                    "location": "Masmorra Desconhecida (Pós-jogo)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique os arredores."
                }
            },
            // NEW MEGA EVOLUTIONS (LEGENDS Z-A)
            { "id": 20001, "lumioseId": 401, "name": "Mega Raichu X", "type": ["Elétrico"], "image": "img/mega/Mega-Raichu-X.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20002, "lumioseId": 402, "name": "Mega Raichu Y", "type": ["Elétrico"], "image": "img/mega/Mega-Raichu-Y.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20003, "lumioseId": 403, "name": "Mega Clefable", "type": ["Fada","Voador"], "image": "img/mega/Mega-Clefable.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20004, "lumioseId": 404, "name": "Mega Victreebel", "type": ["Grama","Venenoso"], "image": "img/mega/Mega-Victreebel.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20005, "lumioseId": 405, "name": "Mega Starmie", "type": ["Água","Psíquico"], "image": "img/mega/Mega-Starmie.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20006, "lumioseId": 406, "name": "Mega Dragonite", "type": ["Dragão","Voador"], "image": "img/mega/Mega-Dragonite.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20007, "lumioseId": 407, "name": "Mega Meganium", "type": ["Grama","Fada"], "image": "img/mega/Mega-Meganium.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20008, "lumioseId": 408, "name": "Mega Feraligatr", "type": ["Água","Dragão"], "image": "img/mega/Mega-Feraligatr.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20009, "lumioseId": 409, "name": "Mega Skarmory", "type": ["Aço","Voador"], "image": "img/mega/Mega-Skarmory.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20010, "lumioseId": 410, "name": "Mega Chimecho", "type": ["Psíquico","Aço"], "image": "img/mega/Mega-Chimecho.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20011, "lumioseId": 411, "name": "Mega Absol Z", "type": ["Sombrio","Fantasma"], "image": "img/mega/Mega-Absol-Z.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20012, "lumioseId": 412, "name": "Mega Staraptor", "type": ["Lutador","Voador"], "image": "img/mega/Mega-Staraptor.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20013, "lumioseId": 413, "name": "Mega Garchomp Z", "type": ["Dragão"], "image": "img/mega/Mega-Garchomp-Z.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20014, "lumioseId": 414, "name": "Mega Lucario Z", "type": ["Lutador","Aço"], "image": "img/mega/Mega-Lucario-Z.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20015, "lumioseId": 415, "name": "Mega Froslass", "type": ["Gelo","Fantasma"], "image": "img/mega/Mega-Froslass.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20016, "lumioseId": 416, "name": "Mega Heatran", "type": ["Fogo","Aço"], "image": "img/mega/Mega-Heatran.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20017, "lumioseId": 417, "name": "Mega Darkrai", "type": ["Sombrio"], "image": "img/mega/Mega-Darkrai.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20018, "lumioseId": 418, "name": "Mega Emboar", "type": ["Fogo","Lutador"], "image": "img/mega/Mega-Emboar.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20019, "lumioseId": 419, "name": "Mega Excadrill", "type": ["Terrestre","Aço"], "image": "img/mega/Mega-Excadrill.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20020, "lumioseId": 420, "name": "Mega Scolipede", "type": ["Inseto","Venenoso"], "image": "img/mega/Mega-Scolipede.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20021, "lumioseId": 421, "name": "Mega Scrafty", "type": ["Sombrio","Lutador"], "image": "img/mega/Mega-Scrafty.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20022, "lumioseId": 422, "name": "Mega Eelektross", "type": ["Elétrico"], "image": "img/mega/Mega-Eelektross.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20023, "lumioseId": 423, "name": "Mega Chandelure", "type": ["Fantasma","Fogo"], "image": "img/mega/Mega-Chandelure.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20024, "lumioseId": 424, "name": "Mega Golurk", "type": ["Terrestre","Fantasma"], "image": "img/mega/Mega-Golurk.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20025, "lumioseId": 425, "name": "Mega Chesnaught", "type": ["Grama","Lutador"], "image": "img/mega/Mega-Chesnaught.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20026, "lumioseId": 426, "name": "Mega Delphox", "type": ["Fogo","Psíquico"], "image": "img/mega/Mega-Delphox.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20027, "lumioseId": 427, "name": "Mega Greninja", "type": ["Água","Sombrio"], "image": "img/mega/Mega-Greninja.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20028, "lumioseId": 428, "name": "Mega Pyroar", "type": ["Fogo","Normal"], "image": "img/mega/Mega-Pyroar.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20029, "lumioseId": 429, "name": "Mega Eternal Floette", "type": ["Fada"], "image": "img/mega/Mega-Floette.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20030, "lumioseId": 430, "name": "Mega Meowstic", "type": ["Psíquico"], "image": "img/mega/Mega-Meowstic.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20031, "lumioseId": 431, "name": "Mega Malamar", "type": ["Sombrio","Psíquico"], "image": "img/mega/Mega-Malamar.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20032, "lumioseId": 432, "name": "Mega Barbaracle", "type": ["Pedra","Lutador"], "image": "img/mega/Mega-Barbaracle.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20033, "lumioseId": 433, "name": "Mega Dragalge", "type": ["Venenoso","Dragão"], "image": "img/mega/Mega-Dragalge.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20034, "lumioseId": 434, "name": "Mega Hawlucha", "type": ["Lutador","Voador"], "image": "img/mega/Mega-Hawlucha.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20035, "lumioseId": 435, "name": "Mega Complete Zygarde", "type": ["Dragão","Terrestre"], "image": "img/mega/Mega-Zygarde.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20036, "lumioseId": 436, "name": "Mega Crabominable", "type": ["Lutador","Gelo"], "image": "img/mega/Mega-Crabominable.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20037, "lumioseId": 437, "name": "Mega Golisopod", "type": ["Inseto","Aço"], "image": "img/mega/Mega-Golisopod.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20038, "lumioseId": 438, "name": "Mega Drampa", "type": ["Normal","Dragão"], "image": "img/mega/Mega-Drampa.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20039, "lumioseId": 439, "name": "Mega Magearna", "type": ["Aço","Fada"], "image": "img/mega/Mega-Magearna.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20041, "lumioseId": 441, "name": "Mega Zeraora", "type": ["Elétrico"], "image": "img/mega/Mega-Zeraora.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20042, "lumioseId": 442, "name": "Mega Scovillain", "type": ["Grama","Fogo"], "image": "img/mega/Mega-Scovillian.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20043, "lumioseId": 443, "name": "Mega Glimmora", "type": ["Pedra","Venenoso"], "image": "img/mega/Mega-Glimmora.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20044, "lumioseId": 444, "name": "Mega Tatsugiri", "type": ["Dragão","Água"], "image": "img/mega/Mega-Tatsugiri.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20047, "lumioseId": 447, "name": "Mega Falinks", "type": ["Lutador"], "image": "img/mega/Mega-Falinks.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20048, "lumioseId": 448, "name": "Mega Baxcalibur", "type": ["Dragão","Gelo"], "image": "img/mega/Mega-Baxcalibur.jpg", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"New in Legends Z-A"} },
            { "id": 20101, "lumioseId": 450, "name": "Mega Venusaur", "type": ["Grama","Venenoso"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20102, "lumioseId": 451, "name": "Mega Charizard X", "type": ["Fogo","Dragão"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20103, "lumioseId": 452, "name": "Mega Charizard Y", "type": ["Fogo","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20104, "lumioseId": 453, "name": "Mega Blastoise", "type": ["Água"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20105, "lumioseId": 454, "name": "Mega Beedrill", "type": ["Inseto","Venenoso"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10090.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20106, "lumioseId": 455, "name": "Mega Pidgeot", "type": ["Normal","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10073.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20107, "lumioseId": 456, "name": "Mega Alakazam", "type": ["Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20108, "lumioseId": 457, "name": "Mega Slowbro", "type": ["Água","Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10071.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20109, "lumioseId": 458, "name": "Mega Gengar", "type": ["Fantasma","Venenoso"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20110, "lumioseId": 459, "name": "Mega Kangaskhan", "type": ["Normal"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20111, "lumioseId": 460, "name": "Mega Pinsir", "type": ["Inseto","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10040.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20112, "lumioseId": 461, "name": "Mega Gyarados", "type": ["Água","Sombrio"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20113, "lumioseId": 462, "name": "Mega Aerodactyl", "type": ["Pedra","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10042.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20114, "lumioseId": 463, "name": "Mega Mewtwo X", "type": ["Psíquico","Lutador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20115, "lumioseId": 464, "name": "Mega Mewtwo Y", "type": ["Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20116, "lumioseId": 465, "name": "Mega Ampharos", "type": ["Elétrico","Dragão"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10045.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20117, "lumioseId": 466, "name": "Mega Steelix", "type": ["Aço","Terrestre"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10072.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20118, "lumioseId": 467, "name": "Mega Scizor", "type": ["Inseto","Aço"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10046.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20119, "lumioseId": 468, "name": "Mega Heracross", "type": ["Inseto","Lutador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10047.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20120, "lumioseId": 469, "name": "Mega Houndoom", "type": ["Sombrio","Fogo"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10048.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20121, "lumioseId": 470, "name": "Mega Tyranitar", "type": ["Pedra","Sombrio"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10049.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20122, "lumioseId": 471, "name": "Mega Sceptile", "type": ["Grama","Dragão"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10065.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20123, "lumioseId": 472, "name": "Mega Blaziken", "type": ["Fogo","Lutador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10050.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20124, "lumioseId": 473, "name": "Mega Swampert", "type": ["Água","Terrestre"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10064.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20125, "lumioseId": 474, "name": "Mega Gardevoir", "type": ["Psíquico","Fada"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10051.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20126, "lumioseId": 475, "name": "Mega Sableye", "type": ["Sombrio","Fantasma"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10066.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20127, "lumioseId": 476, "name": "Mega Mawile", "type": ["Aço","Fada"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10052.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20128, "lumioseId": 477, "name": "Mega Aggron", "type": ["Aço"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10053.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20129, "lumioseId": 478, "name": "Mega Medicham", "type": ["Lutador","Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10054.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20130, "lumioseId": 479, "name": "Mega Manectric", "type": ["Elétrico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10055.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20131, "lumioseId": 480, "name": "Mega Sharpedo", "type": ["Água","Sombrio"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10067.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20132, "lumioseId": 481, "name": "Mega Camerupt", "type": ["Fogo","Terrestre"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10087.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20133, "lumioseId": 482, "name": "Mega Altaria", "type": ["Dragão","Fada"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10068.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20134, "lumioseId": 483, "name": "Mega Banette", "type": ["Fantasma"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10056.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20135, "lumioseId": 484, "name": "Mega Absol", "type": ["Sombrio"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10057.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20136, "lumioseId": 485, "name": "Mega Glalie", "type": ["Gelo"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10074.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20137, "lumioseId": 486, "name": "Mega Salamence", "type": ["Dragão","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10089.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20138, "lumioseId": 487, "name": "Mega Metagross", "type": ["Aço","Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10076.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20139, "lumioseId": 488, "name": "Mega Latias", "type": ["Dragão","Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10062.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20140, "lumioseId": 489, "name": "Mega Latios", "type": ["Dragão","Psíquico"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10063.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20141, "lumioseId": 490, "name": "Mega Rayquaza", "type": ["Dragão","Voador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10079.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20142, "lumioseId": 491, "name": "Mega Lopunny", "type": ["Normal","Lutador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10088.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20143, "lumioseId": 492, "name": "Mega Garchomp", "type": ["Dragão","Terrestre"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10058.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20144, "lumioseId": 493, "name": "Mega Lucario", "type": ["Lutador","Aço"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10059.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20145, "lumioseId": 494, "name": "Mega Abomasnow", "type": ["Grama","Gelo"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10060.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20146, "lumioseId": 495, "name": "Mega Gallade", "type": ["Psíquico","Lutador"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10069.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20147, "lumioseId": 496, "name": "Mega Audino", "type": ["Normal","Fada"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10070.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} },
            { "id": 20148, "lumioseId": 497, "name": "Mega Diancie", "type": ["Pedra","Fada"], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10075.png", "captureInfo": {"location":"Mega Evolução","method":"Mega Evolução","notes":"Returning Mega"} }
        ]
    },
    {
        "id": "scarlet-violet",
        "name": "Pokémon Scarlet & Violet",
        "region": "Paldea",
        "pokemonList": [
            {
                "id": 906,
                "lumioseId": 1,
                "name": "Sprigatito",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png",
                "captureInfo": {
                    "location": "Received as a Inicial Pokemon outside Nemona's House.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 907,
                "lumioseId": 2,
                "name": "Floragato",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/907.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Sprigatito.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 908,
                "lumioseId": 3,
                "name": "Meowscarada",
                "type": [
                    "Grama",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Floragato.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 909,
                "lumioseId": 4,
                "name": "Fuecoco",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png",
                "captureInfo": {
                    "location": "Received as a Inicial Pokemon outside Nemona's House.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 910,
                "lumioseId": 5,
                "name": "Crocalor",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/910.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Fuecoco.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 911,
                "lumioseId": 6,
                "name": "Skeledirge",
                "type": [
                    "Fogo",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/911.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Crocalor.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 912,
                "lumioseId": 7,
                "name": "Quaxly",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png",
                "captureInfo": {
                    "location": "Received as a Inicial Pokemon outside Nemona's House.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 913,
                "lumioseId": 8,
                "name": "Quaxwell",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/913.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Quaxly.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 914,
                "lumioseId": 9,
                "name": "Quaquaval",
                "type": [
                    "Água",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/914.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Quaxwell.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 915,
                "lumioseId": 10,
                "name": "Lechonk",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/915.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 916,
                "lumioseId": 11,
                "name": "Oinkologne",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/916.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 917,
                "lumioseId": 12,
                "name": "Tarountula",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/917.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 918,
                "lumioseId": 13,
                "name": "Spidops",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/918.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 919,
                "lumioseId": 14,
                "name": "Nymble",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/919.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 920,
                "lumioseId": 15,
                "name": "Lokix",
                "type": [
                    "Inseto",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/920.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 187,
                "lumioseId": 16,
                "name": "Hoppip",
                "type": [
                    "Grama",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/187.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 188,
                "lumioseId": 17,
                "name": "Skiploom",
                "type": [
                    "Grama",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/188.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 189,
                "lumioseId": 18,
                "name": "Jumpluff",
                "type": [
                    "Grama",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/189.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 661,
                "lumioseId": 19,
                "name": "Fletchling",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/661.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 662,
                "lumioseId": 20,
                "name": "Fletchinder",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/662.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 663,
                "lumioseId": 21,
                "name": "Talonflame",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/663.png",
                "captureInfo": {
                    "location": "Can be found in The Great Crater of Paldea (Area Zero).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 921,
                "lumioseId": 22,
                "name": "Pawmi",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/921.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 922,
                "lumioseId": 23,
                "name": "Pawmo",
                "type": [
                    "Elétrico",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/922.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 923,
                "lumioseId": 24,
                "name": "Pawmot",
                "type": [
                    "Elétrico",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/923.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Pawmo.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 228,
                "lumioseId": 25,
                "name": "Houndour",
                "type": [
                    "Sombrio",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 229,
                "lumioseId": 26,
                "name": "Houndoom",
                "type": [
                    "Sombrio",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 734,
                "lumioseId": 27,
                "name": "Yungoos",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/734.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 735,
                "lumioseId": 28,
                "name": "Gumshoos",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/735.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 819,
                "lumioseId": 29,
                "name": "Skwovet",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/819.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 820,
                "lumioseId": 30,
                "name": "Greedent",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/820.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 191,
                "lumioseId": 31,
                "name": "Sunkern",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/191.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 192,
                "lumioseId": 32,
                "name": "Sunflora",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/192.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 401,
                "lumioseId": 33,
                "name": "Kricketot",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/401.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 402,
                "lumioseId": 34,
                "name": "Kricketune",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/402.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 664,
                "lumioseId": 35,
                "name": "Scatterbug",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/664.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 665,
                "lumioseId": 36,
                "name": "Spewpa",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/665.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 666,
                "lumioseId": 37,
                "name": "Vivillon",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/666.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 415,
                "lumioseId": 38,
                "name": "Combee",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/415.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 416,
                "lumioseId": 39,
                "name": "Vespiquen",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 821,
                "lumioseId": 40,
                "name": "Rookidee",
                "type": [
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/821.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 822,
                "lumioseId": 41,
                "name": "Corvisquire",
                "type": [
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/822.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 823,
                "lumioseId": 42,
                "name": "Corviknight",
                "type": [
                    "Voador",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png",
                "captureInfo": {
                    "location": "Can be evolved from Corvisquire.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 440,
                "lumioseId": 43,
                "name": "Happiny",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/440.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 113,
                "lumioseId": 44,
                "name": "Chansey",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 242,
                "lumioseId": 45,
                "name": "Blissey",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/242.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 298,
                "lumioseId": 46,
                "name": "Azurill",
                "type": [
                    "Normal",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/298.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 183,
                "lumioseId": 47,
                "name": "Marill",
                "type": [
                    "Água",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/183.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Two).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 184,
                "lumioseId": 48,
                "name": "Azumarill",
                "type": [
                    "Água",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 283,
                "lumioseId": 49,
                "name": "Surskit",
                "type": [
                    "Inseto",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/283.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 284,
                "lumioseId": 50,
                "name": "Masquerain",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/284.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 418,
                "lumioseId": 51,
                "name": "Buizel",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/418.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 419,
                "lumioseId": 52,
                "name": "Floatzel",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/419.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 10253,
                "lumioseId": 53,
                "name": "Wooper",
                "type": [
                    "Venenoso",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10253.png",
                "captureInfo": {
                    "location": "Localização a ser descoberta em Paldea",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 980,
                "lumioseId": 54,
                "name": "Clodsire",
                "type": [
                    "Venenoso",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/980.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 54,
                "lumioseId": 55,
                "name": "Psyduck",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 55,
                "lumioseId": 56,
                "name": "Golduck",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 833,
                "lumioseId": 57,
                "name": "Chewtle",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/833.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 834,
                "lumioseId": 58,
                "name": "Drednaw",
                "type": [
                    "Água",
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/834.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 174,
                "lumioseId": 59,
                "name": "Igglybuff",
                "type": [
                    "Normal",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 39,
                "lumioseId": 60,
                "name": "Jigglypuff",
                "type": [
                    "Normal",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 40,
                "lumioseId": 61,
                "name": "Wigglytuff",
                "type": [
                    "Normal",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 280,
                "lumioseId": 62,
                "name": "Ralts",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/280.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 281,
                "lumioseId": 63,
                "name": "Kirlia",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/281.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 282,
                "lumioseId": 64,
                "name": "Gardevoir",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png",
                "captureInfo": {
                    "location": "Can be found on Glaseado Mountain or by evolving a Kirlia.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 475,
                "lumioseId": 65,
                "name": "Gallade",
                "type": [
                    "Psíquico",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/475.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 96,
                "lumioseId": 66,
                "name": "Drowzee",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 97,
                "lumioseId": 67,
                "name": "Hypno",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png",
                "captureInfo": {
                    "location": "Can be evolved from Drowzee.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 92,
                "lumioseId": 68,
                "name": "Gastly",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 93,
                "lumioseId": 69,
                "name": "Haunter",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 94,
                "lumioseId": 70,
                "name": "Gengar",
                "type": [
                    "Fantasma",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Haunter via trading.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 924,
                "lumioseId": 71,
                "name": "Tandemaus",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/924.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 925,
                "lumioseId": 72,
                "name": "Maushold",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/925.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Tandemaus.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 172,
                "lumioseId": 73,
                "name": "Pichu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 25,
                "lumioseId": 74,
                "name": "Pikachu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 26,
                "lumioseId": 75,
                "name": "Raichu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 926,
                "lumioseId": 76,
                "name": "Fidough",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/926.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 927,
                "lumioseId": 77,
                "name": "Dachsbun",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/927.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 287,
                "lumioseId": 78,
                "name": "Slakoth",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/287.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 288,
                "lumioseId": 79,
                "name": "Vigoroth",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/288.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 289,
                "lumioseId": 80,
                "name": "Slaking",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/289.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 761,
                "lumioseId": 81,
                "name": "Bounsweet",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/761.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 762,
                "lumioseId": 82,
                "name": "Steenee",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/762.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 763,
                "lumioseId": 83,
                "name": "Tsareena",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from a Steenee with Stomp.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 928,
                "lumioseId": 84,
                "name": "Smoliv",
                "type": [
                    "Grama",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/928.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 929,
                "lumioseId": 85,
                "name": "Dolliv",
                "type": [
                    "Grama",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/929.png",
                "captureInfo": {
                    "location": "Can be evolved from Smoliv.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 930,
                "lumioseId": 86,
                "name": "Arboliva",
                "type": [
                    "Grama",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/930.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 438,
                "lumioseId": 87,
                "name": "Bonsly",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/438.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 185,
                "lumioseId": 88,
                "name": "Sudowoodo",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) and Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 744,
                "lumioseId": 89,
                "name": "Rockruff",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/744.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 745,
                "lumioseId": 90,
                "name": "Lycanroc",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 837,
                "lumioseId": 91,
                "name": "Rolycoly",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/837.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 838,
                "lumioseId": 92,
                "name": "Carkol",
                "type": [
                    "Pedra",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/838.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 839,
                "lumioseId": 93,
                "name": "Coalossal",
                "type": [
                    "Pedra",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/839.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Carkol.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 403,
                "lumioseId": 94,
                "name": "Shinx",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/403.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 404,
                "lumioseId": 95,
                "name": "Luxio",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/404.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 405,
                "lumioseId": 96,
                "name": "Luxray",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/405.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Two).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 396,
                "lumioseId": 97,
                "name": "Starly",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/396.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 397,
                "lumioseId": 98,
                "name": "Staravia",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/397.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 398,
                "lumioseId": 99,
                "name": "Staraptor",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/398.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 741,
                "lumioseId": 100,
                "name": "Oricorio",
                "type": [
                    "Fogo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/741.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 179,
                "lumioseId": 101,
                "name": "Mareep",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 180,
                "lumioseId": 102,
                "name": "Flaaffy",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 181,
                "lumioseId": 103,
                "name": "Ampharos",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 548,
                "lumioseId": 104,
                "name": "Petilil",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/548.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 549,
                "lumioseId": 105,
                "name": "Lilligant",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/549.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 285,
                "lumioseId": 106,
                "name": "Shroomish",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/285.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 286,
                "lumioseId": 107,
                "name": "Breloom",
                "type": [
                    "Grama",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/286.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 840,
                "lumioseId": 108,
                "name": "Applin",
                "type": [
                    "Grama",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/840.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 841,
                "lumioseId": 109,
                "name": "Flapple",
                "type": [
                    "Grama",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/841.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Applin using a Tart Apple.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 842,
                "lumioseId": 110,
                "name": "Appletun",
                "type": [
                    "Grama",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/842.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Applin using a Sweet Apple.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 325,
                "lumioseId": 111,
                "name": "Spoink",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/325.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 326,
                "lumioseId": 112,
                "name": "Grumpig",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/326.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 931,
                "lumioseId": 113,
                "name": "Squawkabilly",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/931.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 200,
                "lumioseId": 114,
                "name": "Misdreavus",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 429,
                "lumioseId": 115,
                "name": "Mismagius",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/429.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 296,
                "lumioseId": 116,
                "name": "Makuhita",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/296.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 297,
                "lumioseId": 117,
                "name": "Hariyama",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/297.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 739,
                "lumioseId": 118,
                "name": "Crabrawler",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/739.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 740,
                "lumioseId": 119,
                "name": "Crabominable",
                "type": [
                    "Lutador",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/740.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 757,
                "lumioseId": 120,
                "name": "Salandit",
                "type": [
                    "Venenoso",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 758,
                "lumioseId": 121,
                "name": "Salazzle",
                "type": [
                    "Venenoso",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 231,
                "lumioseId": 122,
                "name": "Phanpy",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/231.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 232,
                "lumioseId": 123,
                "name": "Donphan",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/232.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 878,
                "lumioseId": 124,
                "name": "Cufant",
                "type": [
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/878.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 879,
                "lumioseId": 125,
                "name": "Copperajah",
                "type": [
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/879.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 443,
                "lumioseId": 126,
                "name": "Gible",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/443.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 444,
                "lumioseId": 127,
                "name": "Gabite",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 445,
                "lumioseId": 128,
                "name": "Garchomp",
                "type": [
                    "Dragão",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
                "captureInfo": {
                    "location": "Can be found flying while climbing the mountains surrounding The Great Crater of Paldea.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 932,
                "lumioseId": 129,
                "name": "Nacli",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/932.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 933,
                "lumioseId": 130,
                "name": "Naclstack",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/933.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 934,
                "lumioseId": 131,
                "name": "Garganacl",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/934.png",
                "captureInfo": {
                    "location": "Can be evolved from Naclstack.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 278,
                "lumioseId": 132,
                "name": "Wingull",
                "type": [
                    "Água",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/278.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 279,
                "lumioseId": 133,
                "name": "Pelipper",
                "type": [
                    "Água",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/279.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 129,
                "lumioseId": 134,
                "name": "Magikarp",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 130,
                "lumioseId": 135,
                "name": "Gyarados",
                "type": [
                    "Água",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
                "captureInfo": {
                    "location": "Can be found in the South Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 846,
                "lumioseId": 136,
                "name": "Arrokuda",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/846.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 847,
                "lumioseId": 137,
                "name": "Barraskewda",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/847.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 550,
                "lumioseId": 138,
                "name": "Basculin",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/550.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 316,
                "lumioseId": 139,
                "name": "Gulpin",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/316.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 317,
                "lumioseId": 140,
                "name": "Swalot",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/317.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 52,
                "lumioseId": 141,
                "name": "Meowth",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 53,
                "lumioseId": 142,
                "name": "Persian",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 425,
                "lumioseId": 143,
                "name": "Drifloon",
                "type": [
                    "Fantasma",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/425.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 426,
                "lumioseId": 144,
                "name": "Drifblim",
                "type": [
                    "Fantasma",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/426.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 669,
                "lumioseId": 145,
                "name": "Flabébé",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/669.png",
                "captureInfo": {
                    "location": "Localização a ser descoberta em Paldea",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 670,
                "lumioseId": 146,
                "name": "Floette",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/670.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 671,
                "lumioseId": 147,
                "name": "Florges",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Three) or evolved from Floette with a Shiny Stone.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 50,
                "lumioseId": 148,
                "name": "Diglett",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 51,
                "lumioseId": 149,
                "name": "Dugtrio",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 324,
                "lumioseId": 150,
                "name": "Torkoal",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/324.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three) and Zapapico.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 322,
                "lumioseId": 151,
                "name": "Numel",
                "type": [
                    "Fogo",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/322.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area One).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 323,
                "lumioseId": 152,
                "name": "Camerupt",
                "type": [
                    "Fogo",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 436,
                "lumioseId": 153,
                "name": "Bronzor",
                "type": [
                    "Aço",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/436.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 437,
                "lumioseId": 154,
                "name": "Bronzong",
                "type": [
                    "Aço",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/437.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 610,
                "lumioseId": 155,
                "name": "Axew",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/610.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 611,
                "lumioseId": 156,
                "name": "Fraxure",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/611.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 612,
                "lumioseId": 157,
                "name": "Haxorus",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/612.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Fraxure.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 56,
                "lumioseId": 158,
                "name": "Mankey",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 57,
                "lumioseId": 159,
                "name": "Primeape",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 979,
                "lumioseId": 160,
                "name": "Annihilape",
                "type": [
                    "Lutador",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/979.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Primeape.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 307,
                "lumioseId": 161,
                "name": "Meditite",
                "type": [
                    "Lutador",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/307.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 308,
                "lumioseId": 162,
                "name": "Medicham",
                "type": [
                    "Lutador",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 447,
                "lumioseId": 163,
                "name": "Riolu",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 448,
                "lumioseId": 164,
                "name": "Lucario",
                "type": [
                    "Lutador",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 935,
                "lumioseId": 165,
                "name": "Charcadet",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/935.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 936,
                "lumioseId": 166,
                "name": "Armarouge",
                "type": [
                    "Fogo",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/936.png",
                "captureInfo": {
                    "location": "Evoluir from Charcadet by giving 10 Bronzor Fragments to the man in Zapapico. (Scarlet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 937,
                "lumioseId": 167,
                "name": "Ceruledge",
                "type": [
                    "Fogo",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/937.png",
                "captureInfo": {
                    "location": "Evoluir from Charcadet by giving 10 Sinistea Chips to the man in Zapapico. (Violet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 339,
                "lumioseId": 168,
                "name": "Barboach",
                "type": [
                    "Água",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/339.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 340,
                "lumioseId": 169,
                "name": "Whiscash",
                "type": [
                    "Água",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/340.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 938,
                "lumioseId": 170,
                "name": "Tadbulb",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/938.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 939,
                "lumioseId": 171,
                "name": "Bellibolt",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/939.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 704,
                "lumioseId": 172,
                "name": "Goomy",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/704.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 705,
                "lumioseId": 173,
                "name": "Sliggoo",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/705.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake or evolved from Goomy.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 706,
                "lumioseId": 174,
                "name": "Goodra",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/706.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Sliggoo in overworld rain or fog.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 453,
                "lumioseId": 175,
                "name": "Croagunk",
                "type": [
                    "Venenoso",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/453.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 454,
                "lumioseId": 176,
                "name": "Toxicroak",
                "type": [
                    "Venenoso",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/454.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 940,
                "lumioseId": 177,
                "name": "Wattrel",
                "type": [
                    "Elétrico",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/940.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 941,
                "lumioseId": 178,
                "name": "Kilowattrel",
                "type": [
                    "Elétrico",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/941.png",
                "captureInfo": {
                    "location": "Can be found in West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 133,
                "lumioseId": 179,
                "name": "Eevee",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 134,
                "lumioseId": 180,
                "name": "Vaporeon",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png",
                "captureInfo": {
                    "location": "Can be evolved from an Eevee with a Water Stone.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 135,
                "lumioseId": 181,
                "name": "Jolteon",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
                "captureInfo": {
                    "location": "Can be evolved from an Eevee with a Pedra do Trovão.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 136,
                "lumioseId": 182,
                "name": "Flareon",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 196,
                "lumioseId": 183,
                "name": "Espeon",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
                "captureInfo": {
                    "location": "Can be evolved from an Eevee with High Friendship in the day without knowing Fairy-type moves.",
                    "method": "Evolução",
                    "time": "Dia",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 197,
                "lumioseId": 184,
                "name": "Umbreon",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png",
                "captureInfo": {
                    "location": "Can be evolved from an Eevee with High Friendship in the night without knowing Fairy-type moves.",
                    "method": "Evolução",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 470,
                "lumioseId": 185,
                "name": "Leafeon",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) and Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 471,
                "lumioseId": 186,
                "name": "Glaceon",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png",
                "captureInfo": {
                    "location": "Can be evolved from an Eevee with an Ice Stone.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 700,
                "lumioseId": 187,
                "name": "Sylveon",
                "type": [
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 206,
                "lumioseId": 188,
                "name": "Dunsparce",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/206.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 982,
                "lumioseId": 189,
                "name": "Dudunsparce",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/982.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Dunsparce after learning Hyper Drill.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 585,
                "lumioseId": 190,
                "name": "Deerling",
                "type": [
                    "Normal",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/585.png",
                "captureInfo": {
                    "location": "Can be found in each Province, with its Winter Form only found on Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 586,
                "lumioseId": 191,
                "name": "Sawsbuck",
                "type": [
                    "Normal",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/586.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 203,
                "lumioseId": 192,
                "name": "Girafarig",
                "type": [
                    "Normal",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/203.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 981,
                "lumioseId": 193,
                "name": "Farigiraf",
                "type": [
                    "Normal",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/981.png",
                "captureInfo": {
                    "location": "Can be evolved from Girafarig after learning Twin Beam.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 88,
                "lumioseId": 194,
                "name": "Grimer",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 89,
                "lumioseId": 195,
                "name": "Muk",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png",
                "captureInfo": {
                    "location": "Can be evolved from Grimer.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 942,
                "lumioseId": 196,
                "name": "Maschiff",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/942.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 943,
                "lumioseId": 197,
                "name": "Mabosstiff",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/943.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 848,
                "lumioseId": 198,
                "name": "Toxel",
                "type": [
                    "Elétrico",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/848.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 849,
                "lumioseId": 199,
                "name": "Toxtricity",
                "type": [
                    "Elétrico",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/849.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 702,
                "lumioseId": 200,
                "name": "Dedenne",
                "type": [
                    "Elétrico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/702.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 417,
                "lumioseId": 201,
                "name": "Pachirisu",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/417.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 944,
                "lumioseId": 202,
                "name": "Shroodle",
                "type": [
                    "Venenoso",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/944.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 945,
                "lumioseId": 203,
                "name": "Grafaiai",
                "type": [
                    "Venenoso",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/945.png",
                "captureInfo": {
                    "location": "Can be found in Tagtree Thicket.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 234,
                "lumioseId": 204,
                "name": "Stantler",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/234.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 590,
                "lumioseId": 205,
                "name": "Foongus",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/590.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 591,
                "lumioseId": 206,
                "name": "Amoonguss",
                "type": [
                    "Grama",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/591.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 100,
                "lumioseId": 207,
                "name": "Voltorb",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 101,
                "lumioseId": 208,
                "name": "Electrode",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 81,
                "lumioseId": 209,
                "name": "Magnemite",
                "type": [
                    "Elétrico",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 82,
                "lumioseId": 210,
                "name": "Magneton",
                "type": [
                    "Elétrico",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png",
                "captureInfo": {
                    "location": "Can be found on Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 462,
                "lumioseId": 211,
                "name": "Magnezone",
                "type": [
                    "Elétrico",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/462.png",
                "captureInfo": {
                    "location": "Can be found circling around the mountains surrounding The Great Crater of Paldea.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 132,
                "lumioseId": 212,
                "name": "Ditto",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 58,
                "lumioseId": 213,
                "name": "Growlithe",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 59,
                "lumioseId": 214,
                "name": "Arcanine",
                "type": [
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 216,
                "lumioseId": 215,
                "name": "Teddiursa",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/216.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 217,
                "lumioseId": 216,
                "name": "Ursaring",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/217.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 335,
                "lumioseId": 217,
                "name": "Zangoose",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/335.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 336,
                "lumioseId": 218,
                "name": "Seviper",
                "type": [
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/336.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 333,
                "lumioseId": 219,
                "name": "Swablu",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/333.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 334,
                "lumioseId": 220,
                "name": "Altaria",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/334.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 672,
                "lumioseId": 221,
                "name": "Skiddo",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/672.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 673,
                "lumioseId": 222,
                "name": "Gogoat",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/673.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 10250,
                "lumioseId": 223,
                "name": "Tauros",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10250.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 667,
                "lumioseId": 224,
                "name": "Litleo",
                "type": [
                    "Fogo",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/667.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 668,
                "lumioseId": 225,
                "name": "Pyroar",
                "type": [
                    "Fogo",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/668.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 434,
                "lumioseId": 226,
                "name": "Stunky",
                "type": [
                    "Venenoso",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/434.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 435,
                "lumioseId": 227,
                "name": "Skuntank",
                "type": [
                    "Venenoso",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/435.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 570,
                "lumioseId": 228,
                "name": "Zorua",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/570.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 571,
                "lumioseId": 229,
                "name": "Zoroark",
                "type": [
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 215,
                "lumioseId": 230,
                "name": "Sneasel",
                "type": [
                    "Sombrio",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 461,
                "lumioseId": 231,
                "name": "Weavile",
                "type": [
                    "Sombrio",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/461.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 198,
                "lumioseId": 232,
                "name": "Murkrow",
                "type": [
                    "Sombrio",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/198.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 430,
                "lumioseId": 233,
                "name": "Honchkrow",
                "type": [
                    "Sombrio",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/430.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places. (Noitetime Only)",
                    "method": "Captura Padrão",
                    "time": "Noite",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 574,
                "lumioseId": 234,
                "name": "Gothita",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/574.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 575,
                "lumioseId": 235,
                "name": "Gothorita",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/575.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 576,
                "lumioseId": 236,
                "name": "Gothitelle",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 854,
                "lumioseId": 237,
                "name": "Sinistea",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/854.png",
                "captureInfo": {
                    "location": "Can be found in the Ruins in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 855,
                "lumioseId": 238,
                "name": "Polteageist",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/855.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Sinistea using a Cracked Pot.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 778,
                "lumioseId": 239,
                "name": "Mimikyu",
                "type": [
                    "Fantasma",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 707,
                "lumioseId": 240,
                "name": "Klefki",
                "type": [
                    "Aço",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/707.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 876,
                "lumioseId": 241,
                "name": "Indeedee",
                "type": [
                    "Psíquico",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/876.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 946,
                "lumioseId": 242,
                "name": "Bramblin",
                "type": [
                    "Grama",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/946.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 947,
                "lumioseId": 243,
                "name": "Brambleghast",
                "type": [
                    "Grama",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/947.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 948,
                "lumioseId": 244,
                "name": "Toedscool",
                "type": [
                    "Terrestre",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/948.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 949,
                "lumioseId": 245,
                "name": "Toedscruel",
                "type": [
                    "Terrestre",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/949.png",
                "captureInfo": {
                    "location": "Can be evolved from Toedscool.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 357,
                "lumioseId": 246,
                "name": "Tropius",
                "type": [
                    "Grama",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 753,
                "lumioseId": 247,
                "name": "Fomantis",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/753.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 754,
                "lumioseId": 248,
                "name": "Lurantis",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/754.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 950,
                "lumioseId": 249,
                "name": "Klawf",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/950.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 951,
                "lumioseId": 250,
                "name": "Capsakid",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/951.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 952,
                "lumioseId": 251,
                "name": "Scovillain",
                "type": [
                    "Grama",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/952.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 331,
                "lumioseId": 252,
                "name": "Cacnea",
                "type": [
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/331.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 332,
                "lumioseId": 253,
                "name": "Cacturne",
                "type": [
                    "Grama",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/332.png",
                "captureInfo": {
                    "location": "Can be encountered in the Asado Desert. Can also be evolved from Cacnea.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 953,
                "lumioseId": 254,
                "name": "Rellor",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/953.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 954,
                "lumioseId": 255,
                "name": "Rabsca",
                "type": [
                    "Inseto",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/954.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Rellor.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 48,
                "lumioseId": 256,
                "name": "Venonat",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/48.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 49,
                "lumioseId": 257,
                "name": "Venomoth",
                "type": [
                    "Inseto",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/49.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 204,
                "lumioseId": 258,
                "name": "Pineco",
                "type": [
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/204.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 205,
                "lumioseId": 259,
                "name": "Forretress",
                "type": [
                    "Inseto",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/205.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 123,
                "lumioseId": 260,
                "name": "Scyther",
                "type": [
                    "Inseto",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 212,
                "lumioseId": 261,
                "name": "Scizor",
                "type": [
                    "Inseto",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Scyther.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 214,
                "lumioseId": 262,
                "name": "Heracross",
                "type": [
                    "Inseto",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 955,
                "lumioseId": 263,
                "name": "Flittle",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/955.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 956,
                "lumioseId": 264,
                "name": "Espathra",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/956.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 449,
                "lumioseId": 265,
                "name": "Hippopotas",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/449.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 450,
                "lumioseId": 266,
                "name": "Hippowdon",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/450.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert. Can also be evolved from Hippopotas.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 551,
                "lumioseId": 267,
                "name": "Sandile",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/551.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 552,
                "lumioseId": 268,
                "name": "Krokorok",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/552.png",
                "captureInfo": {
                    "location": "Can be evolved from Sandile.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 553,
                "lumioseId": 269,
                "name": "Krookodile",
                "type": [
                    "Terrestre",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/553.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Krokorok.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 843,
                "lumioseId": 270,
                "name": "Silicobra",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/843.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 844,
                "lumioseId": 271,
                "name": "Sandaconda",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/844.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Silicobra.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 749,
                "lumioseId": 272,
                "name": "Mudbray",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/749.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 750,
                "lumioseId": 273,
                "name": "Mudsdale",
                "type": [
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/750.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 636,
                "lumioseId": 274,
                "name": "Larvesta",
                "type": [
                    "Inseto",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/636.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 637,
                "lumioseId": 275,
                "name": "Volcarona",
                "type": [
                    "Inseto",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png",
                "captureInfo": {
                    "location": "Can be evolved from Larvesta.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 371,
                "lumioseId": 276,
                "name": "Bagon",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/371.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 372,
                "lumioseId": 277,
                "name": "Shelgon",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/372.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) or evolved from Bagon. (Violet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 373,
                "lumioseId": 278,
                "name": "Salamence",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Shelgon. (Violet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 957,
                "lumioseId": 279,
                "name": "Tinkatink",
                "type": [
                    "Fada",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/957.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 958,
                "lumioseId": 280,
                "name": "Tinkatuff",
                "type": [
                    "Fada",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/958.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 959,
                "lumioseId": 281,
                "name": "Tinkaton",
                "type": [
                    "Fada",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/959.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Tinkatuff.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 856,
                "lumioseId": 282,
                "name": "Hatenna",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/856.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 857,
                "lumioseId": 283,
                "name": "Hattrem",
                "type": [
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/857.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 858,
                "lumioseId": 284,
                "name": "Hatterene",
                "type": [
                    "Psíquico",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Hattrem.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 859,
                "lumioseId": 285,
                "name": "Impidimp",
                "type": [
                    "Sombrio",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/859.png",
                "captureInfo": {
                    "location": "Can be found in Tagtree Thicket.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 860,
                "lumioseId": 286,
                "name": "Morgrem",
                "type": [
                    "Sombrio",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/860.png",
                "captureInfo": {
                    "location": "Can be found in Tagtree Thicket.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 861,
                "lumioseId": 287,
                "name": "Grimmsnarl",
                "type": [
                    "Sombrio",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/861.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Morgrem.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 960,
                "lumioseId": 288,
                "name": "Wiglett",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/960.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 961,
                "lumioseId": 289,
                "name": "Wugtrio",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/961.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 962,
                "lumioseId": 290,
                "name": "Bombirdier",
                "type": [
                    "Voador",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/962.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 963,
                "lumioseId": 291,
                "name": "Finizen",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/963.png",
                "captureInfo": {
                    "location": "Can be found in South Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 964,
                "lumioseId": 292,
                "name": "Palafin",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/964.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Finizen.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 965,
                "lumioseId": 293,
                "name": "Varoom",
                "type": [
                    "Aço",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/965.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 966,
                "lumioseId": 294,
                "name": "Revavroom",
                "type": [
                    "Aço",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/966.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 967,
                "lumioseId": 295,
                "name": "Cyclizar",
                "type": [
                    "Dragão",
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/967.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 968,
                "lumioseId": 296,
                "name": "Orthworm",
                "type": [
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/968.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 302,
                "lumioseId": 297,
                "name": "Sableye",
                "type": [
                    "Sombrio",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/302.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 353,
                "lumioseId": 298,
                "name": "Shuppet",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/353.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 354,
                "lumioseId": 299,
                "name": "Banette",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/354.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 870,
                "lumioseId": 300,
                "name": "Falinks",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/870.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 701,
                "lumioseId": 301,
                "name": "Hawlucha",
                "type": [
                    "Lutador",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/701.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 442,
                "lumioseId": 302,
                "name": "Spiritomb",
                "type": [
                    "Fantasma",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/442.png",
                "captureInfo": {
                    "location": "Can be found on the Northeast side of Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 714,
                "lumioseId": 303,
                "name": "Noibat",
                "type": [
                    "Voador",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/714.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 715,
                "lumioseId": 304,
                "name": "Noivern",
                "type": [
                    "Voador",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/715.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 885,
                "lumioseId": 305,
                "name": "Dreepy",
                "type": [
                    "Dragão",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/885.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 886,
                "lumioseId": 306,
                "name": "Drakloak",
                "type": [
                    "Dragão",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/886.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 887,
                "lumioseId": 307,
                "name": "Dragapult",
                "type": [
                    "Dragão",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Drakloak. (Violet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 969,
                "lumioseId": 308,
                "name": "Glimmet",
                "type": [
                    "Pedra",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/969.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 970,
                "lumioseId": 309,
                "name": "Glimmora",
                "type": [
                    "Pedra",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/970.png",
                "captureInfo": {
                    "location": "Can be evolved from Glimmet.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 479,
                "lumioseId": 310,
                "name": "Rotom",
                "type": [
                    "Elétrico",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 971,
                "lumioseId": 311,
                "name": "Greavard",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/971.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 972,
                "lumioseId": 312,
                "name": "Houndstone",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/972.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 765,
                "lumioseId": 313,
                "name": "Oranguru",
                "type": [
                    "Normal",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/765.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 766,
                "lumioseId": 314,
                "name": "Passimian",
                "type": [
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/766.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 775,
                "lumioseId": 315,
                "name": "Komala",
                "type": [
                    "Normal"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/775.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 246,
                "lumioseId": 316,
                "name": "Larvitar",
                "type": [
                    "Pedra",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Three) among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 247,
                "lumioseId": 317,
                "name": "Pupitar",
                "type": [
                    "Pedra",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) or evolved from Larvitar. (Scarlet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 248,
                "lumioseId": 318,
                "name": "Tyranitar",
                "type": [
                    "Pedra",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from a Pupitar. (Scarlet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 874,
                "lumioseId": 319,
                "name": "Stonjourner",
                "type": [
                    "Pedra"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/874.png",
                "captureInfo": {
                    "location": "Can be found in the Asado Desert. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 875,
                "lumioseId": 320,
                "name": "Eiscue",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/875.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 871,
                "lumioseId": 321,
                "name": "Pincurchin",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/871.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 769,
                "lumioseId": 322,
                "name": "Sandygast",
                "type": [
                    "Fantasma",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/769.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 770,
                "lumioseId": 323,
                "name": "Palossand",
                "type": [
                    "Fantasma",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/770.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 79,
                "lumioseId": 324,
                "name": "Slowpoke",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 80,
                "lumioseId": 325,
                "name": "Slowbro",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 199,
                "lumioseId": 326,
                "name": "Slowking",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Slowpoke via trading with a King's Rock.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 422,
                "lumioseId": 327,
                "name": "Shellos",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/422.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 423,
                "lumioseId": 328,
                "name": "Gastrodon",
                "type": [
                    "Água",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/423.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 90,
                "lumioseId": 329,
                "name": "Shellder",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png",
                "captureInfo": {
                    "location": "Can be found in the South Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 91,
                "lumioseId": 330,
                "name": "Cloyster",
                "type": [
                    "Água",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png",
                "captureInfo": {
                    "location": "Can be found in the West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 211,
                "lumioseId": 331,
                "name": "Qwilfish",
                "type": [
                    "Água",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/211.png",
                "captureInfo": {
                    "location": "Can be found in the South Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 370,
                "lumioseId": 332,
                "name": "Luvdisc",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/370.png",
                "captureInfo": {
                    "location": "Can be found in the South Paldean Sea.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 456,
                "lumioseId": 333,
                "name": "Finneon",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/456.png",
                "captureInfo": {
                    "location": "Can be found in the West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 457,
                "lumioseId": 334,
                "name": "Lumineon",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/457.png",
                "captureInfo": {
                    "location": "Can be found in the West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 779,
                "lumioseId": 335,
                "name": "Bruxish",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/779.png",
                "captureInfo": {
                    "location": "Can be found in West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 594,
                "lumioseId": 336,
                "name": "Alomomola",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/594.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 690,
                "lumioseId": 337,
                "name": "Skrelp",
                "type": [
                    "Venenoso",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/690.png",
                "captureInfo": {
                    "location": "Can be found in South Paldean Sea among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 691,
                "lumioseId": 338,
                "name": "Dragalge",
                "type": [
                    "Venenoso",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/691.png",
                "captureInfo": {
                    "location": "Can be found in North Paldean Sea among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 692,
                "lumioseId": 339,
                "name": "Clauncher",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/692.png",
                "captureInfo": {
                    "location": "Can be found in the West Paldean Sea among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 693,
                "lumioseId": 340,
                "name": "Clawitzer",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/693.png",
                "captureInfo": {
                    "location": "Can be found in the South Paldean Sea among other places. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 602,
                "lumioseId": 341,
                "name": "Tynamo",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/602.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 603,
                "lumioseId": 342,
                "name": "Eelektrik",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/603.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Four) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 604,
                "lumioseId": 343,
                "name": "Eelektross",
                "type": [
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/604.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Eelektrik using a Pedra do Trovão.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 747,
                "lumioseId": 344,
                "name": "Mareanie",
                "type": [
                    "Venenoso",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/747.png",
                "captureInfo": {
                    "location": "Can be found in East Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 748,
                "lumioseId": 345,
                "name": "Toxapex",
                "type": [
                    "Venenoso",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/748.png",
                "captureInfo": {
                    "location": "Regular and Terastal versions can be found along the coast southeast of Levincia.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 973,
                "lumioseId": 346,
                "name": "Flamigo",
                "type": [
                    "Voador",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/973.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 147,
                "lumioseId": 347,
                "name": "Dratini",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 148,
                "lumioseId": 348,
                "name": "Dragonair",
                "type": [
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 149,
                "lumioseId": 349,
                "name": "Dragonite",
                "type": [
                    "Dragão",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
                "captureInfo": {
                    "location": "Can be found flying around North Province (Area Two).",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 872,
                "lumioseId": 350,
                "name": "Snom",
                "type": [
                    "Gelo",
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/872.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 873,
                "lumioseId": 351,
                "name": "Frosmoth",
                "type": [
                    "Gelo",
                    "Inseto"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/873.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 459,
                "lumioseId": 352,
                "name": "Snover",
                "type": [
                    "Grama",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/459.png",
                "captureInfo": {
                    "location": "Can be found on Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 460,
                "lumioseId": 353,
                "name": "Abomasnow",
                "type": [
                    "Grama",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/460.png",
                "captureInfo": {
                    "location": "Can be found in Montenevera.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 225,
                "lumioseId": 354,
                "name": "Delibird",
                "type": [
                    "Gelo",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 613,
                "lumioseId": 355,
                "name": "Cubchoo",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/613.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 614,
                "lumioseId": 356,
                "name": "Beartic",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/614.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 361,
                "lumioseId": 357,
                "name": "Snorunt",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/361.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 362,
                "lumioseId": 358,
                "name": "Glalie",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/362.png",
                "captureInfo": {
                    "location": "Can be found in West Province (Area Three) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 478,
                "lumioseId": 359,
                "name": "Froslass",
                "type": [
                    "Gelo",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png",
                "captureInfo": {
                    "location": "Can be found in Montenevera among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 615,
                "lumioseId": 360,
                "name": "Cryogonal",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/615.png",
                "captureInfo": {
                    "location": "Can be found on Glaseado Mountain.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 974,
                "lumioseId": 361,
                "name": "Cetoddle",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/974.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 975,
                "lumioseId": 362,
                "name": "Cetitan",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/975.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 712,
                "lumioseId": 363,
                "name": "Bergmite",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/712.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 713,
                "lumioseId": 364,
                "name": "Avalugg",
                "type": [
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/713.png",
                "captureInfo": {
                    "location": "Can be found in Glaseado Mountain among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 627,
                "lumioseId": 365,
                "name": "Rufflet",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/627.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 628,
                "lumioseId": 366,
                "name": "Braviary",
                "type": [
                    "Normal",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/628.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 624,
                "lumioseId": 367,
                "name": "Pawniard",
                "type": [
                    "Sombrio",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/624.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Five) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 625,
                "lumioseId": 368,
                "name": "Bisharp",
                "type": [
                    "Sombrio",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/625.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area Two) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 983,
                "lumioseId": 369,
                "name": "Kingambit",
                "type": [
                    "Sombrio",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/983.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Bisharp.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 633,
                "lumioseId": 370,
                "name": "Deino",
                "type": [
                    "Sombrio",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/633.png",
                "captureInfo": {
                    "location": "Can be found in South Province (Area Six) among other places. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 634,
                "lumioseId": 371,
                "name": "Zweilous",
                "type": [
                    "Sombrio",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/634.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places or evolved from Deino. (Scarlet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 635,
                "lumioseId": 372,
                "name": "Hydreigon",
                "type": [
                    "Sombrio",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Zweilous. (Scarlet Only)",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 976,
                "lumioseId": 373,
                "name": "Veluza",
                "type": [
                    "Água",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/976.png",
                "captureInfo": {
                    "location": "Can be found in West Paldean Sea among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 977,
                "lumioseId": 374,
                "name": "Dondozo",
                "type": [
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/977.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 978,
                "lumioseId": 375,
                "name": "Tatsugiri",
                "type": [
                    "Dragão",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/978.png",
                "captureInfo": {
                    "location": "Can be found in Casseroya Lake.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 984,
                "lumioseId": 376,
                "name": "Great Tusk",
                "type": [
                    "Terrestre",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/984.png",
                "captureInfo": {
                    "location": "Can be found in the Research Station 4 cave in Area Zero. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 985,
                "lumioseId": 377,
                "name": "Scream Tail",
                "type": [
                    "Fada",
                    "Psíquico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/985.png",
                "captureInfo": {
                    "location": "Can be found in all zones in Area Zero. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 986,
                "lumioseId": 378,
                "name": "Brute Bonnet",
                "type": [
                    "Grama",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/986.png",
                "captureInfo": {
                    "location": "Can be found in all zones in Area Zero, especially near the second observatory and inside caves. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 987,
                "lumioseId": 379,
                "name": "Flutter Mane",
                "type": [
                    "Fantasma",
                    "Fada"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/987.png",
                "captureInfo": {
                    "location": "Can be found often in small and large caves in Area Zero including the caves near Research Station 4. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 988,
                "lumioseId": 380,
                "name": "Slither Wing",
                "type": [
                    "Inseto",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/988.png",
                "captureInfo": {
                    "location": "Can be found in most places between Research Station 1 & 3 including the cliffs above Research Station 1 in Area Zero. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 989,
                "lumioseId": 381,
                "name": "Sandy Shocks",
                "type": [
                    "Elétrico",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/989.png",
                "captureInfo": {
                    "location": "Can be found around the cliffs and grassy areas near Research Station 2 in Area Zero. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 990,
                "lumioseId": 382,
                "name": "Iron Treads",
                "type": [
                    "Terrestre",
                    "Aço"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/990.png",
                "captureInfo": {
                    "location": "Can be found in caves in Area Zero including the Research Station 4 cave. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 991,
                "lumioseId": 383,
                "name": "Iron Bundle",
                "type": [
                    "Gelo",
                    "Água"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/991.png",
                "captureInfo": {
                    "location": "Can be found in all zones of Area Zero. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 992,
                "lumioseId": 384,
                "name": "Iron Hands",
                "type": [
                    "Lutador",
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/992.png",
                "captureInfo": {
                    "location": "Can be found in the cliff zones of Area Zero around Research Stations 1, 2 and 3. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 993,
                "lumioseId": 385,
                "name": "Iron Jugulis",
                "type": [
                    "Sombrio",
                    "Voador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/993.png",
                "captureInfo": {
                    "location": "Can be found in caves in Area Zero including the Research Station 4 cave. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 994,
                "lumioseId": 386,
                "name": "Iron Moth",
                "type": [
                    "Fogo",
                    "Venenoso"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/994.png",
                "captureInfo": {
                    "location": "Can be found in the First Research Area of Area Zero. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 995,
                "lumioseId": 387,
                "name": "Iron Thorns",
                "type": [
                    "Pedra",
                    "Elétrico"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/995.png",
                "captureInfo": {
                    "location": "Can be found in the cliff zones of Area Zero around Research Stations 1, 2 and 3. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 996,
                "lumioseId": 388,
                "name": "Frigibax",
                "type": [
                    "Dragão",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/996.png",
                "captureInfo": {
                    "location": "Can be found in the Glaseado Mountains.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 997,
                "lumioseId": 389,
                "name": "Arctibax",
                "type": [
                    "Dragão",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/997.png",
                "captureInfo": {
                    "location": "Can be found in North Province (Area One) among other places.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 998,
                "lumioseId": 390,
                "name": "Baxcalibur",
                "type": [
                    "Dragão",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/998.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Arctibax.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 999,
                "lumioseId": 391,
                "name": "Gimmighoul",
                "type": [
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/999.png",
                "captureInfo": {
                    "location": "Can be found on top of the Watchtowers around Paldea.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1000,
                "lumioseId": 392,
                "name": "Gholdengo",
                "type": [
                    "Aço",
                    "Fantasma"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png",
                "captureInfo": {
                    "location": "Not known to be found in the wild. Can be evolved from Gimmighoul.",
                    "method": "Evolução",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1001,
                "lumioseId": 393,
                "name": "Wo-Chien",
                "type": [
                    "Sombrio",
                    "Grama"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1001.png",
                "captureInfo": {
                    "location": "Collect all 8 Purple Stakes in the Eastern side of South Paldea to access the Shrine where Wo-Chien can be found.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1002,
                "lumioseId": 394,
                "name": "Chien-Pao",
                "type": [
                    "Sombrio",
                    "Gelo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1002.png",
                "captureInfo": {
                    "location": "Collect all 8 Yellow Stakes in the Western side of South Paldea to access the Shrine where Chien-Pao can be found.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1003,
                "lumioseId": 395,
                "name": "Ting-Lu",
                "type": [
                    "Sombrio",
                    "Terrestre"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1003.png",
                "captureInfo": {
                    "location": "Collect all 8 Green Stakes in Casseroya Lake to access the Shrine where Ting-Lu can be found.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1004,
                "lumioseId": 396,
                "name": "Chi-Yu",
                "type": [
                    "Sombrio",
                    "Fogo"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1004.png",
                "captureInfo": {
                    "location": "Collect all 8 Blue Stakes in Northeast Paldea to access the Shrine where Chi-Yu can be found.",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1005,
                "lumioseId": 397,
                "name": "Roaring Moon",
                "type": [
                    "Dragão",
                    "Sombrio"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1005.png",
                "captureInfo": {
                    "location": "Can only be encountered in the Hidden Cave between Research Station 2 & 3 in Area Zero. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1006,
                "lumioseId": 398,
                "name": "Iron Valiant",
                "type": [
                    "Fada",
                    "Lutador"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1006.png",
                "captureInfo": {
                    "location": "Can only be encountered in the Hidden Cave between Research Station 2 & 3 in Area Zero. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1007,
                "lumioseId": 399,
                "name": "Koraidon",
                "type": [
                    "Lutador",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png",
                "captureInfo": {
                    "location": "Obtained as a mount near Poco Path Lighthouse, and can be caught in Area Zero after completing the game. (Scarlet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },
            {
                "id": 1008,
                "lumioseId": 400,
                "name": "Miraidon",
                "type": [
                    "Elétrico",
                    "Dragão"
                ],
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png",
                "captureInfo": {
                    "location": "Obtained as a mount near Poco Path Lighthouse, and can be caught in Area Zero after completing the game. (Violet Only)",
                    "method": "Captura Padrão",
                    "time": "Qualquer",
                    "weather": "Qualquer",
                    "notes": "Verifique o mapa interativo."
                }
            },

        ]
    }
];

const typeChart = {
    "Normal": { weak: ["Lutador"], resist: [], immune: ["Fantasma"] },
    "Fogo": { weak: ["Água", "Terrestre", "Pedra"], resist: ["Fogo", "Grama", "Gelo", "Inseto", "Aço", "Fada"], immune: [] },
    "Água": { weak: ["Elétrico", "Grama"], resist: ["Fogo", "Água", "Gelo", "Aço"], immune: [] },
    "Grama": { weak: ["Fogo", "Gelo", "Venenoso", "Voador", "Inseto"], resist: ["Água", "Elétrico", "Grama", "Terrestre"], immune: [] },
    "Elétrico": { weak: ["Terrestre"], resist: ["Elétrico", "Voador", "Aço"], immune: [] },
    "Gelo": { weak: ["Fogo", "Lutador", "Pedra", "Aço"], resist: ["Gelo"], immune: [] },
    "Lutador": { weak: ["Voador", "Psíquico", "Fada"], resist: ["Inseto", "Pedra", "Sombrio"], immune: [] },
    "Venenoso": { weak: ["Terrestre", "Psíquico"], resist: ["Grama", "Lutador", "Venenoso", "Inseto", "Fada"], immune: [] },
    "Terrestre": { weak: ["Água", "Grama", "Gelo"], resist: ["Venenoso", "Pedra"], immune: ["Elétrico"] },
    "Voador": { weak: ["Elétrico", "Gelo", "Pedra"], resist: ["Grama", "Lutador", "Inseto"], immune: ["Terrestre"] },
    "Psíquico": { weak: ["Inseto", "Fantasma", "Sombrio"], resist: ["Lutador", "Psíquico"], immune: [] },
    "Inseto": { weak: ["Fogo", "Voador", "Pedra"], resist: ["Grama", "Lutador", "Terrestre"], immune: [] },
    "Pedra": { weak: ["Água", "Grama", "Lutador", "Terrestre", "Aço"], resist: ["Normal", "Fogo", "Venenoso", "Voador"], immune: [] },
    "Fantasma": { weak: ["Fantasma", "Sombrio"], resist: ["Venenoso", "Inseto"], immune: ["Normal", "Lutador"] },
    "Dragão": { weak: ["Gelo", "Dragão", "Fada"], resist: ["Fogo", "Água", "Elétrico", "Grama"], immune: [] },
    "Aço": { weak: ["Fogo", "Lutador", "Terrestre"], resist: ["Normal", "Grama", "Gelo", "Voador", "Psíquico", "Inseto", "Pedra", "Dragão", "Aço", "Fada"], immune: ["Venenoso"] },
    "Sombrio": { weak: ["Lutador", "Inseto", "Fada"], resist: ["Fantasma", "Sombrio"], immune: ["Psíquico"] },
    "Fada": { weak: ["Venenoso", "Aço"], resist: ["Lutador", "Inseto", "Sombrio"], immune: ["Dragão"] }
};

const typeColors = {
    "Normal": "var(--type-normal)", "Fogo": "var(--type-fire)", "Água": "var(--type-water)", "Grama": "var(--type-grass)",
    "Elétrico": "var(--type-electric)", "Gelo": "var(--type-ice)", "Lutador": "var(--type-fighting)", "Venenoso": "var(--type-poison)",
    "Terrestre": "var(--type-ground)", "Voador": "var(--type-flying)", "Psíquico": "var(--type-psychic)", "Inseto": "var(--type-bug)",
    "Pedra": "var(--type-rock)", "Fantasma": "var(--type-ghost)", "Dragão": "var(--type-dragon)", "Aço": "var(--type-steel)",
    "Sombrio": "var(--type-dark)", "Fada": "var(--type-fairy)"
};

// DATA Persistence via LocalStorage
function loadUserData(gameId) {
    try {
        const savedData = localStorage.getItem(`livingDex_${gameId}`);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (e) {
        console.error("Error loading from localStorage", e);
    }
    return null;
}

function saveUserData(gameId, capturedData, teamData) {
    try {
        const dataToSave = {
            captured_data: capturedData,
            team_data: teamData,
            updated_at: new Date()
        };
        
        // If logged in, save ONLY to cloud and do NOT overwrite guest local storage
        if (currentState.user) {
            saveUserDataToSupabase(gameId, capturedData, teamData);
        } else {
            // Guest mode: Save to local storage
            localStorage.setItem(`livingDex_${gameId}`, JSON.stringify(dataToSave));
        }

        
        return { data: dataToSave, error: null };
    } catch (e) {
        console.error("Error saving to localStorage", e);
        return { data: null, error: e };
    }
}

// MAIN APP LOGIC
// ... (Rest of script.js logic follows)

// State
let currentState = {
    selectedGameId: games[0].id,
    selectedPokemonId: null,
    filterMode: 'all', // 'all', 'uncaptured', 'captured'
    filterType: 'all', // 'all' or specific type
    searchTerm: '',
    capturedData: {}, // Loaded from LocalStorage
    teamData: {}, // Loaded from LocalStorage
    currentView: 'dex', // 'dex', 'team'
    selectedSlotIndex: null, // Track which slot we are filling
    selectedTeamProfile: 0 // Default profile 0 (Equipe 1)
};

// DOM Elements
const gameSelect = document.getElementById('game-select');
const teamProfileSelect = document.getElementById('team-profile-select');
const pokemonListEl = document.getElementById('pokemon-list');
const searchInput = document.getElementById('search-input');
const filterTypeSelect = document.getElementById('filter-type');
const filterUncapturedBtn = document.getElementById('filter-uncaptured');
const filterCapturedBtn = document.getElementById('filter-captured');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

// View Elements
const viewDex = document.getElementById('view-dex');
const viewTeam = document.getElementById('view-team');
const tabDex = document.getElementById('tab-dex');
const tabTeam = document.getElementById('tab-team');

// Team Builder Elements
const teamSlotsLarge = document.getElementById('team-slots-large');
const analysisGrid = document.getElementById('analysis-grid');

// Modal Elements
const modal = document.getElementById('pokemon-selector-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const selectorSearch = document.getElementById('selector-search');
const selectorTypeFilter = document.getElementById('selector-type-filter');
const selectorList = document.getElementById('selector-list');

// Details Elements
const emptyState = document.getElementById('empty-state');
const detailContent = document.getElementById('pokemon-detail-content');
const detailName = document.getElementById('detail-name');
const detailId = document.getElementById('detail-id');
const detailImage = document.getElementById('detail-image');
const detailTypes = document.getElementById('detail-types');
const detailLocation = document.getElementById('detail-location');
const detailTime = document.getElementById('detail-time');
const detailWeather = document.getElementById('detail-weather');
const detailMethod = document.getElementById('detail-method');

const detailCheckbox = document.getElementById('detail-checkbox');
const captureStatusContainer = document.getElementById('capture-status-container');
const evolutionContainer = document.getElementById('evolution-container');
const preEvolutionLink = document.getElementById('pre-evolution-link');
const mapContainer = document.getElementById('map-container');
const mapLink = document.getElementById('map-link');
const staticMapPreview = document.getElementById('static-map-preview');
const addToTeamBtn = document.getElementById('add-to-team-btn');
const infoGrid = document.getElementById('info-grid');

// Initialize
function init() {
    // Populate Game Select
    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;
        option.textContent = game.name;
        
        // Beta highlight for Scarlet & Violet
        if (game.id === 'scarlet-violet') {
            option.textContent = `${game.name} (Beta 🚧)`;
            option.style.color = '#ff9f43'; // Orange highlight
            option.style.fontWeight = 'bold';
        }

        gameSelect.appendChild(option);
    });

    // Event Listeners
    gameSelect.addEventListener('change', (e) => {
        currentState.selectedGameId = e.target.value;
        currentState.selectedPokemonId = null; // Reset selection
        loadData(); // Reload data for new game
    });

    // Populate Type Filter
    // Ensure element exists before using it
    if (filterTypeSelect) {
        const types = Object.keys(typeChart).sort();
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterTypeSelect.appendChild(option);
        });

        filterTypeSelect.addEventListener('change', (e) => {
            currentState.filterType = e.target.value;
            renderList();
        });
    }

    if (teamProfileSelect) {
        teamProfileSelect.addEventListener('change', (e) => {
            currentState.selectedTeamProfile = parseInt(e.target.value);
            renderTeamBuilder();
        });
    }

    if (selectorTypeFilter) {
        // Also populate modal filter
        const types = Object.keys(typeChart).sort();
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            selectorTypeFilter.appendChild(option);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentState.searchTerm = e.target.value.toLowerCase();
            renderList();
        });
    }

    if (filterUncapturedBtn) {
        filterUncapturedBtn.addEventListener('click', () => {
            if (currentState.filterMode === 'uncaptured') {
                currentState.filterMode = 'all';
                filterUncapturedBtn.classList.remove('active');
            } else {
                currentState.filterMode = 'uncaptured';
                filterUncapturedBtn.classList.add('active');
                if (filterCapturedBtn) filterCapturedBtn.classList.remove('active');
            }
            renderList();
        });
    }

    if (filterCapturedBtn) {
        filterCapturedBtn.addEventListener('click', () => {
            if (currentState.filterMode === 'captured') {
                currentState.filterMode = 'all';
                filterCapturedBtn.classList.remove('active');
            } else {
                currentState.filterMode = 'captured';
                filterCapturedBtn.classList.add('active');
                if (filterUncapturedBtn) filterUncapturedBtn.classList.remove('active');
            }
            renderList();
        });
    }

    if (detailCheckbox) {
        detailCheckbox.addEventListener('change', (e) => {
            if (currentState.selectedPokemonId) {
                toggleCapture(currentState.selectedPokemonId, e.target.checked);
            }
        });
    }

    if (addToTeamBtn) {
        addToTeamBtn.addEventListener('click', () => {
            if (currentState.selectedPokemonId) {
                addToTeam(currentState.selectedPokemonId);
            }
        });
    }

    // Tab Switching
    if (tabDex) tabDex.addEventListener('click', () => switchView('dex'));
    if (tabTeam) tabTeam.addEventListener('click', () => switchView('team'));

    // Modal Listeners
    if (closeModalBtn) closeModalBtn.addEventListener('click', closePokemonSelector);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closePokemonSelector();
        });
    }
    
    if (selectorSearch) {
        selectorSearch.addEventListener('input', (e) => {
            renderSelectorList(e.target.value);
        });
    }

    if (selectorTypeFilter) {
        selectorTypeFilter.addEventListener('change', () => {
            renderSelectorList(selectorSearch.value);
        });
    }

    // Initialize Supabase with retry limit
    // Wait for DOMContentLoaded to ensure window.supabase is available if loaded async
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initSupabase());
    } else {
        initSupabase();
    }
    
    initAuthScreen(); 
    
    // We don't call loadData() immediately here anymore.
    // checkInitialSession() inside initSupabase will handle the flow.
}

// Initialize Supabase with retry limit
let supabaseInitAttempts = 0;
const MAX_SUPABASE_ATTEMPTS = 50; // Increased attempts

function initSupabase() {
    if (supabaseClient) return; // Already initialized
    
    if (window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            // console.log("Supabase initialized");
            setupAuthListener();
            checkInitialSession();
        } catch (e) {
            console.error("Supabase init error:", e);
        }
    } else {
        // Retry if library not loaded yet
        supabaseInitAttempts++;
        if (supabaseInitAttempts < MAX_SUPABASE_ATTEMPTS) {
            setTimeout(initSupabase, 200);
        } else {
            console.error("Failed to load Supabase library after multiple attempts.");
            // Don't show toast immediately on load to avoid annoyance, only if user tries to login
        }
    }
}

// Function to move to global scope or make sure it's accessible before initSupabase calls it
// Actually loadData is defined below, but JS hoisting for function declarations should work.
// However, if loadData is inside another block or not hoisted properly in this context (e.g. if script type=module), it might fail.
// Given the error "loadData is not defined", it seems it's not accessible.

// Moving loadData definition up or ensuring it's global if it was inside something else.
// But looking at the file structure, loadData seems to be defined later.
// Let's make sure loadData is defined before it's called or attached to window if needed.

// ... (rest of code) ...

const loginScreen = document.getElementById('login-screen');
const appView = document.getElementById('app-view');

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

const formLogin = document.getElementById('auth-login-form');
const formRegister = document.getElementById('auth-register-form');
const formForgot = document.getElementById('auth-forgot-form');

const linkForgotPass = document.getElementById('link-forgot-pass');
const linkBackLogin = document.getElementById('link-back-login');

const btnLogout = document.getElementById('btn-logout');

function initAuthScreen() {
    // Tabs
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => switchAuthTab('login'));
        tabRegister.addEventListener('click', () => switchAuthTab('register'));
    }

    // Links
    if (linkForgotPass) linkForgotPass.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotForm();
    });

    if (linkBackLogin) linkBackLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab('login');
    });

    // Forms
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const msg = document.getElementById('login-message');
            const btn = document.getElementById('btn-submit-login');
            
            setLoading(btn, true, 'Entrando...');
            msg.textContent = '';
            msg.className = 'auth-message';

            const { data, error } = await signIn(email, password);
            
            setLoading(btn, false, 'Entrar');

            if (error) {
                msg.textContent = error.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : error.message;
                msg.classList.add('error');
            } else {
                // Success is handled by auth listener
            }
        });
    }

    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            const msg = document.getElementById('register-message');
            const btn = document.getElementById('btn-submit-register');

            msg.textContent = '';
            msg.className = 'auth-message';

            if (password !== confirm) {
                msg.textContent = 'As senhas não coincidem.';
                msg.classList.add('error');
                return;
            }
            
            setLoading(btn, true, 'Criando...');

            const { data, error } = await signUp(email, password);
            
            setLoading(btn, false, 'Criar Conta');

            if (error) {
                msg.textContent = error.message;
                msg.classList.add('error');
            } else {
                // If auto-confirm is enabled, data.user will be present and confirmed_at might be null or not
                // But usually session is established if auto-confirm is on.
                if (data.session) {
                    msg.textContent = 'Conta criada com sucesso! Entrando...';
                    msg.classList.add('success');
                    // Auth listener will handle redirect
                } else {
                    msg.textContent = 'Conta criada! Verifique seu email para confirmar.';
                    msg.classList.add('success');
                    // Optional: switch to login
                    setTimeout(() => switchAuthTab('login'), 2000);
                }
            }
        });
    }

    if (formForgot) {
        formForgot.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            const msg = document.getElementById('forgot-message');
            const btn = document.getElementById('btn-submit-forgot');
            
            setLoading(btn, true, 'Enviando...');
            msg.textContent = '';
            msg.className = 'auth-message';

            const { data, error } = await resetPassword(email);
            
            setLoading(btn, false, 'Recuperar Senha');

            if (error) {
                msg.textContent = error.message;
                msg.classList.add('error');
            } else {
                msg.textContent = 'Email de recuperação enviado!';
                msg.classList.add('success');
                setTimeout(() => switchAuthTab('login'), 3000);
            }
        });
    }

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm("Deseja sair da sua conta?")) {
                signOut();
            }
        });
    }
} // End of initAuthScreen

function switchAuthTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
        formForgot.classList.add('hidden');
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.classList.add('hidden');
        formRegister.classList.remove('hidden');
        formForgot.classList.add('hidden');
    }
}

function showForgotForm() {
    formLogin.classList.add('hidden');
    formRegister.classList.add('hidden');
    formForgot.classList.remove('hidden');
}

function setLoading(btn, isLoading, text) {
    const span = btn.querySelector('.btn-text');
    btn.disabled = isLoading;
    if (span) span.textContent = text;
    
    // Add spinner if needed, for now text change is enough
    if (isLoading) {
        btn.style.opacity = '0.7';
        btn.style.cursor = 'wait';
    } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

function updateAuthUI(isLoggedIn) {
    if (isLoggedIn) {
        loginScreen.classList.add('hidden');
        appView.classList.remove('hidden');
        // Trigger resize event to fix any layout issues after showing hidden content
        window.dispatchEvent(new Event('resize'));
    } else {
        loginScreen.classList.remove('hidden');
        appView.classList.add('hidden');
    }
}

// Function to load data (moved up for scope visibility)
async function loadData() {
    // 1. Load Local Data (Fast)
    let localData = loadUserData(currentState.selectedGameId);
    
    // Reset state to avoid data bleeding between users
    currentState.capturedData = {};
    currentState.teamData = {};
    currentState.selectedTeamProfile = 0;
    if (teamProfileSelect) teamProfileSelect.value = 0;

    // 2. If User Logged In, Load Cloud Data
    if (currentState.user) {
        const cloudData = await loadUserDataFromSupabase(currentState.selectedGameId);
        
        if (cloudData) {
            // console.log("Cloud data found:", cloudData);
            if (cloudData.captured_data) currentState.capturedData = cloudData.captured_data;
            if (cloudData.team_data) currentState.teamData = cloudData.team_data;
        } else {
            // No cloud data yet, but we have local data. Upload local data to cloud?
            if (localData) {
                // console.log("Uploading local data to cloud...");
                // Restore local data to state first so we can see it
                currentState.capturedData = localData.captured_data || {};
                currentState.teamData = localData.team_data || {};
                
                saveUserDataToSupabase(currentState.selectedGameId, localData.captured_data, localData.team_data);
            }
        }
    } else {
        // Not logged in, use local data
        if (localData) {
            currentState.capturedData = localData.captured_data || {};
            currentState.teamData = localData.team_data || {};
        }
    }
    
    // Fallback inits
    if (!currentState.capturedData) currentState.capturedData = {};
    if (!currentState.teamData) currentState.teamData = {};

    if (!currentState.capturedData[currentState.selectedGameId]) currentState.capturedData[currentState.selectedGameId] = [];
    
    // Check if team data is in new format (array of arrays) or old format (single array)
    let currentTeamData = currentState.teamData[currentState.selectedGameId];
    
    if (!currentTeamData) {
        // Init 5 empty profiles
        currentState.teamData[currentState.selectedGameId] = [
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null]
        ];
    } else if (Array.isArray(currentTeamData) && currentTeamData.length === 6 && !Array.isArray(currentTeamData[0])) {
        // Migration: Old format (single array of 6 slots) -> New format (array of profiles)
        console.log("Migrating team data to profiles...");
        currentState.teamData[currentState.selectedGameId] = [
            currentTeamData, // Profile 1 gets the old data
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null]
        ];
    } else if (Array.isArray(currentTeamData) && currentTeamData.length < 5) {
        // Ensure we have 5 profiles if structure exists but is partial
        while (currentState.teamData[currentState.selectedGameId].length < 5) {
            currentState.teamData[currentState.selectedGameId].push([null,null,null,null,null,null]);
        }
    }

    render();
}

function setupAuthListener() {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        // console.log("Auth State Change:", event, session);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            currentState.user = session.user;
            updateAuthUI(true);
            loadData(); // Reload data from Supabase
            showToast("Conectado com sucesso!", "success");
        } else if (event === 'SIGNED_OUT') {
            currentState.user = null;
            updateAuthUI(false);
            
            // Clear local storage robustly (all keys related to app)
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('livingDex_')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear local data view or switch to local storage mode
            loadData(); // Revert to local storage data (which is now empty)
            showToast("Desconectado.", "info");
        }
    });
}

// Initial Session Check override
async function checkInitialSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
        // Logged in
        currentState.user = data.session.user;
        updateAuthUI(true);
        loadData();
    } else {
        // Not logged in
        updateAuthUI(false);
        // We do NOT load data here, waiting for login
    }
}

function switchView(view) {
    currentState.currentView = view;
    
    if (view === 'dex') {
        viewDex.classList.remove('hidden');
        viewTeam.classList.add('hidden');
        tabDex.classList.add('active');
        tabTeam.classList.remove('active');
    } else {
        viewDex.classList.add('hidden');
        viewTeam.classList.remove('hidden');
        tabDex.classList.remove('active');
        tabTeam.classList.add('active');
        renderTeamBuilder();
    }
}

function getTeam() {
    const gameData = currentState.teamData[currentState.selectedGameId];
    
    // Safety check if data is corrupted or old format somehow not caught
    if (!gameData || !Array.isArray(gameData) || (gameData.length > 0 && !Array.isArray(gameData[0]))) {
        // Force reset/init if bad state
        currentState.teamData[currentState.selectedGameId] = [
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null],
            [null,null,null,null,null,null]
        ];
    }
    
    // Ensure index is valid
    if (currentState.selectedTeamProfile < 0 || currentState.selectedTeamProfile >= 5) {
        currentState.selectedTeamProfile = 0;
    }

    return currentState.teamData[currentState.selectedGameId][currentState.selectedTeamProfile];
}

function addToTeam(pokemonId, slotIndex = null) {
    const team = getTeam();
    
    // Check if already in team (unless we are replacing the same slot, which is weird but ok)
    if (team.includes(pokemonId)) {
        // Allow if we are just "moving" or re-selecting, but for now simple block
        alert("Este Pokémon já está na sua equipe!");
        return;
    }

    let targetIndex = slotIndex;

    // If no specific slot, find first empty
    if (targetIndex === null) {
        targetIndex = team.findIndex(slot => slot === null);
        if (targetIndex === -1) {
            alert("Sua equipe está cheia! Remova um Pokémon antes de adicionar outro.");
            return;
        }
    }

    team[targetIndex] = pokemonId;
    saveTeamData();
    renderTeamBuilder(); // Force update of team view
    
    // Feedback
    if (slotIndex !== null) {
        closePokemonSelector(); // Close modal if used
    } else {
        alert("Pokémon adicionado à equipe!");
    }
}

function openPokemonSelector(index) {
    currentState.selectedSlotIndex = index;
    selectorSearch.value = '';
    
    // Populate type filter in modal if empty
    if (selectorTypeFilter.children.length <= 1) {
        const types = Object.keys(typeChart).sort();
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            selectorTypeFilter.appendChild(option);
        });
    }
    selectorTypeFilter.value = 'all';

    renderSelectorList();
    modal.classList.remove('hidden');
    selectorSearch.focus();
}

function closePokemonSelector() {
    modal.classList.add('hidden');
    currentState.selectedSlotIndex = null;
}

function renderSelectorList(searchTerm = '') {
    const gameData = getCurrentGameData();
    selectorList.innerHTML = '';
    
    const term = searchTerm.toLowerCase();
    const typeFilter = selectorTypeFilter.value;
    
    const filtered = gameData.pokemonList.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(term) || p.lumioseId.toString().includes(term);
        const matchesType = typeFilter === 'all' || p.type.includes(typeFilter);
        return matchesSearch && matchesType;
    });

    if (filtered.length === 0) {
        selectorList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum Pokémon encontrado.</div>';
        return;
    }

    filtered.forEach(p => {
        const item = document.createElement('div');
        item.className = 'selector-item';
        item.onclick = () => addToTeam(p.id, currentState.selectedSlotIndex);
        
        item.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="selector-info">
                <span class="selector-name">#${String(p.lumioseId).padStart(3, '0')} ${p.name}</span>
                <div class="selector-types">
                    ${p.type.map(t => `<span class="selector-type" style="background: var(--type-${mapTypeToCss(t)})">${t}</span>`).join('')}
                </div>
            </div>
            <i class="fa-solid fa-plus" style="color: var(--accent-color);"></i>
        `;
        selectorList.appendChild(item);
    });
}

function removeFromTeam(index) {
    const team = getTeam();
    team[index] = null;
    saveTeamData();
    renderTeamBuilder();
}

function saveTeamData() {
    saveUserData(currentState.selectedGameId, currentState.capturedData, currentState.teamData);
}

function renderTeamBuilder() {
    const team = getTeam();
    const gameData = getCurrentGameData();
    
    // Render Slots
    teamSlotsLarge.innerHTML = '';
    team.forEach((pokemonId, index) => {
        const slot = document.createElement('div');
        slot.className = `team-slot-large ${pokemonId ? 'filled' : ''}`;
        
        if (pokemonId) {
            const pokemon = gameData.pokemonList.find(p => p.id === pokemonId);
            if (pokemon) {
                slot.innerHTML = `
                    <div class="slot-image">
                        <img src="${pokemon.image}" alt="${pokemon.name}">
                    </div>
                    <div class="slot-info">
                        <span class="slot-name">${pokemon.name}</span>
                        <div class="slot-types">
                            ${pokemon.type.map(t => `<span class="mini-type" style="background: ${getComputedStyle(document.documentElement).getPropertyValue('--type-' + mapTypeToCss(t))}"></span>`).join('')}
                        </div>
                    </div>
                    <button class="remove-btn-large" title="Remover"><i class="fa-solid fa-times"></i></button>
                `;
                slot.querySelector('.remove-btn-large').onclick = () => removeFromTeam(index);
            }
        } else {
            slot.innerHTML = `
                <div class="slot-empty-state">
                    <i class="fa-solid fa-plus"></i>
                    <span>Vazio</span>
                </div>
            `;
            slot.onclick = () => openPokemonSelector(index);
            slot.style.cursor = 'pointer';
        }
        teamSlotsLarge.appendChild(slot);
    });

    // Render Analysis
    renderAnalysis(team, gameData);
}

function mapTypeToCss(type) {
    const typeMap = {
        'Normal': 'normal', 'Fogo': 'fire', 'Água': 'water', 'Grama': 'grass',
        'Elétrico': 'electric', 'Gelo': 'ice', 'Lutador': 'fighting', 'Venenoso': 'poison',
        'Terrestre': 'ground', 'Voador': 'flying', 'Psíquico': 'psychic', 'Inseto': 'bug',
        'Pedra': 'rock', 'Fantasma': 'ghost', 'Dragão': 'dragon', 'Aço': 'steel',
        'Fada': 'fairy', 'Sombrio': 'dark'
    };
    return typeMap[type] || 'normal';
}

function renderAnalysis(team, gameData) {
    const analysis = calculateTeamDefense(team, gameData);
    const types = Object.keys(typeChart).sort();

    analysisGrid.innerHTML = '';

    types.forEach(type => {
        const row = document.createElement('div');
        row.className = 'analysis-row';
        
        // Type Label
        const label = document.createElement('div');
        label.className = 'analysis-label';
        label.textContent = type;
        label.style.backgroundColor = `var(--type-${mapTypeToCss(type)})`;
        
        // Tally Container
        const tally = document.createElement('div');
        tally.className = 'analysis-tally';

        const data = analysis[type];
        
        // Weaknesses (Red)
        for(let i=0; i<data.weak; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot weak';
            tally.appendChild(dot);
        }

        // Resistances (Blue/Green - using 'resist' class)
        for(let i=0; i<data.resist; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot resist';
            tally.appendChild(dot);
        }

        // Immunities (Outline/Grey - using 'immune' class)
        for(let i=0; i<data.immune; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot immune';
            tally.appendChild(dot);
        }

        // Neutrals (Optional: invisible or small dot)
        // We only show significant matchups as per user request (weak/resist)

        row.appendChild(label);
        row.appendChild(tally);
        analysisGrid.appendChild(row);
    });
}

function calculateTeamDefense(team, gameData) {
    const result = {};
    const types = Object.keys(typeChart);

    // Initialize result
    types.forEach(t => {
        result[t] = { weak: 0, resist: 0, immune: 0, neutral: 0 };
    });

    team.forEach(pokemonId => {
        if (!pokemonId) return;
        const pokemon = gameData.pokemonList.find(p => p.id === pokemonId);
        if (!pokemon) return;

        types.forEach(attackType => {
            let multiplier = 1;
            
            pokemon.type.forEach(defendType => {
                const chart = typeChart[defendType];
                if (!chart) {
                    console.warn(`Type chart not found for type: ${defendType} (Pokemon: ${pokemon.name})`);
                    return;
                }
                if (chart.weak.includes(attackType)) multiplier *= 2;
                if (chart.resist.includes(attackType)) multiplier *= 0.5;
                if (chart.immune.includes(attackType)) multiplier *= 0;
            });

            if (multiplier > 1) result[attackType].weak++;
            else if (multiplier === 0) result[attackType].immune++;
            else if (multiplier < 1) result[attackType].resist++;
            else result[attackType].neutral++;
        });
    });

    return result;
}

function getCurrentGameData() {
    return games.find(g => g.id === currentState.selectedGameId);
}

function getCapturedList() {
    if (!currentState.capturedData[currentState.selectedGameId]) {
        currentState.capturedData[currentState.selectedGameId] = [];
    }
    return currentState.capturedData[currentState.selectedGameId];
}

function toggleCapture(pokemonId, isCaptured) {
    const list = getCapturedList();
    const index = list.indexOf(pokemonId);

    if (isCaptured && index === -1) {
        list.push(pokemonId);
    } else if (!isCaptured && index > -1) {
        list.splice(index, 1);
    }

    saveData();
    updateProgress();
    renderDetails(); // Re-render details to update style
    renderList(); 
}

function saveData() {
    saveUserData(currentState.selectedGameId, currentState.capturedData, currentState.teamData);
}

function render() {
    renderList();
    renderDetails();
    updateProgress();
    
    // Ensure team builder is updated if visible
    if (currentState.currentView === 'team') {
        renderTeamBuilder();
    }
}

function renderList() {
    const gameData = getCurrentGameData();
    const capturedList = getCapturedList();
    
    pokemonListEl.innerHTML = '';

    const filteredList = gameData.pokemonList.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(currentState.searchTerm) || 
                              p.id.toString().includes(currentState.searchTerm) ||
                              p.lumioseId.toString().includes(currentState.searchTerm);
        const isCaptured = capturedList.includes(p.id);
        
        if (currentState.filterMode === 'uncaptured' && isCaptured) return false;
        if (currentState.filterMode === 'captured' && !isCaptured) return false;
        
        if (currentState.filterType !== 'all') {
            if (!p.type.includes(currentState.filterType)) return false;
        }

        return matchesSearch;
    });

    if (filteredList.length === 0) {
        pokemonListEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Nenhum Pokémon encontrado.</div>';
        return;
    }

    filteredList.forEach(p => {
        const isCaptured = capturedList.includes(p.id);
        const isActive = p.id === currentState.selectedPokemonId;
        
        const item = document.createElement('div');
        item.className = `pokemon-item ${isCaptured ? 'captured' : ''} ${isActive ? 'active' : ''}`;
        item.onclick = () => selectPokemon(p.id);

        item.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="pokemon-id">#${String(p.lumioseId).padStart(3, '0')}</div>
            <div class="pokemon-info">
                <span class="pokemon-name">${p.name}</span>
                ${isCaptured ? '<i class="fa-solid fa-check" style="color: var(--accent-color);"></i>' : ''}
            </div>
        `;
        
        pokemonListEl.appendChild(item);
    });
}

function selectPokemon(id) {
    currentState.selectedPokemonId = id;
    render(); // Re-render to update active state in list and show details
}

function renderDetails() {
    const gameData = getCurrentGameData();
    const pokemon = gameData.pokemonList.find(p => p.id === currentState.selectedPokemonId);

    if (!pokemon) {
        emptyState.classList.remove('hidden');
        detailContent.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    detailContent.classList.remove('hidden');

    // Populate data
    detailName.textContent = pokemon.name;
    detailId.textContent = `#${String(pokemon.lumioseId).padStart(3, '0')}`;
    detailImage.src = pokemon.image;
    detailImage.alt = pokemon.name;

    // Check if it is a Mega Evolution (ID > 20000)
    const isMega = pokemon.id > 20000;

    // Evolution Logic
    const captureMethod = pokemon.captureInfo.method || "";
    if (!isMega && (captureMethod.includes("Evoluir") || captureMethod.includes("Evolução"))) {
        // Extract name from "Evoluir [Name]" or "Evolução de [Name]"
        let preEvoName = captureMethod.replace("Evoluir ", "").replace("Evolução de ", "").split(" ")[0]; // Get first word
        
        // Try to find this pokemon in the list to get its ID
        const preEvo = gameData.pokemonList.find(p => p.name.includes(preEvoName));
        
        if (preEvo) {
            evolutionContainer.classList.remove('hidden');
            preEvolutionLink.textContent = preEvo.name;
            preEvolutionLink.onclick = (e) => {
                e.preventDefault();
                selectPokemon(preEvo.id);
            };
        } else {
            evolutionContainer.classList.add('hidden');
        }
    } else {
        evolutionContainer.classList.add('hidden');
    }
    
    // Map Logic (Only for Scarlet/Violet and NOT Mega)
    if (!isMega && currentState.selectedGameId === 'scarlet-violet') {
        mapContainer.classList.remove('hidden');
        // Link to Game8 Interactive Map
        // We can link to the general map or try to search
        // Since we don't have per-pokemon map URLs, we link to the main map
        mapLink.href = "https://game8.co/games/Pokemon-Scarlet-Violet/archives/369146"; 
        staticMapPreview.classList.remove('hidden');
    } else {
        mapContainer.classList.add('hidden');
        staticMapPreview.classList.add('hidden');
    }

    // Info Grid Logic (Hide for Megas)
    if (infoGrid) {
        if (isMega) {
            infoGrid.classList.add('hidden');
        } else {
            infoGrid.classList.remove('hidden');
        }
    }

    // Types
    detailTypes.innerHTML = '';
    pokemon.type.forEach(type => {
        const badge = document.createElement('span');
        badge.className = 'type-badge';
        badge.textContent = type;
        
        const cssVar = mapTypeToCss(type);
        badge.style.backgroundColor = `var(--type-${cssVar})`;
        detailTypes.appendChild(badge);
    });

    detailLocation.textContent = pokemon.captureInfo.location;
    detailTime.textContent = pokemon.captureInfo.time;
    detailWeather.textContent = pokemon.captureInfo.weather;
    detailMethod.textContent = pokemon.captureInfo.method;

    // Set checkbox state
    const capturedList = getCapturedList();
    const isCaptured = capturedList.includes(pokemon.id);
    detailCheckbox.checked = isCaptured;
    
    if (isCaptured) {
        captureStatusContainer.classList.add('active');
    } else {
        captureStatusContainer.classList.remove('active');
    }
}

function updateProgress() {
    const gameData = getCurrentGameData();
    const capturedList = getCapturedList();
    const total = gameData.pokemonList.length;
    const current = capturedList.filter(id => gameData.pokemonList.some(p => p.id === id)).length; // Only count valid pokemon for this game

    progressText.textContent = `${current}/${total}`;
    const percentage = total === 0 ? 0 : (current / total) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

