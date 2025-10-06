import db from './connexion.js';

class Reservation {
    constructor(data) {
        this.id = data.id;
        this.id_client = data.id_client;
        this.chambre_id = data.chambre_id;
        this.date_arrivee = data.date_arrivee;
        this.date_depart = data.date_depart;
        this.nombre_personnes = data.nombre_personnes;
    }

    // Récupérer toutes les réservations
    static async findAll() {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, c.nom AS client_nom, ch.numero AS chambre_numero
                FROM reservations r
                JOIN clients c ON r.id_client = c.id
                JOIN chambres ch ON r.chambre_id = ch.id
                ORDER BY r.date_arrivee DESC
            `);
            return rows.map(row => new Reservation(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations : ' + error.message);
        }
    }

    // Récupérer une réservation par ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations WHERE id = ?', [id]);
            return rows.length > 0 ? new Reservation(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la réservation : ' + error.message);
        }
    }

    // Créer une réservation
    static async create(resData) {
        try {
            // Vérifier la disponibilité de la chambre
            const [rows] = await db.execute(`
                SELECT COUNT(*) AS count
                FROM reservations
                WHERE chambre_id = ?
                AND (
                    (date_arrivee <= ? AND date_depart > ?)
                    OR (date_arrivee < ? AND date_depart >= ?)
                    OR (date_arrivee >= ? AND date_depart <= ?)
                )
            `, [
                resData.chambre_id,
                resData.date_arrivee, resData.date_arrivee,
                resData.date_depart, resData.date_depart,
                resData.date_arrivee, resData.date_depart
            ]);

            if (rows[0].count > 0) {
                throw new Error('La chambre n’est pas disponible pour ces dates.');
            }

            const [result] = await db.execute(
                'INSERT INTO reservations (id_client, chambre_id, date_arrivee, date_depart, nombre_personnes) VALUES (?, ?, ?, ?, ?)',
                [
                    resData.id_client,
                    resData.chambre_id,
                    resData.date_arrivee,
                    resData.date_depart,
                    resData.nombre_personnes
                ]
            );

            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création de la réservation : ' + error.message);
        }
    }

    // Mettre à jour une réservation
    async update(resData) {
        try {
            await db.execute(
                `UPDATE reservations 
                 SET id_client = ?, chambre_id = ?, date_arrivee = ?, date_depart = ?, nombre_personnes = ?
                 WHERE id = ?`,
                [
                    resData.id_client,
                    resData.chambre_id,
                    resData.date_arrivee,
                    resData.date_depart,
                    resData.nombre_personnes,
                    this.id
                ]
            );

            Object.assign(this, resData);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de la réservation : ' + error.message);
        }
    }

    // Supprimer une réservation
    async delete() {
        try {
            await db.execute('DELETE FROM reservations WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la réservation : ' + error.message);
        }
    }

    // Récupérer les réservations d'un client
    static async findByClient(id_client) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM reservations WHERE id_client = ? ORDER BY date_arrivee DESC',
                [id_client]
            );
            return rows.map(row => new Reservation(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations du client : ' + error.message);
        }
    }
}

export default Reservation;
