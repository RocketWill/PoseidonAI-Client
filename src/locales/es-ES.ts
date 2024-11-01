/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 09:12:16
 * @FilePath: /PoseidonAI-Client/src/locales/es-ES.ts
 */
import component from './es-ES/component';
import createTask from './es-ES/createTask';
import globalHeader from './es-ES/globalHeader';
import menu from './es-ES/menu';
import pages from './es-ES/pages';
import account from './es-ES/pagesAccount';
import evalTask from './es-ES/pagesEvalTask';
import exportModel from './es-ES/pagesExportModel';
import trainingConfigPage from './es-ES/pagesTrainingConfigurations';
import visTask from './es-ES/pagesVisTask';
import pwa from './es-ES/pwa';
import settingDrawer from './es-ES/settingDrawer';
import settings from './es-ES/settings';
import trainTask from './es-ES/trainTask';

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
