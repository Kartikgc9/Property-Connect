declare module 'openai';

// External module declarations for backend packages without TypeScript support

declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function compareSync(data: string, encrypted: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
}

declare module 'joi' {
  export interface ValidationError {
    details: Array<{
      message: string;
      path: string[];
      type: string;
      context?: any;
    }>;
  }
  
  export interface ValidationResult<T> {
    error?: ValidationError;
    value: T;
  }
  
  export interface Schema<T = any> {
    validate(value: any, options?: any): ValidationResult<T>;
    required(): Schema<T>;
    optional(): Schema<T>;
    min(limit: number): Schema<T>;
    max(limit: number): Schema<T>;
    length(limit: number): Schema<T>;
    pattern(regex: RegExp): Schema<T>;
    email(): Schema<T>;
    alphanum(): Schema<T>;
    valid(...values: any[]): Schema<T>;
    invalid(...values: any[]): Schema<T>;
  }
  
  export function string(): Schema<string>;
  export function number(): Schema<number>;
  export function boolean(): Schema<boolean>;
  export function array(): Schema<any[]>;
  export function object(schema?: Record<string, Schema>): Schema<any>;
  export function date(): Schema<Date>;
  export function any(): Schema<any>;
  export function alternatives(): Schema<any>;
  export function ref(key: string): any;
}

declare module 'multer' {
  import { Request } from 'express';
  
  export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
  
  export interface Options {
    dest?: string;
    storage?: any;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
    preservePath?: boolean;
    fileFilter?: (req: Request, file: MulterFile, callback: (error: Error | null, acceptFile: boolean) => void) => void;
  }
  
  export interface Multer {
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    none(): any;
    any(): any;
  }
  
  export function multer(options?: Options): Multer;
  export default multer;
}

declare module 'aws-sdk' {
  export class S3 {
    constructor(options?: any);
    upload(params: any): any;
    deleteObject(params: any): any;
    getObject(params: any): any;
    listObjects(params: any): any;
  }
  
  export class SES {
    constructor(options?: any);
    sendEmail(params: any): any;
    sendRawEmail(params: any): any;
  }
  
  export const config: {
    update(options: any): void;
  };
}

declare module 'nodemailer' {
  export interface TransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    service?: string;
  }
  
  export interface MailOptions {
    from?: string;
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename?: string;
      content?: string | Buffer;
      path?: string;
      contentType?: string;
    }>;
  }
  
  export interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>;
    verify(): Promise<boolean>;
  }
  
  export function createTransporter(options: TransportOptions): Transporter;
  export function createTransport(options: TransportOptions): Transporter;
}

declare module 'redis' {
  export interface RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    retryDelayOnFailover?: number;
    enableReadyCheck?: boolean;
    maxRetriesPerRequest?: number;
  }
  
  export class Redis {
    constructor(options?: RedisOptions);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<string>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    ttl(key: string): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    flushall(): Promise<string>;
    quit(): Promise<string>;
    disconnect(): void;
  }
  
  export function createClient(options?: RedisOptions): Redis;
}

declare module 'socket.io' {
  export interface ServerOptions {
    cors?: {
      origin?: string | string[] | boolean;
      methods?: string[];
      credentials?: boolean;
    };
    transports?: string[];
    allowEIO3?: boolean;
  }
  
  export interface Socket {
    id: string;
    emit(event: string, ...args: any[]): void;
    on(event: string, callback: (...args: any[]) => void): void;
    join(room: string): void;
    leave(room: string): void;
    disconnect(): void;
  }
  
  export class Server {
    constructor(httpServer?: any, options?: ServerOptions);
    on(event: string, callback: (socket: Socket) => void): void;
    emit(event: string, ...args: any[]): void;
    to(room: string): any;
    close(): void;
  }
}

declare module 'web3' {
  export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    gasUsed: number;
    status: boolean;
  }
  
  export interface Account {
    address: string;
    privateKey: string;
  }
  
  export class Web3 {
    constructor(provider?: any);
    eth: {
      getBalance(address: string): Promise<string>;
      getTransactionReceipt(hash: string): Promise<TransactionReceipt>;
      sendTransaction(transaction: any): Promise<TransactionReceipt>;
      accounts: {
        create(): Account;
        privateKeyToAccount(privateKey: string): Account;
      };
    };
    utils: {
      toWei(value: string, unit?: string): string;
      fromWei(value: string, unit?: string): string;
      isAddress(address: string): boolean;
    };
  }
  
  export default Web3;
}

declare module 'compression' {
  import { RequestHandler } from 'express';
  
  export interface CompressionOptions {
    level?: number;
    threshold?: number;
    filter?: (req: any, res: any) => boolean;
  }
  
  export default function compression(options?: CompressionOptions): RequestHandler;
}

declare module 'express-validator' {
  export interface ValidationResult {
    isEmpty(): boolean;
    array(): Array<{
      msg: string;
      param: string;
      location: string;
      value: any;
    }>;
  }
  
  export function body(field: string): any;
  export function query(field: string): any;
  export function param(field: string): any;
  export function validationResult(req: any): ValidationResult;
  export function check(field: string): any;
}

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  
  export interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: any) => string;
    onLimitReached?: (req: any, res: any, options: any) => void;
  }
  
  export default function rateLimit(options?: RateLimitOptions): RequestHandler;
}