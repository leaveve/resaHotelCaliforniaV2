import db from './connexion.js';

class Client {
    constructor(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
    }

    // Récupérer tous les clients
    static async findAll() {
        try {
            // On trie par nom puis prénom pour un affichage propre
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
                'INSERT INTO clients (nom, prenom, email) VALUES (?, ?, ?)',
                [clientData.nom, clientData.prenom, clientData.email]
            );
            return result.insertId;
        } catch (error) {
            // Gestion de l'erreur si l'email est marqué comme UNIQUE dans la base de données
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cet email est déjà utilisé par un autre client');
            }
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    // Mettre à jour un client
    async update(clientData) {
        try {
            await db.execute(
                'UPDATE clients SET nom = ?, prenom = ?, email = ? WHERE id = ?',
                [clientData.nom, clientData.prenom, clientData.email, this.id]
            );
            this.nom = clientData.nom;
            this.prenom = clientData.prenom;
            this.email = clientData.email;
            return true;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cet email est déjà utilisé par un autre client');
            }
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    // Supprimer un client
    async delete(id) {
        try {
            // Vérifier s'il y a des réservations associées à ce client
            // Attention: on suppose ici que la colonne dans la table reservations est 'client_id'
            const [reservations] = await db.execute(
                'SELECT COUNT(*) as count FROM reservations WHERE client_id = ?',
                [id]
            );

            if (reservations[0].count > 0) {
                throw new Error('Impossible de supprimer le client car des réservations lui sont associées');
            }
            
            await db.execute('DELETE FROM clients WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }
}

module.exports = Client;