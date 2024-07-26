"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

/**
 * @description Generates a unique identifier as a string by incrementing a counter
 * modulo the maximum safe integer value, preventing overflow, and converting the
 * result to a string. This ensures uniqueness within a specific range while avoiding
 * arithmetic overflow issues.
 * 
 * @returns {string} A representation of an integer incremented by one modulo the
 * maximum safe integer.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
  type: ActionType["ADD_TOAST"]
  toast: ToasterToast
}
    | {
  type: ActionType["UPDATE_TOAST"]
  toast: Partial<ToasterToast>
}
    | {
  type: ActionType["DISMISS_TOAST"]
  toastId?: ToasterToast["id"]
}
    | {
  type: ActionType["REMOVE_TOAST"]
  toastId?: ToasterToast["id"]
}

/**
 * @description Defines a type for an object that has a property called `toasts`,
 * which is an array of elements that conform to the `ToasterToast` type.
 */
interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * @description Schedules a timeout for a specified `toastId`. If no existing timeout
 * is found, it sets a new one with the `TOAST_REMOVE_DELAY` value and stores the ID
 * and associated timeout in the `toastTimeouts` set. When the timeout expires, it
 * removes the corresponding toast from the store.
 * 
 * @param {string} toastId - Used to identify a toast to be removed from the queue.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    // Postpones removal of toast for a specified delay.

    // Deletes and removes a toast after a delay.

    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * @description Manages a list of toast notifications based on three actions: ADD_TOAST,
 * UPDATE_TOAST, and DISMISS_TOAST/REMOVE_TOAST. It updates the state accordingly,
 * handling tasks such as adding, updating, dismissing, or removing toasts, while
 * also enforcing a limit on the number of displayed toasts.
 * 
 * @param {State} state - Used to store the application's current state.
 * 
 * @param {Action} action - Used to determine how to update the state.
 * 
 * @returns {State} An object representing the current state of toasts. The exact
 * structure and content of this object depend on the action taken.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? {...t, ...action.toast} : t
        ),
      }

    case "DISMISS_TOAST": {
      const {toastId} = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          // Adds an ID to a removal queue.

          // Adds toasts ID to remove queue.

          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
            t.id === toastId || toastId === undefined
                ? {
                  ...t,
                  open: false,
                }
                : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = {toasts: []}

/**
 * @description Applies a given `action` to the current `memoryState` using a `reducer`,
 * and then calls each registered `listener` function with the updated `memoryState`.
 * This updates the state and notifies any subscribers of changes.
 * 
 * @param {Action} action - Used for triggering state changes.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    // Calls each listener with memoryState as argument.

    // Calls back with a callback.

    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

/**
 * @description Generates a unique ID for a toast and dispatches actions to add,
 * update, and dismiss the toast based on props provided. It returns an object
 * containing the ID, a function to dismiss the toast, and a function to update its
 * properties.
 * 
 * @param {object} obj - Spread into a `Toast` type, denoted by `{...props}: Toast`.
 * This means it accepts an object with properties that match the `Toast` type.
 * 
 * @returns {object} Composed of two properties: `id`, a string representing the ID
 * of the toast; and `dismiss` and `update`, two functions to respectively dismiss
 * and update the toast.
 */
function toast({...props}: Toast) {
  const id = genId()

  /**
   * @description Updates the state of a toaster toast by sending an action to the
   * reducer with type "UPDATE_TOAST". The updated toast is created by merging the
   * incoming `props` with an existing `id`. This action triggers the reducer to modify
   * the application state accordingly.
   * 
   * @param {ToasterToast} props - Used to update a toast with new properties.
   */
  const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: {...props, id},
      })
  const dismiss = () => dispatch({type: "DISMISS_TOAST", toastId: id})

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      /**
       * @description Monitors a state variable `open`. When the `open` state changes to
       * false, it triggers the `dismiss()` function to perform an action likely related
       * to dismissing or closing something. The exact behavior depends on the context and
       * definition of `dismiss()`.
       * 
       * @param {boolean} open - True if the file or folder is open, false otherwise.
       */
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * @description Manages a toast state and its listeners using React's `useState` and
 * `useEffect`. It initializes the state from the `memoryState`, adds itself as a
 * listener to any changes, and provides methods for updating the state and dismissing
 * toasts.
 * 
 * @returns {any} An object with three properties: state (an object), toast, and
 * dismiss. The state property contains a nested object structure representing the
 * current application state.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Adds/removes state update listener.

    // Registers and unregisters a state update listener.

    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({type: "DISMISS_TOAST", toastId}),
  }
}

export {useToast, toast}
