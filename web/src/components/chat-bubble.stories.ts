import type {Meta, StoryObj} from '@storybook/react';
// import {fn} from '@storybook/test';
import {ChatBubble} from './chat-bubble';
import {actionType} from "@/services/ServerService";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Remembear/ChatBubble',
  component: ChatBubble,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const UserChatBubble: Story = {
  args: {
    isUser: true,
    data: {message: 'Hello world!'},
  },
};


export const ModelChatBubble: Story = {
  args: {
    isUser: false,
    data: {
      message: 'Hello world!',
      action: [
        {type: 'action1'},
        {type: 'action2'},
        {type: 'action3'},
      ] as actionType[],
    },
  }
};


export const ModelChatBubbleWithoutActionString: Story = {
  args: {
    isUser: false,
    data: {
      message: 'Hello world!',
      action: [
        {type: ''},
      ] as actionType[],
    },
  }
};