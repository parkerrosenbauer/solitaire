export enum Rank {
  A = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  J,
  Q,
  K,
}

export const rankToString = {
  [Rank.A]: 'A',
  [Rank.J]: 'J',
  [Rank.Q]: 'Q',
  [Rank.K]: 'K',
};
