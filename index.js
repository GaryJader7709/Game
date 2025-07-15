const gameListEl = document.getElementById('gameList');
const searchInput = document.getElementById('searchInput');

// 預設遊戲列表，可自行擴充
const defaultGames = [
    "Minecraft",
    "League of Legends",
    "Genshin Impact",
    "Valorant",
    "Stardew Valley"
];

// 初始化 localStorage 遊戲資料
if (!localStorage.getItem('games')) {
    localStorage.setItem('games', JSON.stringify(defaultGames));
}

function renderGames(filter = "") {
    const games = JSON.parse(localStorage.getItem('games')) || [];
    gameListEl.innerHTML = "";
    games.filter(name => name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            gameListEl.appendChild(li);
        });
}

searchInput.addEventListener('input', (e) => {
    renderGames(e.target.value);
});

renderGames();
