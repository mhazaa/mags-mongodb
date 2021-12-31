import * as MongoDB from 'mongodb';

interface Config {
	DBUSERNAME: string;
	DBPASSWORD: string;
	DBCLUSTERNAME: string;
	DBCLUSTERID: string;
	DBNAME: string;
}

class Collection {
	mongoCollection: MongoDB.Collection;

	constructor (mongoCollection: MongoDB.Collection) {
		this.mongoCollection = mongoCollection;
	}

	public async getAllDocuments (): Promise<MongoDB.Document[]> {
		return await this.mongoCollection.find({}).toArray();
	}

	public async getDocumentById (id: string): Promise<MongoDB.Document> {
		const document = await this.mongoCollection.findOne({ '_id': new MongoDB.ObjectId(id) });
		if (document === null) throw new Error('Document does not exist');
		return document;
	}

	public async getDocumentByField (field: string): Promise<MongoDB.Document | null> {
		return await this.mongoCollection.findOne({ [field]: {$exists: true} });
	}

	public async insertOne (data: object): Promise<MongoDB.Document> {
		return await this.mongoCollection.insertOne(data);
	}

	public async createOrUpdateDocument (query: object, update: object): Promise<MongoDB.Document> {
		const options = { upsert: true };
		return await this.mongoCollection.updateOne(query, update, options);
	}
}

class DB {
	private config: Config;
	private url: string;
	private client: MongoDB.MongoClient;
	private db: MongoDB.Db | undefined;

	constructor (config: Config) {
		this.config = config;
		this.url = this.getUrl();
		this.client = new MongoDB.MongoClient(this.url);
		this.db; //initialized by the connect() method
	}

	private getUrl (): string {
		return `mongodb+srv://${this.config.DBUSERNAME}:${this.config.DBPASSWORD}@${this.config.DBCLUSTERNAME}.${this.config.DBCLUSTERID}.mongodb.net/${this.config.DBNAME}?retryWrites=true&w=majority`;
	}

	public async connect (): Promise<MongoDB.Db> {
		await this.client.connect();
		this.db = this.client.db(this.config.DBNAME);
		console.log(`Successfully connected to database: ${this.db.databaseName}`);
		return this.db;
	}

	public collection (collectionName: string): Collection {
		if (this.db === undefined) throw new Error('Client not yet initialized. Run await connect() before');
		return new Collection(this.db.collection(collectionName));
	}
}

export {
	Config,
	Collection
};
export default DB;