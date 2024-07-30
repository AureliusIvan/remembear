interface actionType {
  type?: string,
  title?: string,
  body?: string,
  at?: string
}

interface ChatType {
  role?: "user" | "model"
  message: string
  action?: actionType[]
}

export type {actionType, ChatType}