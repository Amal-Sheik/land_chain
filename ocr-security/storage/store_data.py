from pymongo import MongoClient
import json

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Change if using a remote DB
db = client["LandRecordsDB"]  # Database name
collection = db["EncryptedRecords"]  # Collection name

# Load encrypted data
with open("../encryption/encrypted_data.json", "r") as file:
    encrypted_data = json.load(file)

# Insert data into MongoDB
collection.insert_one(encrypted_data)

print("✅ Encrypted data successfully stored in MongoDB!")
