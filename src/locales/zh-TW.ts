/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 09:01:05
 * @FilePath: /PoseidonAI-Client/src/locales/zh-TW.ts
 */
import component from './zh-TW/component';
import createTask from './zh-TW/createTask';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pages from './zh-TW/pages';
import account from './zh-TW/pagesAccount';
import evalTask from './zh-TW/pagesEvalTask';
import exportModel from './zh-TW/pagesExportModel';
import trainingConfigPage from './zh-TW/pagesTrainingConfigurations';
import visTask from './zh-TW/pagesVisTask';
import pwa from './zh-TW/pwa';
import settingDrawer from './zh-TW/settingDrawer';
import settings from './zh-TW/settings';
import trainTask from './zh-TW/trainTask';

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
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
  ...visTask,
  ...trainTask,
  ...exportModel,
  ...account,
};
