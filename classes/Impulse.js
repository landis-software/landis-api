/* This Class connects to the Impulse Database, acts as a base to run MySQL functions specific for the Garry's Mod Impulse Framework */

/* I'm writing this in class without Node.JS to test my code, so this is running on a 'fake' MySQL instance */

mysql = require('mysql');

class Impulse {
  
  // get a user by their database ID
  fetchUserById(id) {
    if (!this.db) {
      console.error("Not connected to database!")
    }
    
    let queryString = "SELECT * FROM `impulse_players` WHERE `id` = \"" + id.toString() + "\"";
    
    // returns <Promise> in theory :p
    return mysql.query(queryString); // query then process into ImpulseUser class, which will eventually become a super class as User
  }
  
  constructor(db) {
    this.db = mysql.connect({
      ip: db.ip,
      user: db.user,
      password: db.pass,
      database: db.name,
      port: db.port
    });
  }
}

module.exports = Impulse;
