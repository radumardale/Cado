export enum StockState {
  IN_STOCK = 'IN_STOCK',
  ON_COMMAND = 'ON_COMMAND',
  NOT_IN_STOCK = 'NOT_IN_STOCK',
}

export const StockStateArr = Object.values(StockState).filter(
  value => typeof value === 'string'
) as string[];

export const stockStateColors: Record<StockState, string> = {
  [StockState.IN_STOCK]: '#3A9F5C',
  [StockState.ON_COMMAND]: '#F28A1A',
  [StockState.NOT_IN_STOCK]: '#FF3E3E',
};
