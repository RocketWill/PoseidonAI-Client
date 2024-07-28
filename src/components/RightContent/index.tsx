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
