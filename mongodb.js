const { MongoClient } = require("mongodb");
const connectionString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionString);

(async () => {
    try {
        await client.connect();
        console.log('koneksi berhasil')
    }   catch (error) {
        console.error(error);
    }
})();

module.exports = client;