import {Notify} from "@/services/NotificationService";
import type {actionType} from "@/data/interface/chat.interface";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * @description Defines an object type with two properties: `message` and `action`.
 * 
 * The `message` property is required and has the type `string`, indicating that it
 * must be a string value.
 * 
 * The `action` property is optional and has the type `actionType[]`, indicating that
 * it can be either null or an array of objects with the type `actionType`.
 */
interface askPayloadType {
  message: string,
  action?: actionType[]
}

/**
 * @description Retrieves a response from a server based on a given prompt, parses
 * the response as JSON, and executes actions if present, including sending notifications
 * if an action has a specified timestamp.
 * 
 * @param {string} prompt - Used to send a request to the server.
 * 
 * @returns {askPayloadType} Parsed from JSON payload received from a fetch request.
 * If an error occurs during the execution, it logs an error and returns null.
 */
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


/**
 * @description Retrieves a list of memories from a server, parses the response as
 * JSON, checks for network errors, and reverses the list before returning it. It
 * catches any exceptions and logs them to the console if an error occurs.
 * 
 * @returns {string[]} An array of strings, reversed from the original order.
 */
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
  getMemories
}