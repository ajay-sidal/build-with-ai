import React from 'react'
import { Meta, Story } from '@storybook/react'
import ThemeToggle from './ThemeToggle'

export default {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
} as Meta

const Template: Story<any> = (args) => (
  <div className="p-6 bg-zinc-950 text-zinc-50">
    <ThemeToggle {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {}
