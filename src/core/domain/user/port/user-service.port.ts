export interface IUserServicePort {
    findById(id: string): Promise<any>;
}