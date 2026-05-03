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
        "dataFile": "data/legends_za.json"
    },
    {
        "id": "scarlet-violet",
        "name": "Pokémon Scarlet & Violet",
        "region": "Paldea",
        "dataFile": "data/scarlet_violet.json"
    },
    {
        "id": "fire-red-leaf-green",
        "name": "Pokémon FireRed & LeafGreen",
        "region": "Kanto",
        "dataFile": "data/fire_red_leaf_green.json"
    },
    {
        "id": "ruby-sapphire-emerald",
        "name": "Pokémon Ruby, Sapphire & Emerald",
        "region": "Hoenn",
        "dataFile": "data/ruby_sapphire_emerald.json"
    },
    {
        "id": "platinum",
        "name": "Pokémon Diamond, Pearl & Platinum",
        "region": "Sinnoh",
        "dataFile": "data/sinnoh_platinum.json"
    },
    {
        "id": "sword-shield",
        "name": "Pokémon Sword & Shield",
        "region": "Galar",
        "dataFile": "data/sword_shield.json"
    }
];

// Cache for loaded game data
const gameDataCache = {};

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
    selectedGameId: "sword-shield",
    selectedPokemonId: null,
    filterMode: 'all', // 'all', 'uncaptured', 'captured'
    filterType: 'all', // 'all' or specific type
    searchTerm: '',
    capturedData: {}, // Loaded from LocalStorage
    teamData: {}, // Loaded from LocalStorage
    currentView: 'dex', // 'dex', 'team'
    selectedSlotIndex: null, // Track which slot we are filling
    selectedTeamProfile: 0, // Default profile 0 (Equipe 1)
    hideMegas: false, // Toggle to hide Mega Evolutions
    shinyToggles: {}, // Toggle Shiny view per Pokemon
    itemsToShow: 50, // Infinite Scroll
    currentFilteredList: [] // Optimization for Infinite Scroll
};

// DOM Elements
const gameSelect = document.getElementById('game-select');
const teamProfileSelect = document.getElementById('team-profile-select');
const pokemonListEl = document.getElementById('pokemon-list');
const searchInput = document.getElementById('search-input');
const filterTypeSelect = document.getElementById('filter-type');
const filterUncapturedBtn = document.getElementById('filter-uncaptured');
const filterCapturedBtn = document.getElementById('filter-captured');
const filterHideMegasBtn = document.getElementById('filter-hide-megas');
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
const shinyToggleBtn = document.getElementById('shiny-toggle-btn'); // Shiny Button
const evolutionContainer = document.getElementById('evolution-container');
const preEvolutionLink = document.getElementById('pre-evolution-link');
const mapContainer = document.getElementById('map-container');
const mapLink = document.getElementById('map-link');
const staticMapPreview = document.getElementById('static-map-preview');
const addToTeamBtn = document.getElementById('add-to-team-btn');
const infoGrid = document.getElementById('info-grid');

// Initialize
function init() {
    // Populate Custom Game Select
    const customGameSelect = document.getElementById('custom-game-select');
    const customGameOptions = document.getElementById('custom-game-options');
    const selectedGameText = document.getElementById('selected-game-text');

    if (customGameSelect && customGameOptions) {
        games.forEach(game => {
            const option = document.createElement('div');
            option.className = 'custom-option';
            option.dataset.value = game.id;
            
            // Beta highlight for Scarlet & Violet
            let displayText = game.name;
            if (game.id === 'scarlet-violet') {
                displayText = `${game.name} (Beta 🚧)`;
                option.style.color = '#ff9f43'; // Orange highlight
                option.style.fontWeight = 'bold';
            }
            
            option.textContent = displayText;
            customGameOptions.appendChild(option);
        });

        // Toggle Dropdown
        customGameSelect.querySelector('.select-trigger').addEventListener('click', (e) => {
            closeAllDropdowns();
            customGameSelect.classList.toggle('open');
            e.stopPropagation();
        });

        // Option Selection
        customGameOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-option');
            if (!option) return;
            
            const value = option.dataset.value;
            const text = option.textContent;

            // Update UI
            selectedGameText.textContent = text;
            if (value === 'scarlet-violet') {
                selectedGameText.style.color = '#ff9f43';
                selectedGameText.style.fontWeight = 'bold';
            } else {
                selectedGameText.style.color = 'var(--text-primary)';
                selectedGameText.style.fontWeight = 'normal';
            }

            // Update State
            currentState.selectedGameId = value;
            currentState.selectedPokemonId = null; // Reset selection
            loadData(); // Reload data for new game

            // Close
            customGameSelect.classList.remove('open');
            
            // Update Selected Class
            customGameOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    }

    /* Original Game Select Logic Removed
    games.forEach(game => {
        ...
    });
    gameSelect.addEventListener('change', ...);
    */

    // Custom Team Profile Select Logic
    const customTeamSelect = document.getElementById('custom-team-select');
    const customTeamOptions = document.getElementById('custom-team-options');
    const selectedTeamText = document.getElementById('selected-team-text');

    if (customTeamSelect && customTeamOptions) {
        // Populate options 0-4
        for (let i = 0; i < 5; i++) {
            const option = document.createElement('div');
            option.className = 'custom-option';
            option.dataset.value = i;
            option.textContent = `Equipe ${i + 1}`;
            if (i === 0) option.classList.add('selected');
            customTeamOptions.appendChild(option);
        }

        // Toggle Dropdown
        customTeamSelect.querySelector('.select-trigger').addEventListener('click', (e) => {
            closeAllDropdowns();
            customTeamSelect.classList.toggle('open');
            e.stopPropagation();
        });

        // Option Selection
        customTeamOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-option');
            if (!option) return;
            
            const value = parseInt(option.dataset.value);
            const text = option.textContent;

            // Update UI
            selectedTeamText.textContent = text;

            // Update State
            currentState.selectedTeamProfile = value;
            renderTeamBuilder();

            // Close
            customTeamSelect.classList.remove('open');
            
            // Update Selected Class
            customTeamOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    }

    // Helper to close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.custom-select').forEach(el => el.classList.remove('open'));
    }

    // Custom Type Filter Logic
    const customTypeFilter = document.getElementById('custom-type-filter');
    const customTypeOptions = document.getElementById('custom-type-options');
    const selectedTypeText = document.getElementById('selected-type-text');
    
    if (customTypeFilter && customTypeOptions) {
        const types = Object.keys(typeChart).sort();
        
        types.forEach(type => {
            const option = document.createElement('div');
            option.className = 'custom-option';
            option.dataset.value = type;
            
            // Optional: Add colored dot
            const colorVar = mapTypeToCss(type);
            const dot = document.createElement('span');
            dot.className = 'custom-option-dot';
            dot.style.backgroundColor = `var(--type-${colorVar})`;
            
            option.appendChild(dot);
            option.appendChild(document.createTextNode(type));
            
            customTypeOptions.appendChild(option);
        });

        // Toggle Dropdown
        customTypeFilter.querySelector('.select-trigger').addEventListener('click', (e) => {
            closeAllDropdowns(); // Close others first
            customTypeFilter.classList.toggle('open');
            e.stopPropagation();
        });

        // Option Selection
        customTypeOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-option');
            if (!option) return;
            
            const value = option.dataset.value;
            
            // Update UI
            if (value === 'all') {
                selectedTypeText.textContent = "Todos os Tipos";
                // Optionally clear color if it was set
                // selectedTypeText.style.color = 'var(--text-primary)';
            } else {
                selectedTypeText.textContent = value;
                // Optional: Update trigger text color to match type
                // const colorVar = mapTypeToCss(value);
                // selectedTypeText.style.color = `var(--type-${colorVar})`;
            }

            // Update State
            currentState.filterType = value;
            currentState.itemsToShow = 50;
            renderList();

            // Close
            customTypeFilter.classList.remove('open');
            
            // Update Selected Class
            customTypeOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });

        // Close on Click Outside (Updated to cover all custom selects)
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                closeAllDropdowns();
            }
        });
    }

    /* Original Select Logic Removed/Commented
    if (filterTypeSelect) {
        ...
    }
    */

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
        searchInput.addEventListener('input', debounce((e) => {
            currentState.searchTerm = e.target.value.toLowerCase();
            currentState.itemsToShow = 50; // Reset scroll on search
            renderList();
        }, 300));
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
            currentState.itemsToShow = 50; // Reset scroll on filter
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
            currentState.itemsToShow = 50; // Reset scroll on filter
            renderList();
        });
    }

    if (filterHideMegasBtn) {
        filterHideMegasBtn.addEventListener('click', () => {
            currentState.hideMegas = !currentState.hideMegas;
            filterHideMegasBtn.classList.toggle('active', currentState.hideMegas);
            currentState.itemsToShow = 50; // Reset scroll on filter
            renderList();
            updateProgress();
        });
    }

    if (detailCheckbox) {
        detailCheckbox.addEventListener('change', (e) => {
            if (currentState.selectedPokemonId) {
                toggleCapture(currentState.selectedPokemonId, e.target.checked);
            }
        });
    }

    if (shinyToggleBtn) {
        shinyToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling if needed
            if (currentState.selectedPokemonId) {
                toggleShiny(currentState.selectedPokemonId);
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
    const gameId = currentState.selectedGameId;
    
    // Load Game Data if not in cache
    if (!gameDataCache[gameId]) {
        const game = games.find(g => g.id === gameId);
        if (game) {
            try {
                // Show loading state?
                document.body.style.cursor = 'wait';
                const res = await fetch(game.dataFile);
                if (!res.ok) throw new Error("Failed to load");
                const list = await res.json();
                gameDataCache[gameId] = { ...game, pokemonList: list };
                document.body.style.cursor = 'default';
            } catch (e) {
                console.error("Error loading data", e);
                document.body.style.cursor = 'default';
                return;
            }
        }
    }

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

    const fragment = document.createDocumentFragment();

    filtered.forEach(p => {
        const item = document.createElement('div');
        item.className = 'selector-item';
        item.onclick = () => addToTeam(p.id, currentState.selectedSlotIndex);
        
        const imageUrl = getPokemonImage(p);

        item.innerHTML = `
            <img src="${imageUrl}" alt="${p.name}" loading="lazy">
            <div class="selector-info">
                <span class="selector-name">#${String(p.lumioseId).padStart(3, '0')} ${p.name}</span>
                <div class="selector-types">
                    ${p.type.map(t => `<span class="selector-type" style="background: var(--type-${mapTypeToCss(t)})">${t}</span>`).join('')}
                </div>
            </div>
            <i class="fa-solid fa-plus" style="color: var(--accent-color);"></i>
        `;
        fragment.appendChild(item);
    });

    selectorList.appendChild(fragment);
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
                const imageUrl = getPokemonImage(pokemon);
                slot.innerHTML = `
                    <div class="slot-image">
                        <img src="${imageUrl}" alt="${pokemon.name}">
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
    return gameDataCache[currentState.selectedGameId];
}

function getCapturedList() {
    if (!currentState.capturedData[currentState.selectedGameId]) {
        currentState.capturedData[currentState.selectedGameId] = [];
    }
    return currentState.capturedData[currentState.selectedGameId];
}

function toggleCapture(pokemonId, isCaptured) {
    // Ensure ID is a number
    const id = Number(pokemonId);
    if (isNaN(id)) return;

    const list = getCapturedList();
    const index = list.indexOf(id);

    if (isCaptured && index === -1) {
        list.push(id);
    } else if (!isCaptured && index > -1) {
        list.splice(index, 1);
    }

    saveData();
    updateProgress();
    renderDetails(); // Re-render details to update style
    
    // Always re-render list to ensure consistency, but keep scroll position/count
    renderList(false, true); 
}

function toggleShiny(pokemonId) {
    currentState.shinyToggles[pokemonId] = !currentState.shinyToggles[pokemonId];
    renderDetails(); // Update image in details
    // renderList(); // Update image in list (optional, but good for consistency if we show shiny in list)
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

function getPokemonImage(pokemon) {
    let imageUrl = pokemon.image;
    if (currentState.shinyToggles[pokemon.id]) {
        if (imageUrl.includes("raw.githubusercontent.com/PokeAPI")) {
            // PokeAPI
            imageUrl = imageUrl.replace("/official-artwork/", "/official-artwork/shiny/");
        } else if (imageUrl.includes("img/mega/")) {
            // Local Mega - Attempt to use -shiny suffix
            // e.g., img/mega/Mega-Name.jpg -> img/mega/shiny/Mega-Name.jpg
            // Since we can't easily check file existence, we'll try to follow a convention
            // Or just alert the user for now that custom shinies need to be added?
            // Let's assume a folder structure or naming convention
            // Try: img/mega/Mega-Name-Shiny.jpg
            imageUrl = imageUrl.replace(".jpg", "-Shiny.jpg");
        }
    }
    return imageUrl;
}

function renderList(append = false, keepCount = false) {
    const gameData = getCurrentGameData();
    if (!gameData || !gameData.pokemonList) {
        pokemonListEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Carregando dados...</div>';
        return;
    }
    const capturedList = getCapturedList();
    
    // Calculate Filtered List (Only if not appending)
    if (!append) {
        if (!keepCount) {
             currentState.itemsToShow = 50;
             pokemonListEl.innerHTML = ''; // Full reset
        } else {
             // If keeping count, we still need to clear to re-render visible items with new state
             // OR better: we re-render up to current itemsToShow
             pokemonListEl.innerHTML = '';
        }

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

            // Hide Megas Logic
            if (currentState.hideMegas && p.id > 20000) return false;

            return matchesSearch;
        });

        currentState.currentFilteredList = filteredList;
        
        if (filteredList.length === 0) {
            pokemonListEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Nenhum Pokémon encontrado.</div>';
            return;
        }
    }

    // Determine slice to render
    const start = append ? currentState.itemsToShow : 0;
    // If append, add 50. If not append but keepCount, use current itemsToShow. Else 50.
    let end;
    if (append) {
        end = currentState.itemsToShow + 50;
    } else {
        end = keepCount ? currentState.itemsToShow : 50;
    }
    
    // Clamp end
    const safeEnd = Math.min(end, currentState.currentFilteredList.length);
    const listToRender = currentState.currentFilteredList.slice(start, safeEnd);

    // Update state
    currentState.itemsToShow = safeEnd;

    const fragment = document.createDocumentFragment();

    listToRender.forEach(p => {
        const isCaptured = capturedList.includes(p.id);
        const isActive = p.id === currentState.selectedPokemonId;
        const imageUrl = p.image; // Use normal image for list view
        
        const item = document.createElement('div');
        item.className = `pokemon-item ${isCaptured ? 'captured' : ''} ${isActive ? 'active' : ''}`;
        item.dataset.id = p.id; // Add ID for easy selection
        item.onclick = () => selectPokemon(p.id);

        // Optimization: Use decoding="async" for smoother scrolling
        item.innerHTML = `
            <img src="${imageUrl}" alt="${p.name}" loading="lazy" decoding="async">
            <div class="pokemon-id">#${String(p.lumioseId).padStart(3, '0')}</div>
            <div class="pokemon-info">
                <span class="pokemon-name">${p.name}</span>
                ${isCaptured ? '<i class="fa-solid fa-check" style="color: var(--accent-color);"></i>' : ''}
            </div>
        `;
        
        fragment.appendChild(item);
    });

    // Remove old sentinel if exists
    const oldSentinel = document.getElementById('scroll-sentinel');
    if (oldSentinel) oldSentinel.remove();

    pokemonListEl.appendChild(fragment);

    // Add new sentinel if there are more items
    if (currentState.itemsToShow < currentState.currentFilteredList.length) {
        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '20px';
        sentinel.style.width = '100%';
        pokemonListEl.appendChild(sentinel);
        setupInfiniteScroll();
    }
}

let observer;
function setupInfiniteScroll() {
    if (observer) observer.disconnect();

    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            renderList(true); // Append mode
        }
    }, { root: pokemonListEl, rootMargin: '200px' });

    observer.observe(sentinel);
}

function selectPokemon(id) {
    const prevId = currentState.selectedPokemonId;
    currentState.selectedPokemonId = id;
    
    renderDetails(); // Re-render details

    // Optimized List Update (Avoid full re-render)
    if (prevId) {
        const prevItem = pokemonListEl.querySelector(`.pokemon-item[data-id="${prevId}"]`);
        if (prevItem) prevItem.classList.remove('active');
    }

    if (id) {
        const newItem = pokemonListEl.querySelector(`.pokemon-item[data-id="${id}"]`);
        if (newItem) newItem.classList.add('active');
    }
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
    
    // Shiny Image Logic
    const imageUrl = getPokemonImage(pokemon);
    detailImage.src = imageUrl;
    detailImage.alt = pokemon.name;
    
    // Update Shiny Button State
    if (shinyToggleBtn) {
        if (currentState.shinyToggles[pokemon.id]) {
            shinyToggleBtn.classList.add('active');
            shinyToggleBtn.title = "Ver Normal";
        } else {
            shinyToggleBtn.classList.remove('active');
            shinyToggleBtn.title = "Ver Shiny";
        }
    }

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
    if (!gameData || !gameData.pokemonList) return;

    const capturedList = getCapturedList();
    
    // Calculate total based on filters (including hideMegas)
    const validPokemon = gameData.pokemonList.filter(p => {
        if (currentState.hideMegas && p.id > 20000) return false;
        return true;
    });

    const total = validPokemon.length;
    const current = capturedList.filter(id => validPokemon.some(p => p.id === id)).length;

    progressText.textContent = `${current}/${total}`;
    const percentage = total === 0 ? 0 : (current / total) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Utility function for performance
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

