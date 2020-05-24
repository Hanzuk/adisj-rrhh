import { Pool, PoolConnection, createPool, QueryFunction } from 'mysql';

class Database {
  private pool: Pool;
  private connection: PoolConnection;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    this.pool = await this.createPool();
    this.connection = await this.getPoolConnection();
  }

  private createPool(): Promise<Pool> {
    return new Promise((resolve, reject) => {
      const p: Pool = createPool({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'adisj',
      });

      return p ? resolve(p) : reject(new Error('Error connecting to database'));
    });
  }

  private getPoolConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  public query(query: string, values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, results) => {
        return err ? reject(err) : resolve(results);
      });
    });
  }
}

export default new Database();
