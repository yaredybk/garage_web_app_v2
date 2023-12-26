import { openDB } from "idb";

async function create(name = "myDb") {
    console.log("creating db:", name);
    const db = await openDB(name, 1, {
        upgrade(db) {
            // Create a store of objects
            const store = db.createObjectStore(name, {
                // The 'id' property of the object will be the key.
                keyPath: "id",
                // If it isn't explicitly set, create a value by auto incrementing.
                autoIncrement: true,
            });
            // Create an index on the 'date' property of the objects.
            store.createIndex("date", "date");
        },
    });
}
async function add(dbname = "myDb", type, blob, title = "unknown") {
    // console.log("creating db: ", dbname);
    const db = await openDB(dbname, 1, {
        upgrade(db) {
            // Create a store of objects
            const store = db.createObjectStore(dbname, {
                // The 'id' property of the object will be the key.
                keyPath: "id",
                // If it isn't explicitly set, create a value by auto incrementing.
                autoIncrement: true,
            });
            // Create an index on the 'date' property of the objects.
            // store.createIndex('title', 'title');
        },
    });
    // Add an article:
    await db.add(dbname, {
        title,
        type,
        data: blob,
    });

    // Add multiple articles in one transaction:
    //   {
    //     const tx = db.transaction('articles', 'readwrite');
    //     await Promise.all([
    //       tx.store.add({
    //         title: 'Article 2',
    //         date: new Date('2019-01-01'),
    //         body: '…',
    //       }),
    //       tx.store.add({
    //         title: 'Article 3',
    //         date: new Date('2019-01-02'),
    //         body: '…',
    //       }),
    //       tx.done,
    //     ]);
    //   }

    // Get all the articles in date order:
    //   console.log("fetch all",await db.getAllFromIndex(dbname,'id'));
    //   console.log(await db.getAllFromIndex(dbname, 'date'));

    // Add 'And, happy new year!' to all articles on 2019-01-01:
    //   {
    //     const tx = db.transaction('articles', 'readwrite');
    //     const index = tx.store.index('date');

    //     for await (const cursor of index.iterate(new Date('2019-01-01'))) {
    //       const article = { ...cursor.value };
    //       article.body += ' And, happy new year!';
    //       cursor.update(article);
    //     }

    //     await tx.done;
    //   }
}

const myindexed = { create, add };
export { myindexed };
