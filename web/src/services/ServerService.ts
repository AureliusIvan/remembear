import {Notify} from "@/services/NotificationService";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * @description Defines a set of properties that can be used to describe an action.
 * 
 * The properties are:
 * 
 * - `type`: optional, allows a string value;
 * - `title`: optional, allows a string value;
 * - `body`: optional, allows a string value;
 * - `at`: optional, allows a string value;
 * 
 * This interface is designed to provide a structure for actions that require additional
 * information beyond just the type of action. The presence or absence of these
 * properties can be controlled by using optional types.
 */
interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

/**
 * @description Defines a type that consists of two properties: `message` and `action`.
 * 
 * The `message` property is a string that represents the payload's message.
 * 
 * The `action` property, which is optional (indicated by the `?` symbol), is an array
 * of `actionType` objects.
 */
interface askPayloadType {
  message: string,
  action?: actionType[]
}

/**
 * @description Sends a GET request to a server, retrieves a JSON response, and parses
 * it into a payload. It then executes actions specified in the payload, which may
 * include notifications with specific titles, bodies, and timestamps. If an error
 * occurs, it logs the error to the console.
 * 
 * @param {string} prompt - Used as part of the URL query.
 * 
 * @returns {object} Parsed payload from JSON response if parsing was successful and
 * no error occurred. If an error occurs during fetching, parsing or execution, it
 * will return null.
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

    return payload;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}


/**
 * @description Retrieves memories from a server, checks for network errors, parses
 * the response payload to JSON, and reverses the resulting array before returning
 * it. If an error occurs during this process, it logs the error to the console.
 * 
 * @returns {string[]} A reverse order array of JSON-parsed payload received from the
 * server.
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