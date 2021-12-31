"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const MongoDB = __importStar(require("mongodb"));
class Collection {
    mongoCollection;
    constructor(mongoCollection) {
        this.mongoCollection = mongoCollection;
    }
    async getAllDocuments() {
        return await this.mongoCollection.find({}).toArray();
    }
    async getDocumentById(id) {
        const document = await this.mongoCollection.findOne({ '_id': new MongoDB.ObjectId(id) });
        if (document === null)
            throw new Error('Document does not exist');
        return document;
    }
    async getDocumentByField(field) {
        return await this.mongoCollection.findOne({ [field]: { $exists: true } });
    }
    async insertOne(data) {
        return await this.mongoCollection.insertOne(data);
    }
    async createOrUpdateDocument(query, update) {
        const options = { upsert: true };
        return await this.mongoCollection.updateOne(query, update, options);
    }
}
exports.Collection = Collection;
class MagsMongoDB {
    config;
    url;
    client;
    db;
    constructor(config) {
        this.config = config;
        this.url = this.getUrl();
        this.client = new MongoDB.MongoClient(this.url);
        this.db; //initialized by the connect() method
    }
    getUrl() {
        return `mongodb+srv://${this.config.DBUSERNAME}:${this.config.DBPASSWORD}@${this.config.DBCLUSTERNAME}.${this.config.DBCLUSTERID}.mongodb.net/${this.config.DBNAME}?retryWrites=true&w=majority`;
    }
    async connect() {
        await this.client.connect();
        this.db = this.client.db(this.config.DBNAME);
        console.log(`Successfully connected to database: ${this.db.databaseName}`);
        return this.db;
    }
    collection(collectionName) {
        if (this.db === undefined)
            throw new Error('Client not yet initialized. Run await connect() before');
        return new Collection(this.db.collection(collectionName));
    }
}
exports.default = MagsMongoDB;
