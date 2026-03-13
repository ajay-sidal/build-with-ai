import React from 'react'
import LeadModal from '../src/components/LeadModal'

export default {
  title: 'Components/LeadModal',
  component: LeadModal,
}

export const Default = () => (
  <div style={{ padding: 20 }}>
    <LeadModal open={true} onClose={() => {}} />
  </div>
)
