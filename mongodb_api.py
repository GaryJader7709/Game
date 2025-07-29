from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017")
db = client["gameDB"]

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if db.users.find_one({"username": data["username"]}):
        return jsonify({"success": False, "msg": "帳號已存在"})
    db.users.insert_one({"username": data["username"], "password": data["password"]})
    return jsonify({"success": True})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = db.users.find_one({"username": data["username"], "password": data["password"]})
    if user:
        return jsonify({"success": True})
    return jsonify({"success": False, "msg": "帳號或密碼錯誤"})

@app.route("/comments", methods=["GET"])
def get_comments():
    game = request.args.get("game")
    comments = list(db.comments.find({"gameName": game}, {"_id": 0}))
    return jsonify(comments)

@app.route("/comments", methods=["POST"])
def add_comment():
    data = request.json
    db.comments.insert_one(data)
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
