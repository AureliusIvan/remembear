import {Notify} from "@/services/NotificationService";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * @description Defines a set of optional properties for an object, namely:
 * 
 * type: A string property that can be optionally provided.
 * title: A string property that can be optionally provided.
 * body: A string property that can be optionally provided.
 * at: A string property that can be optionally provided.
 */
interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

/**
 * @description Defines an object with two properties: `message` and `action`.
 * 
 * The `message` property is required and has a type of `string`, which means it must
 * be a string value.
 * 
 * The `action` property is optional (denoted by the `?`) and has a type of `actionType[]`,
 * which implies that it can either be an empty array or an array of values of type
 * `actionType`.
 */
interface askPayloadType {
  message: string,
  action?: actionType[]
}

/**
 * @description Sends a GET request to a server with a given prompt and current
 * date/time, parses the response as JSON, and if successful, executes notifications
 * for any actions specified in the payload.
 * 
 * @param {string} prompt - Used to send a request to a server.
 * 
 * @returns {object} An instance of `askPayloadType`. The returned payload may include
 * information such as notification actions and their corresponding dates.
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

    if (payload.action) {
      for (const action of payload.action) {
        if (action.at) {
          await Notify(action.title,
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
 * @description Makes a GET request to a server to retrieve memories, parses the
 * response payload as JSON, and reverses the resulting array if successful; it catches
 * and logs any errors that occur during the process.
 * 
 * @returns {string[]} Reversed version of the response payload received from the
 * server after a successful GET request.
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