const { Pool } = require("pg");
const dbconfig = require("../config/dbconfig.js");

const pool = new Pool(dbconfig.postgres);

module.exports = pool;