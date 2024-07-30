/**
 * @description Defines a set of optional properties for an object: `type`, `title`,
 * `body`, and `at`.
 */
interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

/**
 * @description Defines a type for chat messages that can be used in a conversation
 * between a user and a model. The interface consists of three properties:
 * 
 * *   `role`: This property is optional and represents the role of the sender of the
 * message, which can either be "user" or "model".
 * *   `message`: This property is required and represents the actual message sent
 * by the sender.
 * *   `action`: This property is also optional and represents an array of actions
 * that the model can perform in response to the user's message. The type of this
 * property is inferred from the `actionType` type.
 */
interface ChatType {
  role?: "user" | "model"
  message: string
  action?: actionType[]
}

export type {actionType, ChatType}