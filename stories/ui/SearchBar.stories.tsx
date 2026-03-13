import React from 'react'
import SearchBar from '../src/components/ui/SearchBar'

export default {
  title: 'UI/SearchBar',
  component: SearchBar,
}

export const Default = () => (
  <div style={{ padding: 20 }}>
    <SearchBar placeholder="Search…" />
  </div>
)
