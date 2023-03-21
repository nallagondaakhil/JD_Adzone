export class FileUtil {
    static getExtension(filename: string): string {
        if (filename.indexOf('.') === -1) {
          return null;
        }
        return filename.split('.').pop().toLowerCase();
      }
}
