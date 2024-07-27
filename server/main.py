import os

from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
from server import models
from server.database import engine

from server.routers import users
from server.routers import remember

load_dotenv(find_dotenv())

models.Base.metadata.create_all(bind=engine)

#
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     redis_connection = redis.from_url(
#         "rediss://default:AVNS_FbH1Ibc7xm3hpFGXlJy@private-db-redis-sgp1-96387-remembear-do-user-11214969-0.f.db.ondigitalocean.com:25061",
#         encoding="utf-8", decode_responses=True)
#     await FastAPILimiter.init(redis_connection)
#     try:
#         yield
#     finally:
#         await redis_connection.disconnect()  # Close the entire pool


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
