import {
  accountOperationType,
  cash_register_operations,
  measureType,
  operation_movements_types,
  operation_movement_status_types,
  order_receipt_status,
  payments_ways,
  selled_products_status,
} from './nomenclators';

export interface Session {
  token: string;
  refresh_token: string;
}
export interface PriceSystems {
  id: number;
  name: string;
  isMain: boolean;
}

export interface Business {
  id: number;
  name: string;
  businessCategory: BusinessCategory;
  logo: Image;
  //status: business_status;
  promotionalText: string;
  description: string;
  isActive: boolean;
  dni: string;
  //type: business_types;
  email: string;
  footerTicket: string;
  images: Array<Image>;
  subscriptionPlanId: number;
  addressId: number;
  createdAt: Date;
  configurationsKey: Array<ConfigurationKey>;
  availableCurrencies: Array<Currency>;
  mainCurrency: string;
}

export interface Image {
  id: number;
  src: string;
  thumbnail: string;
}

export interface BusinessCategory {
  id: number;
  name: string;
  description: string;
}

export interface ConfigurationKey {
  key:
    | 'tax_rate'
    | 'payment_methods_enabled'
    | 'enabled_discounts'
    | 'print_number_order'
    | 'default_method_payment'
    | 'stock_type_products'
    | 'type_products'
    | 'enable_ongoing_orders'
    | 'enable_testing_orders_printing'
    | 'open_cashbox_at_print'
    | 'extract_salary_from_cash'
    | 'cash_operations_include_tips'
    | 'cash_operations_include_deliveries';
  value: string;
}

export interface PublicConfigs {
  key:
    | 'is_maintenance_tecopos'
    | 'tecopos_min_version_ios'
    | 'tecopos_min_version_android'
    | 'tecopos_url_google_play'
    | 'tecopos_url_app_store';
  value: string;
}

export interface Currency {
  id: number;
  exchangeRate: number;
  isActive: boolean;
  isMain: boolean;
  name: string;
  code: string;
  symbol: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: Image;
  isActive: boolean;
  isSuperAdmin: boolean;
  isLogued: boolean;
  lastLogin: Date;
  businessId: number;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<Role>;
  displayName: string;
  allowedStockAreas: Array<Area>;
  allowedSalesAreas: Array<Area>;
  allowedManufacturerAreas: Array<Area>;
}

export interface UserReduced {
  username: string;
  email: string;
  avatar: Image;
  displayName: string;
}

export interface UserToLogin {
  id: number;
  username: string;
  email: string;
  avatar: Image;
  roles: Array<Role>;
  lastLogin: Date;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  description: string;
  type: 'SALE' | 'MANUFACTURER' | 'STOCK';
  isActive: boolean;
  isMainStock: boolean;
  images: Array<Image>;
  otherItemsAvailable: boolean;
  restrictToMyStock: boolean;
  salesMode: 'SHOP' | 'RESTAURANT';
  businessId: number;
  stockAreaId: number;
  productionMode: 'SERIAL' | 'BYORDERS';
  initialStock: {
    id: number;
    name: string;
  };
  endStock: {
    id: number;
    name: string;
  };
}

export interface CashRegisterOperation {
  id: number;
  amount: number;
  codeCurrency: string;
  observations: string;
  operation: cash_register_operations;
  type: accountOperationType;
  economicCycleId: number;
  areaId: number;
  createdAt: Date;
  madeBy: {
    id: number;
    username: string;
    displayName: string;
  };
}

export interface Product {
  id: number;
  name: string;
  salesCode: string;
  description: string;
  promotionalText: string;
  type: string;
  showForSale: boolean;
  isPublicVisible: boolean;
  qrCode: string;

  totalQuantity: number;
  measure: measureType;
  alertLimit: number;
  isAlertable: boolean;
  isAccountable: boolean;
  averageCost: number;

  isAddon: boolean;
  averagePreparationTime: number;
  elaborationSteps: string;
  images: Array<Image>;

  businessId: number;
  salesCategoryId: number;
  productCategoryId: number;
  preparationAreaId: number;
  createdAt: Date;
  productCategory: ProductCategory;
  salesCategory: SalesCategory;
  stockAreaProducts: Array<{ productId: number; quantity: number }>;
  prices: Array<ProductPrice>;

  quantity: number;
  areaId: number;
  availableAddons?: Array<Addon>;
  listProductionAreas?: Array<Area>;
  listManufacturations?: Array<Product>;

  combo: Array<Product>;
  onSale: boolean;
  suggested: boolean;
  onSalePrice: Price;

  stockLimit: boolean;
  supplies: Array<Supply>;
}

export interface Supply {
  id: number;
  quantity: number;
  baseProductId: number;
  supplyId: number;
  name: string;
  measure: string;
  cost: number;
}

export interface StockProduct {
  id: number;
  product: Product;
  quantity: number;
}

export interface StockMovement {
  id: number;
  quantity: number;
  costBeforeOperation: number;
  parentId: number;
  operation: operation_movements_types;
  description: string;
  status: operation_movement_status_types;
  isOutFromSale: boolean;
  accountable: boolean;
  businessId: number;
  productId: number;
  transformedToId: number;
  areaId: number;
  movedToId: number;
  movedById: number;
  approvedById: number;
  supplierId: number;
  createdAt: Date;
  updatedAt: Date;
  movedBy: {
    username: string;
    email: string;
    displayName: string;
  };
  product: {
    name: string;
    measure: string;
  };
  approvedBy: {
    username: string;
    email: string;
    displayName: string;
  };
  supplier: null;
  movedTo: null;
  price: Price;
}

export interface SimplePrice {
  id: number;
  price: number;
  codeCurrency: string;
  paymentWay?: payments_ways;
}

export interface Price {
  id: number;
  amount: number;
  codeCurrency: string;
  paymentWay?: payments_ways;
}

export interface ProductPrice extends SimplePrice {
  isMain: boolean;
  priceSystemId: number;
}

export interface Addon {
  outStock: boolean;
  id: number;
  name: string;
  salesCode: string;
  description: string;
  prices: Array<ProductPrice>;
  outSale: boolean;
  onSale: boolean;
  onSalePrice: Price;
}

export interface SalesCategory {
  id: number;
  name: string;
  description: string;
  image: Image;
  products: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  image: Image;
}

export interface Order {
  id: number | string;
  name: string;
  status: order_receipt_status;
  taxes: Price;
  tipPrice: Price;
  operationNumber: number;
  discount: number;
  observations: string;
  numberClients: number;
  closedDate: Date;
  isForTakeAway: boolean;
  lastProductionNumber: number;
  listResources: string;
  businessId: number;
  salesBy: {
    id: number;
    displayName: string;
    avatar: Image;
  };
  managedBy: {
    id: number;
    displayName: string;
    avatar: Image;
  };
  createdAt: Date;
  selledProducts: Array<SelledProduct>;
  areaSales: {
    id: number;
    name: string;
  };
  showAlertCompleted?: boolean;
  prices: Array<SimplePrice>;
  currenciesPayment: Array<{
    amount: number;
    codeCurrency: string;
    paymentWay: payments_ways;
  }>;
  client: Client;
  shippingPrice: Price;
  shippingBy: Person;
  amountReturned: Price;
  houseCosted: boolean;
}

export interface Client {
  id: number;
  name: string;
  observations: string;
  address: Address;
  phones: Array<Phone>;
  email: string;
}

export interface Person {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  street: string;
  description: string;
  locality: string;
  shippingRegion: ShippingRegion;
  shippingRegionId: number;
}

export interface ShippingRegion {
  id: number;
  name: string;
  price: Price;
}

export interface Phone {
  id: number;
  number: string;
  description: string;
}

export interface SelledProduct {
  id: number | string;
  name: string;
  quantity: number;
  removedQuantity: number;
  restoredQuantity: number;
  productionNumber: number;
  priceTotal: Price;
  priceUnitary: Price;
  status: selled_products_status;
  observations: string;
  areaId: number;
  orderReceiptId: number;
  productId: number;
  addons: AddonInterface[];
  image: Image;
  createdAt: Date;
  updatedAt: Date;
  //type: productType;
  productionTicketId: number;
  productionTicket?: ProductionTicket;
  listProductionAreas?: Array<Area>;
  productionAreaId?: number;
}

export interface Resource {
  id: number;
  code: string;
  numberClients: number;
  isAvailable: boolean;
  isReservable: boolean;
  type: 'TABLE';
  areaId: number;
  area: {
    name: string;
  };
}

export interface AddonInterface {
  name: string;
  productId: number;
  quantity: number;
  unityPrice: number;
}

export interface ProductionTicket {
  id: number;
  status: 'RECEIVED' | 'IN_PROCESS' | 'DISPATCHED';
  name: string;
  productionNumber: number;
  areaId: number;
  orderReceiptId: number;
  createdAt: Date;
  updatedAt: Date;
  selledProducts: Array<SelledProduct>;
  orderReceipt: Order;

  //ViaSockets
  hasChange?: boolean;
  textChange?: string;
}

export interface EconomicCycle {
  id: number;
  name: string;
  observations: string;
  openDate: string;
  closedDate: string;
  openBy: UserReduced;
  closedBy: UserReduced;
  priceSystem: PriceSystem;
  isActive: boolean;
}

export interface PriceSystem {
  id: number;
  name: string;
  isMain: boolean;
}

export interface IpvProduct {
  productId: number;
  name: string;
  image: string;
  measure: string;
  productCategory: string;
  productCategoryId: number;
  inStock: number;
  initial: number;
  entry: number;
  movements: number;
  outs: number;
  sales: number;
  processed: number;
  waste: number;
}

export interface IpvData {
  products: Array<IpvProduct>;
  nextAction: 'OPEN' | 'CLOSED' | 'VIEW';
  economicCycleId: number;
  openAction?: {
    madeAt: Date;
    madeBy: string;
  };
  closedAction?: {
    madeAt: Date;
    madeBy: string;
  };
}

export interface ReportEconomicCycle {
  totalSales: Array<{ amount: number; codeCurrency: string }>;
  taxes: Array<{ amount: number; codeCurrency: string }>;
  totalTips: Array<{ amount: number; codeCurrency: string }>;
  totalCashOperations: Array<{
    amount: number;
    codeCurrency: string;
    operation: cash_register_operations;
    type: accountOperationType;
  }>;
  totalDiscounts: Array<{ amount: number; codeCurrency: string }>;
  totalShipping: Array<{ amount: number; codeCurrency: string }>;
  totalTipsMainCurrency: { amount: number; codeCurrency: string };
  totalInCash: Array<{ amount: number; codeCurrency: string }>;
  totalInCashAfterOperations: Array<{ amount: number; codeCurrency: string }>;
  totalSalary: { amount: number; codeCurrency: string };
  totalIncomesNotInCash: Array<{
    amount: number;
    codeCurrency: string;
    paymentWay: string;
  }>;
  totalHouseCosted: Array<{ amount: number; codeCurrency: string }>;
}

export interface ConfigUpdate {
  key: string;
  value: string;
}

export interface SendConfigUpdate {
  configs: ConfigUpdate[];
}
