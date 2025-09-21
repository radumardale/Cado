export enum CountriesOptionsInterface {
  md = 'md',
  ro = 'ro',
}

export const CountriesOptionsArr = Object.values(CountriesOptionsInterface).filter(
  value => typeof value === 'string'
) as string[];

export const CountriesOptions = {
  md: ['en', 'ro', 'ru'],
  ro: ['en', 'ro'],
};
