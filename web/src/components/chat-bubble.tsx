import React from "react"

import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge";
import {IoPlayCircleOutline} from "react-icons/io5";

import type {ChatType} from "@/data/interface/chat.interface";

const ChatBubble = ({isUser, data}: { isUser: boolean, data: ChatType }) => {
  return (
      <div className={
        cn(`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`,)
      }>
        <div
            className={`
                        ${isUser ? 'bg-blue-500' : 'bg-gray-200'} 
                        ${isUser ? 'text-white' : 'text-gray-800'} 
                        p-2 rounded-lg max-w-xs
                        ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}
                        space-y-1.5
                        `}
        >
          <div>
            {data.message}
          </div>

          {/**
           * @description Map over the action array and render a badge for each action
           */}
          <div className={'flex gap-2 flex-wrap'}>
            {data?.action &&
                data.action.length > 0 &&
                data.action.map((action, index) => {
                  /**
                   * @description If the action type is not defined, return null
                   */
                  if (!action.type) return null

                  // Special handling for MCP tool calls
                  if (action.type === 'tool_calls' && action.results) {
                    return (
                      <div key={index} className="w-full">
                        <Badge
                          variant="outline"
                          className={'bg-green-500 text-white flex gap-2 w-fit hover:opacity-75 mb-2'}>
                          <IoPlayCircleOutline/> {action.title}
                        </Badge>
                        <div className="text-xs space-y-1">
                          {action.results.map((result: any, resultIndex: number) => (
                            <div key={resultIndex} className="bg-gray-100 p-2 rounded text-gray-700">
                              <div className="font-medium">{result.tool}</div>
                              <div>{JSON.stringify(result.result, null, 2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  return (
                      <Badge
                          key={index}
                          variant="outline"
                          className={'bg-blue-500 text-white flex gap-2 w-fit hover:opacity-75'}>
                        <IoPlayCircleOutline/> {action.type}
                      </Badge>
                  )
                })}
          </div>
        </div>
      </div>
  )
}

export {
  ChatBubble
}