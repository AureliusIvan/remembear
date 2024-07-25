from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.domain.service.RememberService import RememberService
import backoff
import httpx

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # Adjust based on your frontend's URL and port
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@app.get("/ask/{prompt}")
async def ask(prompt: str):
    ai = RememberService()
    response = await ai.ask(prompt)
    return response
