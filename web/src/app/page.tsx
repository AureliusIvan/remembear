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


export default function Home() {
  const [chat, setChat] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Inputs>()

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
    if (chat.length > 0) {
      setObject("chat-history",
          {
            data: JSON.stringify(chat)
          })
    } else {
      const fetchHistory = async () => {
        const data = await getObject("chat-history").then(data => {
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
