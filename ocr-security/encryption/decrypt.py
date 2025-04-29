from fastapi import APIRouter, HTTPException, Query
from pymongo import MongoClient
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import json, hashlib, os

router = APIRouter()

# Load environment variables
load_dotenv()
key = os.getenv("FERNET_KEY")

if not key:
    raise Exception("FERNET_KEY not found in .env")

fernet = Fernet(key)

# MongoDB connection
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["land_records"]
collection = db["encrypted_land_data"]

def compute_hash(data: dict) -> str:
    json_data = json.dumps(data, sort_keys=True).encode("utf-8")
    return hashlib.sha256(json_data).hexdigest()

@router.get("/api/land/view")
async def view_land(document_hash: str = Query(...)):
    record = collection.find_one({"document_hash": document_hash})
    if not record:
        raise HTTPException(status_code=404, detail="Record not found in database")

    try:
        encrypted_data = record["encrypted_data"]
        if isinstance(encrypted_data, bytes):
            encrypted_data = encrypted_data.decode()

        decrypted_data_json = fernet.decrypt(encrypted_data.encode()).decode()
        decrypted_data = json.loads(decrypted_data_json)

        recomputed_hash = compute_hash(decrypted_data)

        if recomputed_hash == document_hash:
            clean_data = {
                "owner": decrypted_data.get("owner", "Unknown"),
                "location": decrypted_data.get("location", "Unknown"),
                "raw_text": decrypted_data.get("raw_text", "")
            }
            return { "status": "success", "data": clean_data }
        else:
            return { "status": "error", "message": "Hash mismatch. Data may be tampered." }

    except Exception as e:
        return { "status": "error", "message": f"Decryption or verification failed: {str(e)}" }
