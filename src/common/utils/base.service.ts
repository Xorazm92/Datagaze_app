import db from 'src/config/database.config';

export class BaseService<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async findAll(): Promise<T[]> {
        return await db(this.tableName).select('*');
    }

    async findById(id: string): Promise<T> {
        return await db(this.tableName).where({ id }).first();
    }

    async create(data: Partial<T>): Promise<T> {
        return (await db(this.tableName).insert(data).returning('*'))[0];
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        return (await db(this.tableName).where({ id }).update(data).returning('*'))[0];
    }

    async delete(id: string): Promise<void> {
        await db(this.tableName).where({ id }).delete();
    }
}