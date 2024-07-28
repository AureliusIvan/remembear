import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

/**
 * @description Merges multiple class values into a single value using the `twMerge`
 * function, which is applied to the result of `clsx`, an array-like object created
 * from the input arguments. The merged class value can be used for styling purposes.
 * 
 * @param {ClassValue[]} inputs - Expected to be one or more class values.
 * 
 * @returns {TwMergeResult} A result of merging class values using the twMerge function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
