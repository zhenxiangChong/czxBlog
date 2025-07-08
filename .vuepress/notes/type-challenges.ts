import { defineNoteConfig } from 'vuepress-theme-plume'

export default defineNoteConfig({
  link: '/type-challenges/',
  dir: 'type-challenges',
  sidebar: [
    '',
    {
      prefix: '热身',
      text: '热身(1)',
      collapsed: false,
      items: 'auto',
    },
    {
      prefix: '简单',
      text: '简单(13)',
      collapsed: false,
      items: 'auto',
    },
    {
      prefix: '中等',
      text: '中等(103)',
      collapsed: false,
      items: 'auto',
    },
    {
      prefix: '困难',
      text: '困难(43)',
      collapsed: true,
      items: 'auto',
    },
  ],
})
