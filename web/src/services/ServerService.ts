import {Notify} from "@/services/NotificationService";
import type {actionType} from "@/data/interface/chat.interface";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface askPayloadType {
  message: string,
  action?: actionType[]
}

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