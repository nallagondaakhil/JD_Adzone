export class ObjectUtil {
    static deepClone(obj: any) {
        if (!obj) { return; }
        return JSON.parse(JSON.stringify(obj));
    }
}
