import React from 'react'
import { Meta, Story } from '@storybook/react'
import LeadModal from './LeadModal'

export default {
  title: 'Components/LeadModal',
  component: LeadModal,
} as Meta

const Template: Story<any> = (args) => <div className="p-6 bg-zinc-950"><LeadModal {...args} /></div>

export const Default = Template.bind({})
Default.args = {
  open: true,
  result: { message: 'Lead created', leadId: 'abc123' },
}

export const NoId = Template.bind({})
NoId.args = {
  open: true,
  result: { message: 'Lead queued' },
}
