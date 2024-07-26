import os
from mem0.memory.main import Memory
from mem0.client.main import MemoryClient
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from google.ai.generativelanguage_v1beta.types import content
import re
import json

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_schema": content.Schema(
        type=content.Type.OBJECT,
        properties={
            'message': content.Schema(
                type=content.Type.STRING,
            ),
            'action': content.Schema(
                type=content.Type.ARRAY,
                items=content.Schema(
                    type=content.Type.OBJECT,
                    properties={
                        'type': content.Schema(
                            type=content.Type.STRING,
                        ),
                        'title': content.Schema(
                            type=content.Type.STRING,
                        ),
                        'body': content.Schema(
                            type=content.Type.STRING,
                        ),
                        'at': content.Schema(
                            type=content.Type.STRING,
                        ),
                    },
                ),
            ),
        },
    ),
    "response_mime_type": "application/json",

}


# Initialize the Gemini client

class RememberService:
    """
    Provides a conversational AI assistant named Bear that helps users remember
    events and things they discuss. It uses a generative model to respond to user
    questions, stores user conversations, and allows searching of stored memories.

    Attributes:
        memory (Memory): Initialized from a configuration dictionary. It provides
            functionality to store and retrieve user memories, allowing the service
            to keep track of previous conversations and events.
        client (genaiGenerativeModel): Initialized with a specific model name,
            generation configuration, and safety settings. It represents a generative
            AI model that can generate human-like responses to user input.
        app_id (str): Assigned the value "remembear-app". Its purpose is not
            explicitly stated, but it could be used to identify the application
            or service within a larger system.
        messages (List[Dict[str,List[str]]]): Used to store chat messages between
            a user and Bear, with each message having a role (user or model) and
            one or more parts representing the content of the message.

    """

    def __init__(self):
        """
        Initialize the PersonalAI with memory configuration and Gemini client.
        """
        # in case we want to change to qdrant
        config = {
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "host": os.getenv('QDRANT_HOST'),
                    "port": os.getenv('QDRANT_PORT'),
                    "api_key": os.getenv('QDRANT_API_KEY')
                }
            },
            "llm": {
                "provider": "litellm",
                "config": {
                    "model": "gemini/gemini-1.5-flash-latest",
                    "temperature": 0.2,
                    "max_tokens": 1500
                }
            }
        }

        self.memoryType = ""
        if os.getenv('MEMORY_CLIENT'):
            self.memory = MemoryClient(api_key=os.getenv('MEMORY_CLIENT'))
            self.memoryType = "memory-client"
        else:
            self.memory = Memory.from_config(config)
            self.memoryType = "memory-server"

        self.client = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            safety_settings={
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            },
            system_instruction=
            """
            Return json format.
            You are a personal assistant named Bear who will communicate using the Indonesian language.
            You will help the user remember every event and thing they talk about.
            Do not display memory explicitly to the user.
            Do not display memory that is not requested. 
            Include this string if user wants to create notification or reminder. Assume the notification will appear on the present date, 
            example: 
            '{"message":"Oke siap! akan bear jadwalkan!",
            "action": [{"type":"notification", "title":"Pengingat Meeting", "body":"Jangan lupa meeting sekarang di Tangerang bersama Pak Rudi","at":"2024-07-26T09:00:00"}]}'
            """,
        )
        self.app_id = "remembear-app"
        self.messages = [
            {
                "role": "user",
                "parts": [
                    """
                    Kamu adalah asisten personal bernama bear (beruang) yang akan berbicara menggunakan bahasa indonesia.
                    kamu akan membantu user mengingat setiap peristiwa dan hal-hal yang diceritakan.
                    """,
                ],
            },
            {
                "role": "model",
                "parts": [
                    "halo! nama ku bear yang siap membantu kamu!"
                ],
            },
        ]

    async def ask(self, question, user_id=1):
        """
        Generate response based on prompt. Will invoke qdrant and LLM

        :param question: String
        :param user_id: Int
        :return: Dict
        """
        # Fetch previous related memories
        previous_memories = self.get_memories(user_id=user_id)

        prompt = question

        if previous_memories:
            prompt = f"User input: {question}\n Previous memories: {previous_memories}"

        response = self.client.generate_content([
            "input: " + prompt,
        ])

        parsed_response = json.loads(response.text)

        self.messages.append({
            "role": "user",
            "parts": [
                prompt
            ],
        })

        self.messages.append({
            "role": "model",
            "parts": [
                parsed_response.get('message', "")
            ],
        })

        # Store the question in memory
        self.memory.add(question, user_id=user_id)

        return dict({
            "message": parsed_response.get('message', ""),
            "action": parsed_response.get('action', []),
            "code": 200
        })

    def get_memories(self, user_id):
        """
        Retrieves all memories associated with a specified user ID from the memory
        storage and returns them as a list of text strings, filtered from the
        original data structure.

        Args:
            user_id (str): Required, as it determines which user's memories are
                retrieved from the memory storage.

        Returns:
            List[str]: A list of memory text strings, each string representing a
            single memory retrieved from the database using the provided user ID.

        """
        memories = self.memory.get_all(user_id=user_id)
        print(memories)
        if self.memoryType == 'memory-client':
            return [m['memory'] for m in memories]
        else:
            return [m['text'] for m in memories]

    def search_memories(self, query, user_id):
        """
        Searches for memories related to a given query and user ID using an internal
        memory storage component (self.memory). It returns a list of text strings
        representing the matching memories.

        Args:
            query (str | List[str]): Used to search for matching memories based
                on its content, either as a single string or a list of strings.
            user_id (int | str): Used to filter the results returned by the
                `self.memory.search(query)` method, which searches for memories
                related to the specified user ID.

        Returns:
            List[str]: A list of strings. Each string represents the text content
            of a memory retrieved from the database using the query and user_id provided.

        """
        memories = self.memory.search(query, user_id=user_id)
        if self.memoryType == 'memory-client':
            return [m['memory'] for m in memories]
        else:
            return [m['text'] for m in memories]
