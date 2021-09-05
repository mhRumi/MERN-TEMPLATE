const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// const DB = "mongodb://rumi:pass@db:27017"

mongoose.connect(DB, {
    useNewUrlParser: true,

}).then(() =>
    console.log('DB Connection is succeessfull on ' + DB)
).catch(err => {
    console.log(err)
});

const port  = process.env.PORT ||  8000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})  