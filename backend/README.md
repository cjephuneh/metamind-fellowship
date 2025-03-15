
# MetaMind Fellowship API

This Flask API provides backend functionality for the MetaMind Fellowship platform.

## Setup and Running

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment (recommended):
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the dependencies:
```
pip install -r requirements.txt
```

3. Start the server:
```
python app.py
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Scholarships
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/<id>` - Get scholarship by ID
- `POST /api/scholarships` - Create a new scholarship

### Users
- `GET /api/users/<address>` - Get user by wallet address
- `POST /api/users` - Create a new user
- `PUT /api/users/<address>` - Update user details

### Messages
- `GET /api/messages/<user_id>` - Get messages for a user
- `PUT /api/messages/<message_id>/read` - Mark a message as read
- `POST /api/messages` - Send a new message

### Applications
- `POST /api/applications` - Submit a scholarship application
- `GET /api/applications/<scholarship_id>` - Get applications for a scholarship
- `GET /api/applications/user/<user_id>` - Get applications submitted by a user

### Transactions
- `POST /api/transactions` - Record a new transaction
- `GET /api/transactions/<user_address>` - Get transactions for a user
