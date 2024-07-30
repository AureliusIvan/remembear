"use client"

import React from 'react'
import {Button} from "@/components/ui/button";
import {ask} from "@/services/ServerService";
import {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form"
import {getObject, setObject} from "@/services/HistoryService";
import {ScrollArea} from "@/components/ui/scroll-area"
import {useToast} from "@/components/ui/use-toast";
import {BiSolidSend} from "react-icons/bi";
import {Input} from "@/components/ui/input";


type Inputs = {
  prompt: string
}

type Action = {
  actionType: 'reminder' | 'notion'
  description: string
}

type Chat = {
  role: "user" | "model"
  message: string
  action?: Action[]
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
  /**
   * @description Constants
   */
  const CHAT_HISTORY_OBJ_KEY = "chat-history"

  /**
   * @description State variables
   */
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

  // function to scroll to bottom (used to scroll to the bottom of the chat)
  /**
   * @description Scrolls a chat history element into view smoothly, bringing it to the
   * bottom of the viewport when called. It uses the `scrollIntoView` method with an
   * optional `behavior` parameter set to `"smooth"` for a smooth scrolling effect.
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
    /**
     * @description Scrolls to the bottom of the chat history, sets the loading state to
     * `true`, resets the form, and adds the user chat to the chat history. It then invokes
     * the model, and updates the chat history with the model's response or an error message,
     * and sets the loading state back to `false`.
     *
     * @returns {Promise<void>} Implicitly returned when the function completes its execution
     * without explicitly returning a value.
     */
    scrollToBottom()
    setIsLoading(true)
    reset()

    // add user chat to the chat history
    setChat(prevChat =>
        [...prevChat,
          {
            role: "user",
            message: prompt
          }]
    )

    const userNewChatHistory = [...chat, {role: 'user', message: prompt}]
    setObject(
        CHAT_HISTORY_OBJ_KEY,
        {
          data: JSON.stringify(userNewChatHistory)
        })
        .then(() => {
          // Logs a message to the console.

          console.log("chat saved")
        })
        .catch((error) => {
          // Logs errors to the console.

          console.error(error)
        })

    // invoke the model and save the response to the chat history
    try {
      const reply = await ask(prompt)
      if (reply) {
        const modelNewChatHistory = [...userNewChatHistory, {role: 'model', message: reply.message}]
        setChat((prevChat: Chat[]) => {
          // Modifies an array of chat objects.

          // Appends new chat item.
          return [...prevChat,
            {
              role: "model",
              message: reply.message,
              action: [{
                actionType: 'reminder',
                description: 'reminder to do something'
              }]
            }
          ];
        });

        setObject(
            CHAT_HISTORY_OBJ_KEY,
            {
              data: JSON.stringify(modelNewChatHistory)
            })
            .then(() => {
              // Logs "chat saved" to the console.

              console.log("chat saved")
            })
            .catch((error) => {
              // Logs error messages.

              console.error(error)
            })
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

  // useEffect List
  useEffect(() => {
    // Scrolls to bottom on component mount.

    // scroll to bottom when chat at initial loads
    scrollToBottom()
  }, []);

  useEffect(() => {
    // Initializes and updates chat history state.

    /**
     * Initializes and updates chat history state.
     * @description Asynchronously retrieves chat history from storage, parses it as a
     * JSON object, and updates the `chat` state with the retrieved data.
     *
     * @returns {Promise<void>} Assigned to the state variable 'chat' after parsing JSON data
     * into an array of objects conforming to the `Chat` interface.
     */
    const fetchHistory = async (): Promise<void> => {
      const data = await getObject(CHAT_HISTORY_OBJ_KEY).then(data => {
        // Parses chat history data.

        // Retrieves and parses chat history.
        try {
          if (data && data.data) {
            return JSON.parse(data.data) as Chat[]
          }
          return []
        } catch (e) {
          console.error(e);
          return []
        }
      })
      setChat(data)
    };

    fetchHistory()
  }, []);

  // handler for input errors
  useEffect(() => {
    // Displays an error message.

    if (errors.prompt) {
      toast({
        title: "Please enter a prompt"
      })
    }
  }, [errors.prompt]);


  // form submit handler
  const onSubmit: SubmitHandler<Inputs> = (data) => handleAsk(data.prompt)

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
      >
        <main className="flex h-[80vh] flex-col items-center justify-between">

          {/* chat bubble */}
          <ScrollArea className={"w-full h-[120vh] px-6"}>
            {chat.map((data: Chat, index: number) => {
              // Maps an array of chat data and renders each item as a message component.

              // Maps over a chat array and renders a message for each item.

              const isUser = data.role === "user"; // Check if the message is from the user

              return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
                    <div
                        className={`
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
                <div className={`flex 'justify-start my-2`}>
                  <div
                      className={`
                      bg-gray-200 
                      text-gray-800
                      p-2 rounded-lg max-w-xs
                      rounded-bl-none
                      `}
                  >
                    Loading...
                  </div>
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


          {/**
           * @description Renders a text area for user input and a button to submit the
           * message. The text area is registered with the `react-hook-form` library and
           * displays an error message if the user does not enter a prompt.
           */}
          <section className={"flex flex-row gap-[10px] w-full fixed bottom-0 p-6"}>
            <Input
                type={"text"}
                onFocusCapture={scrollToBottom}
                id={"prompt"}
                className={"w-full h-fit resize-y"}
                placeholder={"Enter message here"}
                aria-invalid={errors.prompt ? "true" : "false"}
                {...register("prompt", {required: true, maxLength: 250})}
            >
            </Input>

            {/* Submit Button */}
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
