import os
import httpx
import backoff
import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
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
@router.get("/ask/stream/{prompt}", tags=['remember'])
async def ask_stream(prompt: str):
    """
    Test streaming endpoint that simulates streaming response
    """
    import asyncio
    
    async def generate():
        # Simulate streaming response with test data
        test_response = {"message": f"Hello! You said: {prompt}. This is a streaming test response.", "action": []}
        
        # Split the message into chunks to simulate streaming
        message = test_response["message"]
        words = message.split()
        
        current_text = ""
        for word in words:
            current_text += word + " "
            yield f"data: {json.dumps({'type': 'partial', 'message': current_text.strip(), 'action': [], 'code': 200})}\n\n"
            await asyncio.sleep(0.1)  # Simulate typing delay
        
        # Send final complete message
        yield f"data: {json.dumps({'type': 'complete', 'message': current_text.strip(), 'action': test_response['action'], 'code': 200})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/plain", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    })


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.get("/memory/get")
async def get_memory():
    ai = RememberService()
    response = ai.get_memories("1")
    return response
