import {Notify} from "@/services/NotificationService";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

interface askPayloadType {
  message: string,
  action?: actionType[]
}

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
        Notify(action.title, action.body);
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