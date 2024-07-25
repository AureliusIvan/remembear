import os
from openai import OpenAI
from mem0 import Memory
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
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
            You are a personal assistant named Bear who will communicate using the Indonesian language.
            You will help the user remember every event and thing they talk about.
            Do not display memory explicitly to the user.
            Do not display memory that is not requested. 
            """,
        )
        self.app_id = "app-1"
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
            # "output: ",
        ])

        answer = response.text
        self.messages.append({
            "role": "user",
            "parts": [
                prompt
            ],
        })

        self.messages.append({
            "role": "model",
            "parts": [
                answer
            ],
        })

        # Store the question in memory
        self.memory.add(question, user_id=user_id)

        return dict({
            "message": answer
        })

    def get_memories(self, user_id):
        memories = self.memory.get_all(user_id=user_id)
        return [m['text'] for m in memories]

    def search_memories(self, query, user_id):
        memories = self.memory.search(query, user_id=user_id)
        return [m['text'] for m in memories]
