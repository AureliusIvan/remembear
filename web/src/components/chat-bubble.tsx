import React from "react"

import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge";
import {IoPlayCircleOutline} from "react-icons/io5";

import type {ChatType} from "@/data/interface/chat.interface";

/**
 * @description Renders a chat message bubble with user-defined content and actions.
 * It takes two props: `isUser` indicating whether it's a user message or not, and
 * `data` containing the message and optional action array. The function styles the
 * bubble based on the provided data.
 * 
 * @param {object} obj - Destructured into two properties: `isUser`, a boolean
 * indicating whether the chat bubble belongs to the user or not, and `data`, an
 * object of type `ChatType`.
 * 
 * @param {boolean} obj.isUser - Used to determine the alignment and color of the
 * chat bubble.
 * 
 * @param {ChatType} obj.data - Used to render chat bubble content.
 * 
 * @returns {JSX.Element} A React component consisting of a div element containing
 * nested elements with various class names and properties. The returned component
 * represents a chat bubble in a messaging application.
 */
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
                  // Transforms data.

                  /**
                   * @description If the action type is not defined, return null
                   */
                  if (!action.type) return null

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