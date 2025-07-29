// MongoDB 連接接口
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // 修改為你的 MongoDB 連線字串
const dbName = 'gameDB';

async function connect() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
}

// 新增評論
async function addComment(comment) {
    const { db, client } = await connect();
    await db.collection('comments').insertOne(comment);
    await client.close();
}

// 取得所有評論
async function getComments(gameName) {
    const { db, client } = await connect();
    const comments = await db.collection('comments').find({ gameName }).toArray();
    await client.close();
    return comments;
}

// 新增使用者
async function addUser(user) {
    const { db, client } = await connect();
    await db.collection('users').insertOne(user);
    await client.close();
}

// 取得使用者
async function getUser(username) {
    const { db, client } = await connect();
    const user = await db.collection('users').findOne({ username });
    await client.close();
    return user;
}

module.exports = { addComment, getComments, addUser, getUser };
