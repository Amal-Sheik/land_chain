from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes
import base64
import json

# Load the RSA public key
with open("public_key.pem", "rb") as key_file:
    public_key = serialization.load_pem_public_key(key_file.read())

# Load the AES key from encrypted_data.json
with open("encrypted_data.json", "r") as file:
    encrypted_data = json.load(file)
    aes_key = base64.b64decode(encrypted_data["aes_key"])  # Decode AES key

# Encrypt the AES key using RSA
encrypted_aes_key = public_key.encrypt(
    aes_key,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Replace AES key with RSA-encrypted version
encrypted_data["aes_key"] = base64.b64encode(encrypted_aes_key).decode()

# Save the updated encrypted data
with open("encrypted_data.json", "w") as file:
    json.dump(encrypted_data, file, indent=4)

print("✅ AES key successfully encrypted with RSA!")
