import { openDB, IDBPDatabase, IDBPObjectStore, IDBPIndex } from 'idb';

export interface DbImage {
    id: string;
    imageUrl: string;
    size: number;
    name: string;
    pageId: string;
}

class LocalImageRepository {
    private readonly dbName: string;
    private readonly storeName: string;

    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    private async openDatabase(): Promise<IDBPDatabase> {
        const storeName = this.storeName;
        return openDB(this.dbName, 1, {
            upgrade(db) {
                db.createObjectStore(storeName, { keyPath: "id"});
            },
        });
    }

    async fetchImages(pageId: number): Promise<DbImage[]> {
        const db = await this.openDatabase();
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const index = store.index('pageId');

        return index.getAll(IDBKeyRange.only(pageId));
    }

    async saveNewImage(image: DbImage): Promise<string> {
        const db = await this.openDatabase();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);

        const id = await store.add(image);
        await tx.done;

        return String(id);
    }

    async changeImage(image: DbImage): Promise<void> {
        const db = await this.openDatabase();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);

        await store.put(image);
        await tx.done;
    }

    async removeImage(imageId: number): Promise<void> {
        const db = await this.openDatabase();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);

        await store.delete(imageId);
        await tx.done;
    }
}

export default LocalImageRepository;