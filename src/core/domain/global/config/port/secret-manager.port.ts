export interface ISecretManager {
    get<T = string>(key: string): T;
}