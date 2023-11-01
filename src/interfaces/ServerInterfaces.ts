export interface PaginateInterface {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface SocialNetworksInterface {
  user: string;
  url: string;
  type: string;
}

export interface ImageInterface {
  id: number;
  src: string;
  thumbnail: string;
  blurHash: string;
}

export interface CurrenciesInterface {
  id: number;
  exchangeRate: number;
  isMain: boolean;
  name: string;
  code: string;
  symbol: string;
}

export interface PhonesInterface {
  number: string;
  description: string | null;
}

export interface MunicipalityInterface {
  id: number;
  name: string;
  code: string;
}

export interface AddressInterface {
  street: string;
  description: string;
  locality: string;
  municipality: MunicipalityInterface;
  province: MunicipalityInterface;
}

export interface SubsPlanInterface {
  id: 5;
  name: string;
  code: string;
  description: string | null;
  price: PriceInvoiceInterface;
}

export interface BusinessInterface {
  id: number;
  name: string;
  configurationsKey: any;
  promotionalText: string;
  description: string;
  email: string;
  color: string;
  slug: string;
  dni: string;
  subscriptionPlanId: number;
  businessCategoryId: number;
  phones: Array<PhonesInterface>;
  businessCategory: BusinessCategoryInterface;
  images: Array<ImageInterface>;
  socialNetworks: Array<SocialNetworksInterface>;
  logo: ImageInterface | null;
  banner: ImageInterface;
  availableCurrencies: Array<CurrenciesInterface>;
  address: AddressInterface;
  subscriptionPlan: PlanInterface;
  subscriptionPlanPrice: PriceInvoiceInterface;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  type: string | null;
  licenceUntil: string | null;
  status: string;
  openHours: string;
  notificationServerKey?: string;
  woo_ck?: string;
  woo_sk?: string;
  woo_apiBase?: string;
  woo_apiVersion?: string;
  accessKey?: string;
}

export interface ReportsInterface {
  areas: {
    STOCK: number;
    MANUFACTURER: number;
    SALE: number;
  };
  users: {
    total: number;
    actives: number;
  };
  products: {
    total: number;
    totalInSale: number;
  };
}

export interface RolesInterface {
  id?: number;
  name: string;
  code: string;
  description: string | null;
}

export interface BasicNomenclator {
  id: number;
  name: string;
}
export interface ConfigurationInterface {
  key: string;
  value: string | number | boolean | string[];
}
export interface SendConfigUpdate {
  configs: ConfigurationInterface[];
}

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  isSuperAdmin: false;
  isLogued: false;
  lastLogin: string | null;
  displayName: string;
  business:{id:number, name:string};
  businessId: number;
  avatarId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  avatar: {
    blurHash: string;
    id: number;
    src: string;
    thumbnail: string;
  };
  roles: RolesInterface[];
  allowedStockAreas: Array<BasicNomenclator>;
  allowedSalesAreas: Array<BasicNomenclator>;
  allowedManufacturerAreas: Array<BasicNomenclator>;

  
}
export interface AllTicketsInterface {
  id: number;
  name: string;
  classification: string
  priority: string
  status: string
  closedAt: string
  oppenedAt: string
  createdAt: string
  updatedAt: string
  contact_id: number
  description: string
  createdById: number
  email: string;
}
export interface TicketData {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  items: TicketsInterface[];
}

export interface TicketsInterface {
  id: number;
  name: string;
  classification: string
  priority: string
  status: string
  closedAt: string
  oppenedAt: string
  createdAt: string
  updatedAt: string
  contact_id: number
  description: string
  createdById: number
  email: string;
}

export interface PlanInterface {
  id: number;
  name: string;
  code: string;
  description: string;
  price: PriceInvoiceInterface;
}

export interface BusinessCategoryInterface {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface AllBusinessInterface {
  id: number;
  name: string;
  status: string;
  slug: string;
  isActive: boolean;
  dni: string;
  licenceUntil: string;
  type: string;
  businessCategory: {
    id: number;
    name: string;
    description: string | null;
  };
  logo: ImageInterface | null;
  subscriptionPlan: {
    name: string;
    code: string;
    description: string | null;
  };
}

export interface NewBusinessFields {
  dni: string;
  name: string;
  slug: string;
  type: string | null;
  businessCategoryId: number | null;
  subscriptionPlanId: number | null;
}

export interface SysUserInterface {
  displayName: string | null;
  username: string;
  email: string;
  avatar: string | null;
}

export interface PriceInvoiceInterface {
  amount: number;
  codeCurrency: string;
}

export interface InvoiceInterface {
  id: number;
  invoiceNumber: string;
  status: string;
  observations: string;
  nextPayment: string;
  createdAt: string;
  price: PriceInvoiceInterface;
  subscriptionPlan: SubsPlanInterface;
  registeredBy: SysUserInterface;
  promotion: boolean;
  dateUntil: string | null;
  discount: number | null;
}

export interface IncomeInterface {
  day: string;
  number: number;
  date: string;
  listEconomicCyclesId: string[];
  totalIncome: number;
}

export interface TotalSubscripion {
  code: string;
  amount: number;
}

export interface TotalType {
  type: string;
  amount: number;
}

export interface SumaryInterface {
  totalRegisteredBusiness: number;
  totalBySubscriptionPlan: TotalSubscripion[];
  totalByType: TotalType[];
}

export interface BillingBusiness {
  id: number;
  name: string;
  status: string;
  dni: string;
  licenceUntil: string;
  type: string;
  subscriptionPlan: SubsPlanInterface;
  subscriptionPlanPrice: PriceInvoiceInterface;
}

export interface BusinessBranchInterface {
  id: number;
  name: string;
  logo: ImageInterface | null;
}
export interface NewBusinessBranchFields {
  name: string;
  logo: ImageInterface | null;
}
