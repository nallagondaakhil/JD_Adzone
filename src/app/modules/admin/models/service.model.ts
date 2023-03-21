export interface NewSReqModel {
    id: string;
    actNo: string;
    actType: number;
    actPeriod: string;
    actDays: number;
    action: string;
    serviceReqAssign: string;
    serviceReqInit: string;
    serviceReqDate: number;
    quoteValue:number;
    attachment: string;
    vendors: Array<{id: number}>;
    
  
}

