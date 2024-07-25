import os
from openai import OpenAI
from mem0 import Memory
from dotenv import load_dotenv

# dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv()

os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI client
client = OpenAI()


class RememberService:
    def __init__(self):
        """
        Initialize the PersonalAITutor with memory configuration and OpenAI client.
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
        }
        self.memory = Memory.from_config(config)
        self.client = client
        self.app_id = "app-1"
        self.messages = [{"role": "system",
                          "content": """
                          Kamu adalah asisten personal bernama bear. 
                          kamu akan membantu user meningat setiap peristiwa dan hal-hal yang diceritakan
                          """}]

    async def ask(self, question, user_id=1):
        # Fetch previous related memories
        previous_memories = self.get_memories(user_id=user_id)
        prompt = question
        if previous_memories:
            prompt = f"User input: {question}\n Previous memories: {previous_memories}"
        self.messages.append({"role": "user", "content": prompt})

        # Generate response using GPT-4o
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )
        answer = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": answer})

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
