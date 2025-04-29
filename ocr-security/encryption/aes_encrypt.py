from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
import base64
import json

# Generate a random 32-byte AES key (256-bit) and 16-byte IV
aes_key = os.urandom(32)  
iv = os.urandom(16)  

def encrypt_data(data, key, iv):
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Pad data to be a multiple of 16 bytes
    padded_data = data + ' ' * (16 - len(data) % 16)
    encrypted_data = encryptor.update(padded_data.encode()) + encryptor.finalize()

    return base64.b64encode(encrypted_data).decode()

# Load extracted OCR JSON data
with open("../ocr/ocr_output.json", "r") as file:
    json_data = json.load(file)

# Encrypt the extracted text
encrypted_text = encrypt_data(json_data["ocr_text"], aes_key, iv)

# Save encrypted data to JSON
encrypted_data = {
    "aes_key": base64.b64encode(aes_key).decode(),  # Store the key securely
    "iv": base64.b64encode(iv).decode(),
    "encrypted_text": encrypted_text
}

with open("encrypted_data.json", "w") as file:
    json.dump(encrypted_data, file, indent=4)

print("✅ Data successfully encrypted and saved to encrypted_data.json!")
