import {Notify} from "@/services/NotificationService";
import type {actionType} from "@/data/interface/chat.interface";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface askPayloadType {
  message: string,
  action?: actionType[]
}

async function askStream(prompt: string, onChunk: (chunk: any) => void) {
  try {
    const response = await fetch(
        `${SERVER_URL}/ask/stream/${encodeURIComponent(prompt + ", current_datetime: " + new Date(Date.now()).toISOString())}`,
        {
          method: 'GET'
        }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error("No reader available");
    }

    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      // Parse Server-Sent Events
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
            
            // Execute actions if complete
            if (data.type === 'complete' && data.action) {
              for (const action of data.action) {
                if (action.at) {
                  Notify(action.title, action.body, new Date(action.at.toString()));
                }
              }
            }
          } catch (error) {
            console.error("Error parsing chunk:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming error: ", error);
    throw error;
  }
}

async function askWithMCP(prompt: string) {
  try {
    const response = await fetch(
        `${SERVER_URL}/ask/mcp/${encodeURIComponent(prompt + ", current_datetime: " + new Date(Date.now()).toISOString())}`,
        {
          method: 'GET'
        }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    // parse payload to json
    const payload: askPayloadType & {tool_results?: any[]} = await response.json();

    // execute actions
    if (payload.action) {
      for (const action of payload.action) {
        if (action.at) {
          // leave it without wait, or else the notif won't work
          Notify(action.title,
              action.body,
              new Date(action.at.toString())
          );
        }
      }
    }
    console.log("MCP Response:", payload)
    return payload;
  } catch (error) {
    console.error("MCP Fetch error: ", error);
  }
}

async function getMCPTools() {
  try {
    const response = await fetch(`${SERVER_URL}/mcp/tools`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const payload = await response.json();
    return payload;
  } catch (error) {
    console.error("MCP Tools fetch error: ", error);
  }
}

async function callMCPTool(toolName: string, parameters: any = {}) {
  try {
    const response = await fetch(`${SERVER_URL}/mcp/call/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameters)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const payload = await response.json();
    return payload;
  } catch (error) {
    console.error("MCP Tool call error: ", error);
  }
}

async function ask(prompt: string) {
  try {
    const response = await fetch(
        `${SERVER_URL}/ask/${prompt} + ", current_datetime: " + ${new Date(Date.now()).toISOString()}`,
        {
          method: 'GET'
        }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    // parse payload to json
    const payload: askPayloadType = await response.json();

    // execute actions
    if (payload.action) {
      for (const action of payload.action) {
        if (action.at) {
          // leave it without wait, or else the notif won't work
          Notify(action.title,
              action.body,
              new Date(action.at.toString())
          );
        }
      }
    }
    console.log(payload)
    return payload;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}


async function getMemories() {
  try {
    const response = await fetch(`${SERVER_URL}/memory/get`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    // parse payload to json
    const payload: string[] = await response.json();

    // reverse
    return payload.reverse();

  } catch (error) {
    console.error("Fetch error: ", error);
  }
}


export type {
  askPayloadType,
  actionType
}

export {
  ask,
  askStream,
  askWithMCP,
  getMCPTools,
  callMCPTool,
  getMemories
}