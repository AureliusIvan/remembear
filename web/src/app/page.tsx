"use client"

import React from 'react'
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ask} from "@/services/ServerService";
import {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form"
import {getObject, setObject} from "@/services/HistoryService";
import {ScrollArea} from "@/components/ui/scroll-area"
import {useToast} from "@/components/ui/use-toast";
import {BiSolidSend} from "react-icons/bi";
import {Keyboard} from "@capacitor/keyboard";

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
export default function Home(): React.ReactElement {
  const {toast} = useToast()
  const [chat, setChat] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<Inputs>()
  const chatHistoryRef = React.useRef<HTMLDivElement>(null)

  /**
   * @description Scrolls a scrollable element into view at its bottom position with a
   * smooth animation, ensuring the content is fully visible to the user. It uses the
   * `scrollIntoView` method and the `behavior: "smooth"` option for a seamless scrolling
   * experience.
   */
  const scrollToBottom = () => {
    chatHistoryRef.current?.scrollIntoView({behavior: "smooth"})
  }


  /**
   * @description Handles user prompts by setting the UI to loading state, resetting
   * previous chat history, and sending the prompt to a model for response. It then
   * updates the chat history with the response or an error message, and finally sets
   * the UI back to non-loading state.
   *
   * @param {string} prompt - Used to send a message to be answered by the model.
   *
   * @returns {Promise<void>} Implicitly returned when the function completes its execution
   * without explicitly returning a value.
   */
  const handleAsk = async (prompt: string): Promise<void> => {
    scrollToBottom()
    setIsLoading(true)
    reset()
    setChat(prevChat => [...prevChat,
      {role: "user", message: prompt}]
    );
    try {
      const reply = await ask(prompt)
      if (reply) {
        setChat(prevChat => {
          // Updates an array by appending a new object.

          // Appends new chat item.

          return [...prevChat, {role: "model", message: reply.message}];
        });
      }
    } catch (Error) {
      console.error(Error)
      toast({
        title: "Cannot invoke Bear :("
      })
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
       * @returns {Promise<void>} Assigned to the state variable 'chat' after parsing JSON data
       * into an array of objects conforming to the `Chat` interface.
       */
      const fetchHistory = async (): Promise<void> => {
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


  useEffect(() => {
    // Displays a toasting message when errors exist.

    if (errors.prompt) {
      toast({
        title: "Please enter a prompt"
      })
    }
  }, [errors.prompt]);

  useEffect(() => {
    // Sets keyboard accessory bar visibility.

    // check if keyboard is in web

    // Keyboard.setAccessoryBarVisible({isVisible: true});
  }, [Keyboard]);


  const onSubmit: SubmitHandler<Inputs> = (data) => handleAsk(data.prompt)

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
      >
        <main className="flex h-[80vh] flex-col items-center justify-between">

          {/* chat bubble */}
          <ScrollArea className={"w-full h-[120vh] px-6"}>
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


            {/* status loading */}
            {isLoading && (
                <div className={""}>
                  Loading...
                </div>
            )}

            {/*spacer*/}
            <div
                className={'m-[10vh]'}/>

            {/* mark bottom chat */}
            <div
                ref={chatHistoryRef}
            />
          </ScrollArea>


          {/* type area */}
          <section className={"flex flex-row gap-[10px] w-full fixed bottom-0 p-6"}>
            <Textarea
                id={"prompt"}
                className={"w-full"}
                placeholder={"Enter message here"}
                cols={20}
                aria-invalid={errors.prompt ? "true" : "false"}
                {...register("prompt", {required: true, maxLength: 250})}
            >
            </Textarea>

            <Button
                type={"submit"}
            >
              <BiSolidSend/>
            </Button>
          </section>

        </main>
      </form>
  );
}
