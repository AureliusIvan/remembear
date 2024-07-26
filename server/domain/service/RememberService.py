import os
from mem0 import Memory
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

        self.memory = Memory.from_config(config)
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
                parsed_response['message']
            ],
        })

        # Store the question in memory
        self.memory.add(question, user_id=user_id)

        return dict({
            "message": parsed_response['message'],
            "action": parsed_response['action'],
            "code": 200
        })

    def get_memories(self, user_id):
        memories = self.memory.get_all(user_id=user_id)
        return [m['text'] for m in memories]

    def search_memories(self, query, user_id):
        memories = self.memory.search(query, user_id=user_id)
        return [m['text'] for m in memories]


def extract_message(text):
    """Extracts the message from a text string using regular expressions."""
    pattern = r'^([^\{]+)'
    match = re.match(pattern, text)
    if match:
        return match.group(1).strip()
    else:
        return text  # Return None if no match is found
