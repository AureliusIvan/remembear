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
@router.get("/ask/mcp/{prompt}", tags=['remember'])
async def ask_with_mcp(prompt: str):
    """
    Ask with MCP (Model Context Protocol) support for tool calling - Test Version
    """
    from server.domain.service.MCPService import mcp_server
    
    # Simple test response that demonstrates MCP functionality
    response_message = f"Hello! You asked: {prompt}"
    tool_results = []
    
    # Check if the prompt requires tools
    if 'time' in prompt.lower() or 'waktu' in prompt.lower():
        tool_result = await mcp_server.call_tool('get_current_time', {'format': 'readable'})
        if tool_result.get('success'):
            current_time = tool_result['result']['current_time']
            response_message += f"\n\nCurrent time: {current_time}"
            tool_results.append({
                "tool": "get_current_time",
                "result": tool_result['result']
            })
    
    if any(op in prompt.lower() for op in ['+', '-', '*', '/', 'calculate', 'hitung']):
        # Extract mathematical expression (simplified)
        import re
        math_pattern = r'(\d+\s*[\+\-\*/]\s*\d+(?:\s*[\+\-\*/]\s*\d+)*)'
        match = re.search(math_pattern, prompt)
        if match:
            expression = match.group(1)
            tool_result = await mcp_server.call_tool('calculate', {'expression': expression})
            if tool_result.get('success'):
                result = tool_result['result']['result']
                response_message += f"\n\nCalculation result: {expression} = {result}"
                tool_results.append({
                    "tool": "calculate",
                    "result": tool_result['result']
                })
    
    if 'weather' in prompt.lower() or 'cuaca' in prompt.lower():
        location = "Jakarta"  # Default location
        tool_result = await mcp_server.call_tool('get_weather', {'location': location})
        if tool_result.get('success'):
            weather = tool_result['result']
            response_message += f"\n\nWeather in {location}: {weather['condition']}, {weather['temperature']}"
            tool_results.append({
                "tool": "get_weather",
                "result": tool_result['result']
            })
    
    if 'note' in prompt.lower() or 'catatan' in prompt.lower():
        title = "Test Note"
        content = prompt
        tool_result = await mcp_server.call_tool('create_note', {'title': title, 'content': content})
        if tool_result.get('success'):
            response_message += f"\n\nNote created: {tool_result['result']['message']}"
            tool_results.append({
                "tool": "create_note",
                "result": tool_result['result']
            })
    
    # Create actions array
    actions = []
    if tool_results:
        actions.append({
            "type": "tool_calls",
            "title": "MCP Tool Results",
            "body": f"Executed {len(tool_results)} tool(s)",
            "results": tool_results
        })
    
    return {
        "message": response_message,
        "action": actions,
        "tool_results": tool_results,
        "code": 200
    }


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.get("/mcp/tools", tags=['remember'])
async def get_mcp_tools():
    """
    Get available MCP tools
    """
    from server.domain.service.MCPService import mcp_server
    return {
        "tools": mcp_server.get_available_tools(),
        "schema": mcp_server.get_tool_schema()
    }


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.post("/mcp/call/{tool_name}", tags=['remember'])
async def call_mcp_tool(tool_name: str, parameters: dict = None):
    """
    Call a specific MCP tool
    """
    from server.domain.service.MCPService import mcp_server
    result = await mcp_server.call_tool(tool_name, parameters or {})
    return result


@backoff.on_exception(backoff.expo, httpx.RequestError, max_time=60)
@router.get("/memory/get")
async def get_memory():
    ai = RememberService()
    response = ai.get_memories("1")
    return response
