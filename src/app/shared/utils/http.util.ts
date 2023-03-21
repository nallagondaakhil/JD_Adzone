import { HttpParams } from "@angular/common/http";
import { PagedRequestOptions } from "src/app/modules/admin/models/paged-data.model";

export class HttpUtil {
    static convertReqOptionToParams(options: PagedRequestOptions): {[param: string]: string | string[]} {
        if (!options) { return null; }
        const res: {[param: string]: string | string[]} = {};
        if (options.page != null) { res['page'] = (options.page - 1).toString(); }
        if (options.size != null) { res['size'] = options.size.toString(); }
        if (options.sortBy) { res['sortBy'] = options.sortBy; }
        if (options.sort) { res['sort'] = options.sort; }
        if (options.searchKey) { res['search'] = options.searchKey; }
        return res;
    }
}
