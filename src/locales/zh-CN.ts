/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 16:52:06
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 09:04:29
 * @FilePath: /PoseidonAI-Client/src/locales/zh-CN.ts
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import component from './zh-CN/component';
import createTask from './zh-CN/createTask';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import account from './zh-CN/pagesAccount';
import evalTask from './zh-CN/pagesEvalTask';
import exportModel from './zh-CN/pagesExportModel';
import trainingConfigPage from './zh-CN/pagesTrainingConfigurations';
import visTask from './zh-CN/pagesVisTask';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import trainTask from './zh-CN/trainTask';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...trainingConfigPage,
  ...createTask,
  ...evalTask,
  ...trainTask,
  ...visTask,
  ...exportModel,
  ...account,
};
