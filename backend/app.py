
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

# ----- Mock Database (In-memory) -----
# In a real application, you would use a proper database like PostgreSQL or MongoDB

# Load initial data
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Function to load data from JSON files
def load_data(filename, default=None):
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    # Create the file with default data if it doesn't exist
    if default is not None:
        with open(filepath, 'w') as f:
            json.dump(default, f, indent=2)
        return default
    return []

# Function to save data to JSON files
def save_data(filename, data):
    with open(os.path.join(DATA_DIR, filename), 'w') as f:
        json.dump(data, f, indent=2)

# Initialize data stores
scholarships = load_data("scholarships.json", [
    {
        "id": str(uuid.uuid4()),
        "title": "STEM Innovation Grant",
        "sponsor": "TechFuture Foundation",
        "amount": 5000,
        "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
        "status": "open",
        "description": "Supporting innovative projects in science, technology, engineering, and mathematics fields.",
        "requirements": "Undergraduate students with GPA 3.5 or above. Must submit project proposal."
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Arts and Humanities Fellowship",
        "sponsor": "Cultural Heritage Fund",
        "amount": 3500,
        "deadline": (datetime.now() + timedelta(days=60)).isoformat(),
        "status": "open",
        "description": "Supporting students pursuing degrees in arts, literature, history, and related fields.",
        "requirements": "Open to all undergraduate and graduate students. Portfolio submission required."
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Community Leadership Scholarship",
        "sponsor": "Civic Engagement Initiative",
        "amount": 2500,
        "deadline": (datetime.now() + timedelta(days=5)).isoformat(),
        "status": "open",
        "description": "Recognizing students who have demonstrated exceptional leadership in community service.",
        "requirements": "Minimum 100 hours of community service. Two recommendation letters required."
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Environmental Research Grant",
        "sponsor": "Green Earth Foundation",
        "amount": 4500,
        "deadline": (datetime.now() - timedelta(days=15)).isoformat(),
        "status": "closed",
        "description": "Funding for research projects focused on environmental sustainability and conservation.",
        "requirements": "Graduate students in environmental science or related fields. Research proposal required."
    }
])

users = load_data("users.json", [
    {
        "id": str(uuid.uuid4()),
        "address": "0x1234567890abcdef1234567890abcdef12345678",
        "name": "John Doe",
        "email": "john@example.com",
        "type": "student",
        "balance": "0.5",
        "created_at": (datetime.now() - timedelta(days=45)).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "address": "0xabcdef1234567890abcdef1234567890abcdef12",
        "name": "Tech Foundation",
        "email": "foundation@tech.org",
        "type": "sponsor",
        "balance": "10.2",
        "created_at": (datetime.now() - timedelta(days=90)).isoformat()
    }
])

messages = load_data("messages.json", [
    {
        "id": str(uuid.uuid4()),
        "sender": {
            "id": users[1]["id"],
            "name": users[1]["name"]
        },
        "recipient": {
            "id": users[0]["id"],
            "name": users[0]["name"]
        },
        "content": "Congratulations! Your application for the STEM Innovation Grant has been shortlisted. Please schedule an interview with our team in the next week.",
        "timestamp": (datetime.now() - timedelta(days=2)).isoformat(),
        "read": False
    },
    {
        "id": str(uuid.uuid4()),
        "sender": {
            "id": users[1]["id"],
            "name": users[1]["name"]
        },
        "recipient": {
            "id": users[0]["id"],
            "name": users[0]["name"]
        },
        "content": "We're pleased to inform you that your project proposal has received positive feedback from our review committee. We'd like to discuss potential funding options for your initiative.",
        "timestamp": (datetime.now() - timedelta(days=7)).isoformat(),
        "read": True
    }
])

applications = load_data("applications.json", [])

transactions = load_data("transactions.json", [])

# ----- API Routes -----

@app.route('/')
def home():
    return jsonify({"message": "MetaMind Fellowship API"})

# Scholarships Endpoints
@app.route('/api/scholarships', methods=['GET'])
def get_scholarships():
    return jsonify(scholarships)

@app.route('/api/scholarships/<scholarship_id>', methods=['GET'])
def get_scholarship(scholarship_id):
    scholarship = next((s for s in scholarships if s["id"] == scholarship_id), None)
    if scholarship:
        return jsonify(scholarship)
    return jsonify({"error": "Scholarship not found"}), 404

@app.route('/api/scholarships', methods=['POST'])
def create_scholarship():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
        
    new_scholarship = {
        "id": str(uuid.uuid4()),
        "title": data.get("title"),
        "sponsor": data.get("sponsor"),
        "amount": data.get("amount"),
        "deadline": data.get("deadline"),
        "status": data.get("status", "open"),
        "description": data.get("description"),
        "requirements": data.get("requirements")
    }
    
    scholarships.append(new_scholarship)
    save_data("scholarships.json", scholarships)
    return jsonify(new_scholarship), 201

# User Endpoints
@app.route('/api/users/<address>', methods=['GET'])
def get_user(address):
    user = next((u for u in users if u["address"] == address), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    if not data or not data.get("address"):
        return jsonify({"error": "Address is required"}), 400
    
    # Check if user already exists
    if any(u["address"] == data.get("address") for u in users):
        return jsonify({"error": "User already exists"}), 409
    
    new_user = {
        "id": str(uuid.uuid4()),
        "address": data.get("address"),
        "name": data.get("name", "Unnamed User"),
        "email": data.get("email", ""),
        "type": data.get("type", "student"),
        "balance": data.get("balance", "0.0"),
        "created_at": datetime.now().isoformat()
    }
    
    users.append(new_user)
    save_data("users.json", users)
    return jsonify(new_user), 201

@app.route('/api/users/<address>', methods=['PUT'])
def update_user(address):
    data = request.json
    user = next((u for u in users if u["address"] == address), None)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update fields
    for field in ["name", "email", "type", "balance"]:
        if field in data:
            user[field] = data[field]
    
    save_data("users.json", users)
    return jsonify(user)

# Messages Endpoints
@app.route('/api/messages/<user_id>', methods=['GET'])
def get_user_messages(user_id):
    user_messages = [m for m in messages if m["recipient"]["id"] == user_id]
    return jsonify(user_messages)

@app.route('/api/messages/<message_id>/read', methods=['PUT'])
def mark_message_read(message_id):
    message = next((m for m in messages if m["id"] == message_id), None)
    if not message:
        return jsonify({"error": "Message not found"}), 404
    
    message["read"] = True
    save_data("messages.json", messages)
    return jsonify(message)

@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    new_message = {
        "id": str(uuid.uuid4()),
        "sender": data.get("sender"),
        "recipient": data.get("recipient"),
        "content": data.get("content"),
        "timestamp": datetime.now().isoformat(),
        "read": False
    }
    
    messages.append(new_message)
    save_data("messages.json", messages)
    return jsonify(new_message), 201

# Applications Endpoints
@app.route('/api/applications', methods=['POST'])
def submit_application():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    new_application = {
        "id": str(uuid.uuid4()),
        "scholarship_id": data.get("scholarshipId"),
        "scholarship_title": data.get("scholarshipTitle"),
        "applicant_id": data.get("applicantId"),
        "story": data.get("story"),
        "contact_email": data.get("contactEmail"),
        "contact_phone": data.get("contactPhone"),
        "status": "pending",
        "submitted_at": datetime.now().isoformat(),
        "documents": data.get("documents", [])  # In a real app, would handle file uploads separately
    }
    
    applications.append(new_application)
    save_data("applications.json", applications)
    
    # Notify scholarship sponsor (in a real app, would send actual notification)
    # Create a notification message
    scholarship = next((s for s in scholarships if s["id"] == data.get("scholarshipId")), None)
    if scholarship:
        sponsor = next((u for u in users if u["type"] == "sponsor"), None)
        applicant = next((u for u in users if u["id"] == data.get("applicantId")), None)
        
        if sponsor and applicant:
            notification = {
                "id": str(uuid.uuid4()),
                "sender": {
                    "id": "system",
                    "name": "System"
                },
                "recipient": {
                    "id": sponsor["id"],
                    "name": sponsor["name"]
                },
                "content": f"New application received for {scholarship['title']} from {applicant['name']}.",
                "timestamp": datetime.now().isoformat(),
                "read": False
            }
            messages.append(notification)
            save_data("messages.json", messages)
    
    return jsonify(new_application), 201

@app.route('/api/applications/<scholarship_id>', methods=['GET'])
def get_scholarship_applications(scholarship_id):
    scholarship_applications = [a for a in applications if a["scholarship_id"] == scholarship_id]
    return jsonify(scholarship_applications)

@app.route('/api/applications/user/<user_id>', methods=['GET'])
def get_user_applications(user_id):
    user_applications = [a for a in applications if a["applicant_id"] == user_id]
    return jsonify(user_applications)

# Transactions Endpoints
@app.route('/api/transactions', methods=['POST'])
def record_transaction():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    new_transaction = {
        "id": str(uuid.uuid4()),
        "from_address": data.get("fromAddress"),
        "to_address": data.get("toAddress"),
        "amount": data.get("amount"),
        "scholarship_id": data.get("scholarshipId", None),
        "timestamp": datetime.now().isoformat(),
        "status": "completed",
        "tx_hash": data.get("txHash", None)
    }
    
    transactions.append(new_transaction)
    save_data("transactions.json", transactions)
    
    # Update user balances (simplified for demo)
    sender = next((u for u in users if u["address"] == data.get("fromAddress")), None)
    recipient = next((u for u in users if u["address"] == data.get("toAddress")), None)
    
    if sender:
        sender_balance = float(sender["balance"])
        sender_balance -= float(data.get("amount", 0))
        sender["balance"] = str(max(0, sender_balance))
    
    if recipient:
        recipient_balance = float(recipient["balance"])
        recipient_balance += float(data.get("amount", 0))
        recipient["balance"] = str(recipient_balance)
    
    save_data("users.json", users)
    
    # Notify recipient
    if sender and recipient:
        notification = {
            "id": str(uuid.uuid4()),
            "sender": {
                "id": sender["id"],
                "name": sender["name"]
            },
            "recipient": {
                "id": recipient["id"],
                "name": recipient["name"]
            },
            "content": f"You have received {data.get('amount')} ETH from {sender['name']}.",
            "timestamp": datetime.now().isoformat(),
            "read": False
        }
        messages.append(notification)
        save_data("messages.json", messages)
    
    return jsonify(new_transaction), 201

@app.route('/api/transactions/<user_address>', methods=['GET'])
def get_user_transactions(user_address):
    user_transactions = [
        t for t in transactions 
        if t["from_address"] == user_address or t["to_address"] == user_address
    ]
    return jsonify(user_transactions)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
