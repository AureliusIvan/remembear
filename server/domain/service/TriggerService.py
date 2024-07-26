from datetime import datetime
import json
import re


class TriggerService:
    def __init__(self):
        return

    @staticmethod
    def parse(raw_message: str) -> list:
        """
        :param raw_message: String
        :return: tuple
        """
        try:
            data = json.loads(extract_json(raw_message))
            actions = data.get("action", [])
            parsed_actions = []
            for action in actions:
                if action.get("type") == "notification":
                    parsed_action = {
                        "type": action.get("type"),
                        "title": action.get("title"),
                        "body": action.get("body"),
                        "at": datetime.strptime(action.get("at"), "%Y-%m-%dT%H:%M:%S") if action.get("at") else None
                    }
                    parsed_actions.append(parsed_action)
            return parsed_actions
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing message: {e}")
            return None


def extract_json(input_str):
    # Use regular expressions to find the JSON part
    json_match = re.search(r'\{.*\}', input_str)
    if json_match:
        json_str = json_match.group(0)
        try:
            json_obj = json.loads(json_str)  # This will parse the JSON to ensure it's valid
            return json.dumps(json_obj, indent=4)  # Convert back to a formatted JSON string
        except json.JSONDecodeError:
            return "Invalid JSON detected."
    else:
        return "No JSON found in the input."
