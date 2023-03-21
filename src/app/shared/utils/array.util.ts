export class ArrayUtil {
    static markAsDeleted(newArr: any[], oldArr: any[], idColumn = 'id', deleteFalg = 'isDeleted') {
        if (!newArr || !oldArr) { return; }
        oldArr.forEach(old => {
            if (!old || old[idColumn] == null) { return; }
            const id = old[idColumn];
            if (!newArr.find(y => y[idColumn] === id)) {
                old[deleteFalg] = true;
                newArr.push(old);
            }
        });
        return newArr;
    }
}
