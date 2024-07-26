from datetime import datetime
import json
import re


class TriggerService:
    """
    Parses a given message and extracts specific data from it. It checks if the
    message contains an "action" key with a list of actions, then processes each
    action to extract its type, title, body, and timestamp (if present). The
    processed actions are returned as a list.

    """
    def __init__(self):
        return

    @staticmethod
    def parse(message: str):
        """
        :param message: String
        :return: list
        """
        try:
            data = json.loads(extract_json(message))
            print(data)
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
    """
    Searches for a JSON string within an input string, decodes it if valid, and
    returns the decoded JSON as a formatted string with indentation. If the input
    contains invalid JSON or no JSON at all, it returns an error message accordingly.

    Args:
        input_str (str): Expected to be a string containing potentially a JSON
            object within it, possibly with other text or characters around it.

    Returns:
        str|InvalidJSONdetected|NoJSONfoundintheinput: A) a formatted JSON string
        if the input contains valid JSON, b) "Invalid JSON detected." if the JSON
        is invalid, or c) "No JSON found in the input." if no JSON is present.

    """
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
