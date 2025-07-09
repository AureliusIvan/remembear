"""
MCP (Model Context Protocol) Server Implementation
Provides tools and resources for the LLM to interact with
"""

import json
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
import os
import subprocess


class MCPTool:
    """Base class for MCP tools"""
    
    def __init__(self, name: str, description: str, parameters: Dict[str, Any] = None):
        self.name = name
        self.description = description
        self.parameters = parameters or {}
    
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """Execute the tool with given parameters"""
        raise NotImplementedError
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tool to dictionary representation"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }


class TimeTool(MCPTool):
    """Tool to get current time"""
    
    def __init__(self):
        super().__init__(
            name="get_current_time",
            description="Get the current date and time",
            parameters={
                "type": "object",
                "properties": {
                    "format": {
                        "type": "string",
                        "description": "Time format (default: ISO)",
                        "enum": ["ISO", "readable"]
                    }
                }
            }
        )
    
    async def execute(self, format: str = "ISO") -> Dict[str, Any]:
        now = datetime.now()
        if format == "readable":
            time_str = now.strftime("%Y-%m-%d %H:%M:%S")
        else:
            time_str = now.isoformat()
        
        return {
            "success": True,
            "result": {
                "current_time": time_str,
                "timestamp": now.timestamp()
            }
        }


class CalculatorTool(MCPTool):
    """Tool for basic calculations"""
    
    def __init__(self):
        super().__init__(
            name="calculate",
            description="Perform basic mathematical calculations",
            parameters={
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate (e.g., '2 + 3 * 4')"
                    }
                },
                "required": ["expression"]
            }
        )
    
    async def execute(self, expression: str) -> Dict[str, Any]:
        try:
            # Basic safety check - only allow safe mathematical operations
            allowed_chars = set('0123456789+-*/.() ')
            if not all(c in allowed_chars for c in expression):
                return {
                    "success": False,
                    "error": "Expression contains invalid characters"
                }
            
            # Evaluate the expression
            result = eval(expression)
            
            return {
                "success": True,
                "result": {
                    "expression": expression,
                    "result": result
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Calculation error: {str(e)}"
            }


class WeatherTool(MCPTool):
    """Tool to get weather information (mock implementation)"""
    
    def __init__(self):
        super().__init__(
            name="get_weather",
            description="Get weather information for a location",
            parameters={
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "Location to get weather for"
                    }
                },
                "required": ["location"]
            }
        )
    
    async def execute(self, location: str) -> Dict[str, Any]:
        # Mock weather data - in real implementation, this would call a weather API
        mock_weather = {
            "location": location,
            "temperature": "22°C",
            "condition": "Partly cloudy",
            "humidity": "65%",
            "wind": "5 km/h"
        }
        
        return {
            "success": True,
            "result": mock_weather
        }


class NoteTool(MCPTool):
    """Tool to create and manage notes"""
    
    def __init__(self):
        super().__init__(
            name="create_note",
            description="Create a note with title and content",
            parameters={
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Note title"
                    },
                    "content": {
                        "type": "string",
                        "description": "Note content"
                    }
                },
                "required": ["title", "content"]
            }
        )
    
    async def execute(self, title: str, content: str) -> Dict[str, Any]:
        # In a real implementation, this would save to a database
        note = {
            "id": f"note_{datetime.now().timestamp()}",
            "title": title,
            "content": content,
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "result": {
                "message": f"Note '{title}' created successfully",
                "note": note
            }
        }


class MCPServer:
    """MCP Server that manages tools and handles requests"""
    
    def __init__(self):
        self.tools: Dict[str, MCPTool] = {}
        self.register_default_tools()
    
    def register_default_tools(self):
        """Register default tools"""
        default_tools = [
            TimeTool(),
            CalculatorTool(),
            WeatherTool(),
            NoteTool()
        ]
        
        for tool in default_tools:
            self.register_tool(tool)
    
    def register_tool(self, tool: MCPTool):
        """Register a new tool"""
        self.tools[tool.name] = tool
    
    def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools"""
        return [tool.to_dict() for tool in self.tools.values()]
    
    async def call_tool(self, name: str, parameters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Call a tool by name with parameters"""
        if name not in self.tools:
            return {
                "success": False,
                "error": f"Tool '{name}' not found"
            }
        
        tool = self.tools[name]
        try:
            result = await tool.execute(**(parameters or {}))
            return result
        except Exception as e:
            return {
                "success": False,
                "error": f"Tool execution error: {str(e)}"
            }
    
    def get_tool_schema(self) -> Dict[str, Any]:
        """Get schema for all tools in OpenAI function calling format"""
        functions = []
        for tool in self.tools.values():
            functions.append({
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.parameters
            })
        return {"functions": functions}


# Global MCP server instance
mcp_server = MCPServer()