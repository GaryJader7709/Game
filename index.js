const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const mainContent = document.getElementById('mainContent');
const userStatus = document.getElementById('userStatus');

// 測試後端連線
fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: 'test' })
})
    .then(res => res.json())
    .then(data => {
        if (data.success !== undefined) {
            alert('後端連線成功');
        } else {
            alert('後端連線失敗');
        }
    })
    .catch(() => {
        alert('後端連線失敗');
    });

// 切換註冊/登入視窗
document.getElementById('showRegisterBtn').onclick = function () {
    loginModal.classList.remove('show', 'd-block');
    loginModal.style.display = 'none';
    registerModal.classList.add('show', 'd-block');
    registerModal.style.display = 'block';
};
document.getElementById('backToLoginBtn').onclick = function () {
    registerModal.classList.remove('show', 'd-block');
    registerModal.style.display = 'none';
    loginModal.classList.add('show', 'd-block');
    loginModal.style.display = 'block';
};

// 註冊流程
document.getElementById('registerForm').onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('registerUser').value.trim();
    const pass = document.getElementById('registerPass').value;
    if (!user || !pass) return;
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user]) {
        alert('帳號已存在');
        return;
    }
    users[user] = pass;
    localStorage.setItem('users', JSON.stringify(users));
    alert('註冊成功，請登入');
    document.getElementById('backToLoginBtn').click();
};

// 登入流程
document.getElementById('loginForm').onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[user] || users[user] !== pass) {
        alert('帳號或密碼錯誤');
        return;
    }
    localStorage.setItem('currentUser', user);
    loginModal.classList.remove('show', 'd-block');
    loginModal.style.display = 'none';
    mainContent.style.display = 'block';
    userStatus.innerHTML = `<div class="alert alert-success">歡迎，${user}！<button id="logoutBtn" class="btn btn-sm btn-outline-danger float-end">登出</button></div>`;
    renderGames();
    bindLogout();
};

// 登出
function bindLogout() {
    const btn = document.getElementById('logoutBtn');
    if (btn) {
        btn.onclick = function () {
            localStorage.removeItem('currentUser');
            mainContent.style.display = 'none';
            loginModal.classList.add('show', 'd-block');
            loginModal.style.display = 'block';
            userStatus.innerHTML = '';
        };
    }
}

// 自動登入判斷
window.onload = function () {
    const user = localStorage.getItem('currentUser');
    if (user) {
        loginModal.classList.remove('show', 'd-block');
        loginModal.style.display = 'none';
        mainContent.style.display = 'block';
        userStatus.innerHTML = `<div class="alert alert-success">歡迎，${user}！<button id="logoutBtn" class="btn btn-sm btn-outline-danger float-end">登出</button></div>`;
        renderGames();
        bindLogout();
    } else {
        loginModal.classList.add('show', 'd-block');
        loginModal.style.display = 'block';
        mainContent.style.display = 'none';
        userStatus.innerHTML = '';
    }
}

// 以下原本的遊戲列表與搜尋功能
const gameListEl = document.getElementById('gameList');
const searchInput = document.getElementById('searchInput');
const defaultGames = [
    "Minecraft",
    "League of Legends",
    "Genshin Impact",
    "Valorant",
    "Stardew Valley"
];
if (!localStorage.getItem('games')) {
    localStorage.setItem('games', JSON.stringify(defaultGames));
}
function renderGames(filter = "") {
    if (!gameListEl) return;
    const games = JSON.parse(localStorage.getItem('games')) || [];
    gameListEl.innerHTML = "";
    games.filter(name => name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(name => {
            const li = document.createElement('li');
            li.className = "list-group-item list-group-item-action";
            li.textContent = name;
            li.style.cursor = "pointer";
            li.onclick = function () {
                showCommentsModal(name);
            };
            gameListEl.appendChild(li);
        });
}

// 顯示評論 Modal
function showCommentsModal(gameName) {
    const modalTitle = document.getElementById('commentModalTitle');
    const modalBody = document.getElementById('commentModalBody');
    modalTitle.textContent = `${gameName} 的評論`;
    const records = JSON.parse(localStorage.getItem('records') || "[]");
    const comments = records.filter(r => r.gameName === gameName);
    if (comments.length === 0) {
        modalBody.innerHTML = "<p class='text-muted'>目前沒有評論。</p>";
    } else {
        modalBody.innerHTML = comments.map(c =>
            `<div class="mb-2 border-bottom pb-2">
                <div>${c.comment}</div>
                <div class="text-end text-secondary small">${c.time || ""}</div>
            </div>`
        ).join("");
    }
    // Bootstrap 5 Modal
    const modal = new bootstrap.Modal(document.getElementById('commentModal'));
    modal.show();
}
