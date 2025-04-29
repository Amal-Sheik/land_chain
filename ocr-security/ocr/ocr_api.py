from fastapi import APIRouter, UploadFile, File
from google.cloud import vision
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

# Google Cloud Vision client
client = vision.ImageAnnotatorClient()

# MongoDB connection
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["land_records"]
collection = db["encrypted_land_data"]

def compute_hash(data: dict) -> str:
    json_data = json.dumps(data, sort_keys=True).encode("utf-8")
    return hashlib.sha256(json_data).hexdigest()

@router.post("/api/ocr")
async def ocr_image(file: UploadFile = File(...)):
    content = await file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if texts:
        extracted_text = texts[0].description.strip()
    else:
        extracted_text = "No text detected."

    print("✅ OCR Text Extracted:", extracted_text)

    # Sample structure: Adjust this extraction logic as needed
    lines = extracted_text.split("\n")
    ocr_data = {
        "owner": lines[0] if len(lines) > 0 else "Unknown",
        "location": lines[1] if len(lines) > 1 else "Unknown",
        "raw_text": extracted_text
    }

    # Encrypt structured data
    ocr_data_json = json.dumps(ocr_data)
    encrypted_data = fernet.encrypt(ocr_data_json.encode())

    # Compute hash of original data
    document_hash = compute_hash(ocr_data)
    print("🔐 Document hash:", document_hash)

    # Store in DB
    record = {
        "document_hash": document_hash,
        "encrypted_data": encrypted_data.decode()
    }
    collection.insert_one(record)

    return {
        "ocr_data": ocr_data,
        "document_hash": document_hash,
        "ocr_text": extracted_text
    }
