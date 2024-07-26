import React from 'react';
import './button.css';

/**
 * @description Defines a set of properties that can be used to customize the behavior
 * and appearance of a button component.
 * 
 * Configure whether the button is the principal call to action on the page with the
 * optional `primary` property, which takes a boolean value if specified.
 * 
 * Specify the background color of the button using the optional `backgroundColor`
 * property, which accepts a string value representing the color.
 * 
 * Determine the size of the button by setting the `size` property to one of the three
 * predefined values: 'small', 'medium', or 'large'.
 * 
 * Require a label for the button, which is represented by the non-optional `label`
 * property that takes a string value.
 * 
 * Optionally provide a click handler function using the `onClick` property, which
 * can be set to any valid function returning no value (`void`).
 */
export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
