import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";

export class ApiErrorUtil {
    static isError(response: ApiResponse<any>) {
        return !!response.error?.errorMessage;
    }

    static errorMessage(response: ApiResponse<any>|any) {
        return response.error?.errorMessage;
    }
    static errorDescription_401(response: ApiResponse<any>|any) {

        return response?.error?.error_description;

    }
}
