import db from './connexion.js';
class Chambre {
    constructor(data) {
        this.id = data.id;
        this.numero = data.numero;
        this.capacite = data.capacite;
    }
}
// Récupérer toutes les chambres
 static async findAll() {
    try {
        const [rows] = await db.execute('SELECT * FROM chambres ORDER BY numero');
        return rows.map(row => new Chambre(row));
    } catch (error) {
        throw new Error('Erreur lors de la récupération des chambres: ' + error.message);
    }
}
 // Récupérer une chambre par ID
 static async findById(id) {
    try {
        const [rows] = await db.execute('SELECT * FROM chambres WHERE id = ?', [id]);
        return rows.length > 0 ? new Chambre(rows[0]) : null;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la chambre: ' + error.message);
    }
}

