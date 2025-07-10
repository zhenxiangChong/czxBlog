import { defineThemeConfig } from "vuepress-theme-plume";
import navbar from "./navbar.js";
import notes from "./notes/index.js";

export default defineThemeConfig({
  logo: "/logo.png",
  navbar,
  notes,
  profile: {
    name: "种振祥",
    avatar: "/images/blog-avatar.jpg",
    description: "勤能补拙",
  },
  social: [
    { icon: "github", link: "https://github.com/zhenxiangchong" },
    {
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M0 3.121V15h16V3.121l-8 8z"/><path fill="currentColor" d="M16 1H0l8 8z"/></svg>',
        name: "email",
      },
      link: "mailto:1010169013@qq.com",
    },
  ],
  navbarSocialInclude: ["github", "email"],
  editLinkText: "在 GitHub 上编辑此页",
  footer: { copyright: "Copyright © 2025-present chongzhenxiang" },
});
