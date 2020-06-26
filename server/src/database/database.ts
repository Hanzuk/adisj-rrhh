import { Pool, PoolConnection, createPool } from 'mysql';

class Database {
  private pool: Pool;
  private connection: PoolConnection;

  constructor() {
    this.pool = createPool({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'adisj',
    });

    this.setConnection();
  }

  private async setConnection(): Promise<void> {
    this.connection = await this.getPoolConnection();
  }

  private getPoolConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  public query(query: string, values: string | number | Array<any> | object) {
    return new Promise<any>((resolve, reject) => {
      this.connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }

  public async startTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  public async rollbackTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.rollback((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  public async commitTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

export default new Database();
