/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-11-01 09:11:24
 * @FilePath: /PoseidonAI-Client/src/locales/fr-FR.ts
 */
import component from './fr-FR/component';
import createTask from './fr-FR/createTask';
import globalHeader from './fr-FR/globalHeader';
import menu from './fr-FR/menu';
import pages from './fr-FR/pages';
import account from './fr-FR/pagesAccount';
import evalTask from './fr-FR/pagesEvalTask';
import exportModel from './fr-FR/pagesExportModel';
import trainingConfigPage from './fr-FR/pagesTrainingConfigurations';
import visTask from './fr-FR/pagesVisTask';
import pwa from './fr-FR/pwa';
import settingDrawer from './fr-FR/settingDrawer';
import settings from './fr-FR/settings';
import trainTask from './fr-FR/trainTask';

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
