const { seedDatabase } = require('mongo-seeding');
const path = require('path');

console.log("Seeding started...");

const config = {
    database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'ZAPDDB',
    },
    inputPath: path.resolve(__dirname, './data'),
    dropDatabase: true,
};

(async () => {
    try {
        await seedDatabase(config);
    } catch (err) {
        console.log("ERROR Seeding the test data. The app still work. You can just create users and test it. The seed just to make it easier to test.");
    }
    console.log("Done seeding.");
    console.log("Now start the app with 'npm start'");
})()
