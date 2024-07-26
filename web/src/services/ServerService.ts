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
    const response = await fetch(`${SERVER_URL}/ask/${prompt} + ", current_datetime: " + ${new Date(Date.now()).toISOString()}`, {
      method: 'GET',
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    // parse payload to json
    const payload: askPayloadType = await response.json();

    if (payload.action) {
      console.log("date now is ", new Date(Date.now()).toISOString())
      for (const action of payload.action) {
        console.log("date at is ", action.at)
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