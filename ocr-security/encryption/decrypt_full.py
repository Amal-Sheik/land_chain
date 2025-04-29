import json
import base64
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Load encrypted AES key + IV + encrypted text
with open("encrypted_data.json", "r") as file:
    encrypted_json = json.load(file)

encrypted_aes_key = base64.b64decode(encrypted_json["aes_key"])
iv = base64.b64decode(encrypted_json["iv"])
encrypted_text = base64.b64decode(encrypted_json["encrypted_text"])

# Load RSA private key
with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None,
        backend=default_backend()
    )

# Decrypt the AES key using RSA private key
aes_key = private_key.decrypt(
    encrypted_aes_key,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Now decrypt the text using AES
cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
decryptor = cipher.decryptor()

decrypted_padded = decryptor.update(encrypted_text) + decryptor.finalize()
decrypted_text = decrypted_padded.rstrip(b' ').decode()

print("\n✅ Decrypted OCR Text:\n")
print(decrypted_text)
