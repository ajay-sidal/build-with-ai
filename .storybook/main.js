module.exports = {
  // Move stories out of `src` so they are not picked up by Next.js production
  // compilation. Storybook will load stories from the top-level `stories/` folder.
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react',
    options: {},
  },
  docs: {
    autodocs: true,
  },
}
