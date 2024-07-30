/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-30 13:04:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 13:07:11
 * @FilePath: /PoseidonAI-Client/src/utils/tools.ts
 */
function getRandomElement(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export const generateRandomName = () => {
  const adjectives = [
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
  const nouns = [
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

  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);

  return `${adjective}-${noun}`;
};
