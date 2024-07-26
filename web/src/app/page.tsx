"use client"

import React from 'react'
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ask} from "@/services/ServerService";
import {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form"
import {getObject, setObject} from "@/services/HistoryService";
import {ScrollArea} from "@/components/ui/scroll-area"

``
type Inputs = {
  prompt: string
}

type Chat = {
  role: "user" | "model"
  message: string
}


/**
 * @description Renders a chat interface, allowing users to submit prompts and receive
 * responses from a model. It displays a list of chat messages with user input on the
 * right and model output on the left. The UI updates in real-time as new messages
 * are added or fetched from local storage.
 * 
 * @returns {React.ReactElement} A JSX element representing the home page component
 * with a chat interface and a form to send messages.
 */
export default function Home() {
  const [chat, setChat] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Inputs>()

  /**
   * @description Handles user prompts by setting the UI to loading state, resetting
   * previous chat history, and sending the prompt to a model for response. It then
   * updates the chat history with the response or an error message, and finally sets
   * the UI back to non-loading state.
   * 
   * @param {string} prompt - Used to send a message to be answered by the model.
   * 
   * @returns {undefined} Implicitly returned when the function completes its execution
   * without explicitly returning a value.
   */
  const handleAsk = async (prompt: string) => {
    setIsLoading(true)
    reset()
    setChat(prevChat => [...prevChat,
      {role: "user", message: prompt}]
    );
    try {
      const reply = await ask(prompt)
      if (reply) {
        setChat(prevChat => {
          // Concatenates new chat items.

          // Appends new chat item.

          return [...prevChat, {role: "model", message: reply.message}];
        });
      }
    } catch (Error) {
      console.log(Error)
    } finally {
      console.log(chat)
      setIsLoading(false)
    }
  }


  useEffect(() => {
    // Initializes and updates chat history state.

    // Initializes and updates chat history state.

    if (chat.length > 0) {
      setObject("chat-history",
          {
            data: JSON.stringify(chat)
          })
    } else {
      /**
       * @description Asynchronously retrieves chat history from storage, parses it as a
       * JSON object, and updates the `chat` state with the retrieved data.
       * 
       * @returns {undefined} Assigned to the state variable 'chat' after parsing JSON data
       * into an array of objects conforming to the `Chat` interface.
       */
      const fetchHistory = async () => {
        const data = await getObject("chat-history").then(data => {
          // Retrieves and parses chat history.

          // Retrieves and parses chat history.

          return JSON.parse(data.data) as Chat[]
        })
        setChat(data)
      };
      fetchHistory()
    }
  }, [chat]);

  const onSubmit: SubmitHandler<Inputs> = (data) => handleAsk(data.prompt)

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
      >
        <main className="flex h-full flex-col items-center justify-between p-6">


          {/* chat bubble */}
          <ScrollArea className={"w-full h-[75vh]"}>
            {chat.map((data: Chat, index: number) => {
              // Renders chat messages.

              // Maps over a chat array and renders a message for each item.

              const isUser = data.role === "user"; // Check if the message is from the user

              return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
                    <div className={`
            ${isUser ? 'bg-blue-500' : 'bg-gray-200'} 
            ${isUser ? 'text-white' : 'text-gray-800'}
            p-2 rounded-lg max-w-xs
            ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}
          `}
                    >
                      {data.message}
                    </div>
                  </div>
              );
            })}
          </ScrollArea>

          {/* status loading */}
          {isLoading && (
              <div className={""}>
                Loading...
              </div>
          )}

          {/*<Progress value={isLoading}/>*/}

          <div className={"flex flex-row gap-[10px] w-full fixed bottom-0 p-6"}>
            <Textarea
                {...register("prompt")}
                name={"prompt"}
                className={"w-full"}
                placeholder={"Enter message here"}>
            </Textarea>
            <Button
                onClick={() => {
                  setIsLoading(true)
                }}
                type={"submit"}
            >
              send
            </Button>
          </div>


        </main>
      </form>
  );
}
