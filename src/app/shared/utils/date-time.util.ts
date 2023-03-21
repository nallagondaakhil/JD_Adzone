export class DateTimeUtil {
    static toShortDate(val: number) {
        const dateObj = new Date();
        const month = String(dateObj.getMonth()).padStart(2, '0');
        const day =  String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    }

    static shortDateToMilliseconds(date: string) {
        // todo convertion
        return new Date().getTime();
    }
}
