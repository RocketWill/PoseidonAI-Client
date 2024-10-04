/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-30 13:04:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-04 14:54:41
 * @FilePath: /PoseidonAI-Client/src/utils/tools.ts
 */

// 工具函數：從數組中隨機選取一個元素
function getRandomElement(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

// 工具函數：生成一個隨機的名稱，由形容詞和名詞組成
export const generateRandomName = (): string => {
  const adjectives: string[] = [
    'clever',
    'bold',
    'brave',
    'fancy',
    'jolly',
    'mighty',
    'silly',
    'witty',
    'happy',
    'tiny',
    'gentle',
    'wild',
    'fierce',
    'quick',
    'calm',
    'bright',
    'graceful',
    'fearless',
    'strong',
    'curious',
  ];

  const nouns: string[] = [
    'lion',
    'tiger',
    'bear',
    'whale',
    'wolf',
    'eagle',
    'shark',
    'panther',
    'fox',
    'dragon',
    'hawk',
    'lynx',
    'orca',
    'falcon',
    'cobra',
    'cheetah',
    'rhino',
    'hippo',
    'jaguar',
    'stallion',
  ];

  const adjective: string = getRandomElement(adjectives);
  const noun: string = getRandomElement(nouns);

  return `${adjective}-${noun}`;
};

// 預定義一組顏色
const tagColors: string[] = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'pink',
  'yellow',
  'lightgreen',
  'lightblue',
];

// 工具函數：隨機選取一個顏色
export const getRandomColor = (): string => {
  const randomIndex: number = Math.floor(Math.random() * tagColors.length);
  return tagColors[randomIndex];
};

// 工具函數：根據索引選取對應顏色，支持索引超出範圍時循環使用顏色
export const getColor = (index: number): string => tagColors[index % tagColors.length];

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
