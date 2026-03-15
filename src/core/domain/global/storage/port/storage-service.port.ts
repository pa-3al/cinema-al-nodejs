export interface IStorageService {
    uploadFile(fileName: string, file: Buffer): Promise<any>;
    getFileUrl(fileName: string): Promise<string>;
    downloadFile(fileName: string): Promise<Buffer>;
    listBuckets(): Promise<any[]>;
}