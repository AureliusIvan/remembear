import React from 'react';

import { Button } from './Button';
import './header.css';

type User = {
  name: string;
};

/**
 * @description Defines a set of properties that can be used as props for a component,
 * specifically a header component.
 * 
 * These properties include:
 * 
 * * `user`: an optional property of type `User`. This suggests that the header may
 * display information about the current user.
 * * `onLogin`: an optional function that is called when the login action occurs. It
 * has no return value and takes no arguments.
 * * `onLogout`: an optional function that is called when the logout action occurs.
 * It has no return value and takes no arguments.
 * * `onCreateAccount`: an optional function that is called when the create account
 * action occurs. It has no return value and takes no arguments.
 * 
 * The use of question marks (`?`) after the property names indicates that these
 * properties are optional, meaning they may not be provided to the component when
 * it is rendered.
 */
export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

/**
 * @description Renders a header component with an SVG logo, title "Acme", and
 * authentication buttons for logging in, out, or creating an account, depending on
 * the presence of a user object and corresponding event handlers.
 * 
 * @param {object} obj - Called `HeaderProps`. It contains four properties: `user`,
 * `onLogin`, `onLogout`, and `onCreateAccount`. These properties represent the user
 * data, login event handler, logout event handler, and create account event handler
 * respectively.
 * 
 * @param {HeaderProps} obj.user - Used to display welcome message for authenticated
 * users.
 * 
 * @param {HeaderProps} obj.onLogin - A callback for login functionality.
 * 
 * @param {HeaderProps} obj.onLogout - Responsible for handling user logout actions.
 * 
 * @param {HeaderProps} obj.onCreateAccount - Used to handle creation of an account.
 */
export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header>
    <div className="storybook-header">
      <div>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path
              d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
              fill="#FFF"
            />
            <path
              d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
              fill="#555AB9"
            />
            <path
              d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
              fill="#91BAF8"
            />
          </g>
        </svg>
        <h1>Acme</h1>
      </div>
      <div>
        {user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="small" onClick={onLogout} label="Log out" />
          </>
        ) : (
          <>
            <Button size="small" onClick={onLogin} label="Log in" />
            <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
          </>
        )}
      </div>
    </div>
  </header>
);
