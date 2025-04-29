import pymongo
import base64
import requests
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Load RSA private key
with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None,
        backend=default_backend()
    )

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["LandRecordsDB"]
collection = db["EncryptedRecords"]

# Fetch first document
record = collection.find_one()
if not record:
    print("⚠️ No document found in MongoDB.")
    exit()

print("✅ Fetched record from MongoDB")

# Decode encrypted fields
encrypted_aes_key = base64.b64decode(record["aes_key"])
iv = base64.b64decode(record["iv"])
encrypted_text = base64.b64decode(record["encrypted_text"])

# Decrypt AES key
aes_key = private_key.decrypt(
    encrypted_aes_key,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Decrypt text using AES
cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
decryptor = cipher.decryptor()

decrypted_padded = decryptor.update(encrypted_text) + decryptor.finalize()
decrypted_text = decrypted_padded.rstrip(b' ').decode()

print("\n✅ Decrypted OCR Text:\n")
print(decrypted_text)

# ✅ Now send to backend
payload = {
    "original_text": decrypted_text
}
try:
    response = requests.post("http://localhost:5000/retrieve-land-record", json=payload)
    print("\n✅ Sent to backend. Response:")
    print(response.text)
except requests.exceptions.RequestException as e:
    print("\n⚠️ Failed to send to backend:", e)
