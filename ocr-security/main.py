# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from encryption import decrypt
from ocr import ocr_api

app = FastAPI()

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # explicitly allow your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the API routers
app.include_router(decrypt.router)
app.include_router(ocr_api.router)
