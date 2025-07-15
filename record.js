const recordList = document.getElementById('recordList');
const records = JSON.parse(localStorage.getItem('records') || "[]");

if (records.length === 0) {
    recordList.innerHTML = "<li>尚無評論紀錄。</li>";
} else {
    records.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${rec.gameName}</strong>：${rec.comment}<br><small>${rec.time}</small>`;
        recordList.appendChild(li);
    });
}
