export type productStockType =
    | "RAW"
    | "MANUFACTURED"
    | "READYFORSALE"
    | "WASTE"
    | "ASSET";

export type business_types = "RESTAURANT" | "SHOP" | "DATES";

export type selled_products_status =
    | "RECEIVED"
    | "IN_PROCESS"
    | "COMPLETED"
    | "REMOVED"
    | "CANCELLED";

export type order_receipt_status =
    | "IN_PROCESS"
    | "COMPLETED"
    | "BILLED"
    | "CANCELLED"
    | "CREATED"
    | "CLOSED"
    | "PRE_BILLED";

export type operation_movements_types =
    | "ENTRY"
    | "MOVEMENT"
    | "PROCESSED"
    | "OUT"
    | "SALE"
    | "REMOVED"
    | "WASTE";

export type operation_movement_status_types =
    | "APPROVED"
    | "PENDING_APPROVAL"
    | "REJECTED";

export type cash_register_operations =
    | "MANUAL_DEPOSIT"
    | "MANUAL_WITHDRAW"
    | "MANUAL_FUND"
    | "DEPOSIT_EXCHANGE"
    | "WITHDRAW_EXCHANGE"
    | "WITHDRAW_SALE"
    | "DEPOSIT_SALE"
    | "DEPOSIT_TIP";

export type measureType =
    | "KG"
    | "UNIT"
    | "LITRE"
    | "PORTION"
    | "DRINK"
    | "POUND";

export type payments_ways = "CASH" | "TRANSFER" | "CARD" | "CREDIT_POINT";

export type accountOperationType = "debit" | "credit";
