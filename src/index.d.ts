import * as MongoDB from 'mongodb';
interface Config {
    DBUSERNAME: string;
    DBPASSWORD: string;
    DBCLUSTERNAME: string;
    DBCLUSTERID: string;
    DBNAME: string;
}
declare class Collection {
    mongoCollection: MongoDB.Collection;
    constructor(mongoCollection: MongoDB.Collection);
    getAllDocuments(): Promise<MongoDB.Document[]>;
    getDocumentById(id: string): Promise<MongoDB.Document>;
    getDocumentByField(field: string): Promise<MongoDB.Document | null>;
    insertOne(data: object): Promise<MongoDB.Document>;
    createOrUpdateDocument(query: object, update: object): Promise<MongoDB.Document>;
}
declare class DB {
    private config;
    private url;
    private client;
    private db;
    constructor(config: Config);
    private getUrl;
    connect(): Promise<MongoDB.Db>;
    collection(collectionName: string): Collection;
}
export { Config, Collection };
export default DB;
