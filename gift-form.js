const form = document.getElementById('giftForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const gameName = document.getElementById('gameName').value.trim();
    const comment = document.getElementById('comment').value.trim();
    if (!gameName || !comment) return;

    // 儲存評論到 localStorage
    const records = JSON.parse(localStorage.getItem('records') || "[]");
    records.push({ gameName, comment, time: new Date().toLocaleString() });
    localStorage.setItem('records', JSON.stringify(records));

    // 新遊戲自動加入遊戲列表
    const games = JSON.parse(localStorage.getItem('games') || "[]");
    if (!games.includes(gameName)) {
        games.push(gameName);
        localStorage.setItem('games', JSON.stringify(games));
    }

    alert('評論已提交！');
    form.reset();
});
