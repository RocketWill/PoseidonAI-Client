/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-21 16:17:58
 * @FilePath: /PoseidonAI-Client/src/locales/zh-TW.ts
 */
import component from './zh-TW/component';
import createTask from './zh-TW/createTask';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pages from './zh-TW/pages';
import evalTask from './zh-TW/pagesEvalTask';
import trainingConfigPage from './zh-TW/pagesTrainingConfigurations';
import pwa from './zh-TW/pwa';
import settingDrawer from './zh-TW/settingDrawer';
import settings from './zh-TW/settings';

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
};
