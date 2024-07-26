import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
  /**
   * @description Simulates user interactions with a web page's login and logout buttons.
   * It waits for the login button to be present, clicks it, and then verifies its
   * absence after clicking. The function also searches for and expects the logout
   * button to be present.
   * 
   * @param {object} obj - Named `canvasElement`. It is expected to be an element from
   * which other elements can be accessed using methods such as `getByRole` and `within`.
   * 
   * @param {HTMLCanvasElement} obj.canvasElement - Used as a reference to a HTML canvas
   * element.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /Log in/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await expect(loginButton).not.toBeInTheDocument();

    const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};
