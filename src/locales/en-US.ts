/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 09:08:51
 * @FilePath: /PoseidonAI-Client/src/locales/en-US.ts
 */
import component from './en-US/component';
import createTask from './en-US/createTask';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import account from './en-US/pagesAccount';
import evalTask from './en-US/pagesEvalTask';
import exportModel from './en-US/pagesExportModel';
import trainingConfigPage from './en-US/pagesTrainingConfigurations';
import visTask from './en-US/pagesVisTask';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import trainTask from './en-US/trainTask';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...trainingConfigPage,
  ...createTask,
  ...evalTask,
  ...trainTask,
  ...visTask,
  ...exportModel,
  ...account,
};
