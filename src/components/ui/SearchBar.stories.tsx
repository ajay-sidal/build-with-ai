import React from 'react'
import SearchBar from './SearchBar'

export default {
  title: 'Components/SearchBar',
  component: SearchBar,
}

export const Empty = () => <SearchBar />

export const WithSuggestions = () => (
  <SearchBar suggestions={["example.com", "brilliant.ai", "acme.com"]} />
)
