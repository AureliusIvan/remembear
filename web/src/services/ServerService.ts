const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface askPayload {
  message: String
}

async function ask(prompt: string) {
  try {
    let response = await fetch(SERVER_URL + "/ask/" + prompt);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let payload = await response.json();
    return payload as askPayload;
  } catch (error) {
    console.error("Fetch error: ", error);
  }

}

export type {
  askPayload
}

export {
  ask
}