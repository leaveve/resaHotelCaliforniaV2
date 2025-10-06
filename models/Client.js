// models/Client.js
import db from './connexion.js';

class Client {
    constructor(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
        this.telephone = data.telephone;
        this.nombre_personnes = data.nombre_personnes;
    }

    // Récupérer tous les clients
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom, prenom');
            return rows.map(row => new Client(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des clients: ' + error.message);
        }
    }

    // Récupérer un client par ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du client: ' + error.message);
        }
    }

    // Créer un nouveau client
    static async create(clientData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO clients (nom, prenom, email, telephone, nombre_personnes) VALUES (?, ?, ?, ?, ?)',
                [clientData.nom, clientData.prenom, clientData.email, clientData.telephone, clientData.nombre_personnes]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cet email existe déjà');
            }
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    // Mettre à jour un client
    static async update(id, clientData) {
        try {
            const [result] = await db.execute(
                'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, nombre_personnes = ? WHERE id = ?',
                [clientData.nom, clientData.prenom, clientData.email, clientData.telephone, clientData.nombre_personnes, id]
            );
            
            if (result.affectedRows === 0) {
                throw new Error('Client non trouvé');
            }
            
            return true;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cet email existe déjà');
            }
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    // Supprimer un client
    static async delete(id) {
        try {
            // Vérifier s'il y a des réservations associées
            const [reservations] = await db.execute(
                'SELECT COUNT(*) as count FROM reservations WHERE client_id = ?',
                [id]
            );

            if (reservations[0].count > 0) {
                throw new Error('Impossible de supprimer le client, des réservations sont associées');
            }

            await db.execute('DELETE FROM clients WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }

    // Vérifier si un email existe déjà
    static async emailExists(email, excludeId = null) {
        try {
            let query = 'SELECT COUNT(*) as count FROM clients WHERE email = ?';
            let params = [email];

            // Exclure l'ID actuel lors de la mise à jour
            if (excludeId) {
                query += ' AND id != ?';
                params.push(excludeId);
            }

            const [rows] = await db.execute(query, params);
            return rows[0].count > 0;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de l\'email: ' + error.message);
        }
    }

    // Rechercher un client par email
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE email = ?', [email]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la recherche du client: ' + error.message);
        }
    }

    // Récupérer les réservations d'un client
    static async getReservations(clientId) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, c.numero as chambre_numero
                FROM reservations r
                JOIN chambres c ON r.chambre_id = c.id
                WHERE r.client_id = ?
                ORDER BY r.date_arrivee DESC
            `, [clientId]);
            return rows;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations: ' + error.message);
        }
    }
}

export default Client;
