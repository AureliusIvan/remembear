import os
import httpx
import backoff

from fastapi import APIRouter
from server.domain.service.RememberService import RememberService

router = APIRouter()


@router.get("/hello/{name}", tags=['remember'])
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.get("/ask/{prompt}", tags=['remember'])
async def ask(prompt: str):
    ai = RememberService()
    response = await ai.ask(prompt)
    return response


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.get("/memory/get")
async def get_memory():
    ai = RememberService()
    response = ai.get_memories("1")
    return response
