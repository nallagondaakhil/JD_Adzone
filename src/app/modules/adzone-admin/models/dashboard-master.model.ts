export interface DashboardMaster {
    pending?:number;
    processed?:number;
    delivered?:number;
    cancelled?:number;
    year?:Array<{id: number, name: number}>;
}
