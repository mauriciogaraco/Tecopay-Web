export interface SelectInterface {
  id: string | number | null;
  name: string;
  disabled?: boolean;
}

export interface FilterCodeDatePickerRange {
  filterCode : string;
  name: string;
}

export interface SelledProductReport {
  salesCategory: string;
  products: {
    name: string;
    areaSale: string;
    salesPrice: { amount: number; codeCurrency: string }[];
    quantity: number;
    totalSale: { amount: number; codeCurrency: string }[];
  }[];
  subtotalSales: { amount: number; codeCurrency: string }[];
}

export type BasicType = Record<string,string|number|boolean|null>;
