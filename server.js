const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

let DB;
let port;

    DB = process.env.DATABASE_TEST
    port = process.env.PORT;



app.listen(port, () => {
    console.log(`app is running port ${port} in ${process.env.NODE_ENV}`);
});

// console.log(process.env);

// const DB = process.env.DATABASE_LIVE


mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!')).catch((err) => {
        console.log(err);
    });