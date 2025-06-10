import { Knex } from 'knex';

export abstract class BaseService<T> {
    constructor(
        protected readonly knex: Knex,
        protected readonly tableName: string,
    ) {}

    async findAll(): Promise<T[]> {
        return this.knex(this.tableName).select('*');
    }

    async findById(id: string): Promise<T> {
        return this.knex(this.tableName).where({ id }).first();
    }

    async create(data: Partial<T>): Promise<T> {
        const [result] = await this.knex(this.tableName)
            .insert(data)
            .returning('*');
        return result;
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const [result] = await this.knex(this.tableName)
            .where({ id })
            .update(data)
            .returning('*');
        return result;
    }

    async delete(id: string): Promise<void> {
        await this.knex(this.tableName).where({ id }).delete();
    }
}