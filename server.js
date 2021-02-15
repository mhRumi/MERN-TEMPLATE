const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,

}).then(() =>
    console.log('DB Connection is succeessfull')
);

const port  = process.env.PORT ||  8000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})  