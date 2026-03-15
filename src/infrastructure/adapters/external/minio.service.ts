import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as Minio from 'minio';
import * as secretManagerInterface from '../../../core/domain/global/config/port/secret-manager.port';
import { IStorageService } from '../../../core/domain/global/storage/port/storage-service.port';
import {SECRET_PORT} from "../../../core/domain/global/token";

@Injectable()
export class MinioService implements IStorageService, OnModuleInit {
    private client!: Minio.Client;
    private bucketName!: string;

    constructor(
        @Inject(SECRET_PORT)
        private readonly secrets: secretManagerInterface.ISecretManager,
    ) {}

    async onModuleInit() {
        this.bucketName = this.secrets.get('MINIO_BUCKET');
        this.client = new Minio.Client({
            endPoint: this.secrets.get('MINIO_ENDPOINT'),
            port: parseInt(this.secrets.get('MINIO_PORT'), 10),
            useSSL: this.secrets.get('MINIO_USE_SSL') === 'true',
            accessKey: this.secrets.get('MINIO_ACCESS_KEY'),
            secretKey: this.secrets.get('MINIO_SECRET_KEY'),
        });

        try {
            if (!(await this.client.bucketExists(this.bucketName))) {
                await this.client.makeBucket(this.bucketName);
            }
        } catch (error) {
            console.log(`Erreur à l'initialisation du bucket: ${error}`);
            throw error;
        }
    }

    async listBuckets() {
        return this.client.listBuckets();
    }

    async uploadFile(fileName: string, file: Buffer) {
        return this.client.putObject(this.bucketName, fileName, file);
    }

    async getFileUrl(fileName: string) {
        return this.client.presignedGetObject(this.bucketName, fileName, 86400);
    }

    async downloadFile(fileName: string): Promise<any> {
        return this.client.getObject(this.bucketName, fileName);
    }
}
