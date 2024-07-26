import {Notify} from "@/services/NotificationService";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * @description Defines a set of properties for an object that represents an action
 * type.
 * 
 * Specify: The interface has an optional property named `type`, which can be a string.
 * 
 * Specify: The interface also has an optional property named `title`, which can be
 * a string.
 * 
 * Define: The interface includes an optional property named `body`, which can be a
 * string.
 * 
 * Specify: Finally, the interface defines an optional property named `at`, which can
 * be a string.
 */
interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

/**
 * @description Defines an object with two properties.
 * 
 * It has a required property `message`, which is expected to be of type `string`.
 * 
 * Additionally, it may have an optional property `action`, which is expected to be
 * an array of objects conforming to the `actionType` type.
 */
interface askPayloadType {
  message: string,
  action?: actionType[]
}

/**
 * @description Sends a GET request to a server with a provided prompt, parses the
 * response as JSON, and if the response is valid, extracts an array of actions from
 * the payload, notifies each action by title, body, and timestamp using the `Notify`
 * function, and returns the parsed payload.
 * 
 * @param {string} prompt - Intended to be used as a query string in an HTTP request.
 * 
 * @returns {askPayloadType} Parsed JSON payload from the server's response. If no
 * error occurs during execution, this payload contains actions with title, body and
 * timestamp.
 */
async function ask(prompt: string) {
  try {
    const response = await fetch(`${SERVER_URL}/ask/${prompt}`, {
      method: 'GET',
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    // parse payload to json
    const payload: askPayloadType = await response.json();

    if (payload.action) {
      for (const action of payload.action) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        Notify(action.title, action.body, new Date(action.at));
      }
    }
    return payload;

  } catch (error) {
    console.error("Fetch error: ", error);
  }

}

export type {
  askPayloadType,
  actionType
}

export {
  ask
}