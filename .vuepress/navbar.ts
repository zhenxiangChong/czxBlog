import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  {
    text: "博客",
    link: "/blog/",
    activeMatch: "^/(blog|article)/",
    icon: "material-symbols:menu-book",
  },
  {
    text: "笔记",
    icon: "icon-park-solid:bookshelf",
    items: [
      {
        text: "备忘录",
        link: "/memorandum/",
        activeMatch: "^/memorandum/",
        icon: "emojione:memo",
      },
      {
        text: "防御性CSS",
        link: "/defensive-css/",
        activeMatch: "^/defensive-css/",
        icon: "devicon:css3",
      },
      {
        text: "设计模式",
        link: "/design-pattern/",
        activeMatch: "^/design-pattern/",
        icon: "emojione:bookmark-tabs",
      },
      {
        text: "数据结构与算法",
        link: "/algorithm/",
        activeMatch: "^/algorithm/",
        icon: "hugeicons:algorithm",
      },
      {
        text: "前端开源库指南",
        link: "/fe-oss/",
        activeMatch: "^/fe-oss/",
        icon: "streamline-freehand:programming-code-idea",
      },
      {
        text: "前端面试题",
        link: "/interview-question/",
        activeMatch: "^/interview-question/",
        icon: "codicon:comment-unresolved",
      },
      // {
      //   text: "type-challenges",
      //   link: "/type-challenges/",
      //   activeMatch: "^/type-challenges/",
      //   icon: "mdi:language-typescript",
      // },
    ],
  },
  {
    text: "关于",
    link: "/about/",
    activeMatch: "^/about/",
    icon: "streamline-freehand:programming-code-idea",
  },
  {
    text: "更多",
    icon: "mingcute:more-3-fill",
    items: [
      {
        text: "书籍推荐",
        link: "/ebooks/",
        icon: "material-symbols:recommend",
        activeMatch: "^/ebooks/",
      },
      {
        text: "站点导航",
        link: "/sites-collect/",
        icon: "mdi:roadmap",
        activeMatch: "^/sites-collect",
      },
      {
        text: "AI 模型导航",
        link: "/ai/",
        icon: "eos-icons:ai",
        activeMatch: "^/ai/",
      },
      {
        text: "Command-Line Interface",
        link: "/cli/",
        icon: "grommet-icons:cli",
        activeMatch: "^/cli",
      },
      // {
      //   text: "程序员容易发音错误的单词",
      //   link: "/cpwp/",
      //   icon: "tdesign:user-talk-1",
      // },
    ],
  },
]);
