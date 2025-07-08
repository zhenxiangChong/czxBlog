import { defineNotesConfig } from 'vuepress-theme-plume'
import defensiveCss from './defensive-css.js'
import frontendOpenSources from './fe-oss.js'
import interviewQuestion from './interview-question.js'
import memorandum from './memorandum.js'
// import typeChallenges from './type-challenges.js'
import webpack from './webpack.js'

export default defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    interviewQuestion,
    // typeChallenges,
    defensiveCss,
    memorandum,
    webpack,
    frontendOpenSources,
    { dir: '设计模式', link: '/design-pattern/', sidebar: 'auto' },
    { dir: '算法', link: '/algorithm/', sidebar: 'auto' },
  ],
})
