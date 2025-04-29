# generate_key.py
from cryptography.fernet import Fernet

key = Fernet.generate_key()
with open("fernet.key", "wb") as key_file:
    key_file.write(key)

print("Key generated and saved as fernet.key")
