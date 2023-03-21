export interface ApiResponse<T> {
    error: {
        erroCode: string;
        errorMessage: string;
        errorDetails: string;
    };
    message: {
        messageDescription: string;
        messageCode: string;
    };
    data: T;

}

export interface PagedResponse<T> extends ApiResponse<PagedData<T>> {

}

export interface PagedData<T> {
    content: T[];
    pageable: {
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        }
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface PagedRequestOptions {
    page: any;
    size: any;
    sortBy?: string;
    sort?: 'asc'|'desc';
    searchKey?: string;
    tabIndex?: number;
}
