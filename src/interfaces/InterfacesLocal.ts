import { PriceInvoiceInterface } from "./ServerInterfaces";

export interface SelectInterface {
  id: string | number | null;
  name: string;
  disabled?: boolean;
}

export interface FilterCodeDatePickerRange {
  isUnitlToday: boolean | undefined;
  filterCode : string;
  name: string;
}

export interface SelledProductReport {
  salesCategory: string;
  products: {
    name: string;
    areaSale: string;
    salesPrice: PriceInvoiceInterface[];
    quantity: number;
    totalCost:PriceInvoiceInterface;
    totalSale: PriceInvoiceInterface[];
  }[];
  subtotals: {quantity?:number, totalSales?:PriceInvoiceInterface[], totalCost?:PriceInvoiceInterface }
}

export type BasicType = Record<string,string|number|boolean|null>;
