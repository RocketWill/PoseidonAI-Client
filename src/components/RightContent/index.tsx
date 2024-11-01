/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 14:10:42
 * @FilePath: /PoseidonAI-Client/src/components/RightContent/index.tsx
 */
import { GlobalOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';

export type SiderTheme = 'light' | 'dark';

const langs = [
  {
    lang: 'zh-TW',
    label: '繁體中文',
    icon: '🇹🇼',
    title: '語言',
  },
  {
    lang: 'en-US',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language',
  },
  {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言',
  },
  {
    lang: 'es-ES',
    label: 'Español',
    icon: '🇪🇸',
    title: 'Idioma',
  },
  {
    lang: 'fr-FR',
    label: 'Français',
    icon: '🇫🇷',
    title: 'Langue',
  },
  // {
  //   lang: 'pt-BR',
  //   label: 'Português (Brasil)',
  //   icon: '🇧🇷',
  //   title: 'Idioma',
  // },
];

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
      postLocalesData={() => langs}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://www.efctw.com/');
      }}
    >
      <GlobalOutlined />
    </div>
  );
};
