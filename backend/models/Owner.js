import db from "../database/connectiondb.js";

class Owner {
  static async getAllOwners() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM propietarios", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static async getOwnerById(propietario_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM propietarios WHERE propietario_id = ?",
        [propietario_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.length > 0 ? results[0] : null);
        }
      );
    });
  }


  static async deleteOwner(propietario_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE propietarios SET propietario_estado = 0 WHERE propietario_id = ?",
        [propietario_id],
        (err, results) => {
          if (err) return reject(err);
          resolve({ affected: results.affectedRows });
        }
      );
    });
  }
}

export default Owner;
