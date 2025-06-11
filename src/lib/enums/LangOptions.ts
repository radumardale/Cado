export enum LangOptions {
    RO = 'ro',
    RU = 'ru',
    EN = 'en'
}

export const LangOptionsArr = Object.values(LangOptions).filter(value => typeof value === 'string') as string[];