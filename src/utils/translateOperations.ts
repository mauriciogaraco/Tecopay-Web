export const translateOperationType = (origin:string) =>{
    switch (origin) {
      case "DEBIT":
        return "Débito";
      
      case "CREDIT": 
        return "Crédito";

        case "DEPOSIT": 
        return "Depósito";
      
        default:
          return "";
    }
  
  }

  export const translateOperationConcept = (origin:string) =>{
    switch (origin) {
      case "Account charge":
        return "Recarga de Cuenta";
      
      case "Account transfer": 
        return "transferencia entre cuentas";
      
        default:
          return "";
    }
  
  }

  