import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
from server import models
from server.database import engine

from server.routers import users
from server.routers import remember

load_dotenv(find_dotenv())

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # Adjust based on your frontend's URL and port
    "http://127.0.0.1:3000",
    os.getenv('NEXT_PUBLIC_SERVER_URL')
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users)
app.include_router(remember)


@app.get("/")
async def root():
    return {"message": "hello world!"}
