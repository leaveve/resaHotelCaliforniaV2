import db from '../config/connexion.js';

class Client {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM clients');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(clientData) {
    const [result] = await db.execute(
      'INSERT INTO clients (nom, prenom, email) VALUES (?, ?, ?)',
      [clientData.nom, clientData.prenom, clientData.email]
    );
    return result.insertId;
  }

  static async update(id, clientData) {
    await db.execute(
      'UPDATE clients SET nom = ?, prenom = ?, email = ? WHERE id = ?',
      [clientData.nom, clientData.prenom, clientData.email, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM clients WHERE id = ?', [id]);
  }
}

export default Client;
