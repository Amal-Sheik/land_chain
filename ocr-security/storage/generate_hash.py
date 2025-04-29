import hashlib
import json
import requests
import json

# Load the encrypted data
with open("../encryption/encrypted_data.json", "r") as file:
    encrypted_data = json.load(file)

# Convert the encrypted data to a string (for hashing)
data_string = json.dumps(encrypted_data, sort_keys=True)

# Generate SHA-256 hash
sha256_hash = hashlib.sha256(data_string.encode()).hexdigest()

# Save the hash to a file
with open("../encryption/data_hash.txt", "w") as file:
    file.write(sha256_hash)

print("✅ SHA-256 hash generated successfully!")
print("SHA-256 Hash:", sha256_hash)



# Load the generated SHA-256 hash
with open("../encryption/data_hash.txt", "r") as file:
    sha256_hash = file.read().strip()

# Define API endpoint (Replace with actual backend URL if needed) 
backend_api_url = "http://localhost:5000/api/store-land-record"

# Prepare payload to send
payload = {"hash": sha256_hash}

# Send the hash to the backend API
try:
    response = requests.post(backend_api_url, json=payload)
    
    if response.status_code == 200:
        print("✅ Hash successfully sent to backend!")
    else:
        print("❌ Failed to send hash. Response:", response.text)

except Exception as e:
    print("❌ Error:", str(e))
