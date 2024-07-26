import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {Button} from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {onClick: fn()},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {
  args: {
    children: "test",
    variant: 'default'
  },
};
