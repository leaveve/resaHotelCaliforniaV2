import db from '../models/connexion.js'; // Connexion à 0ta base
import Reservation from './models/Reservation.js';


// Fonction de formatage de date (comme PHP)
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

// Contrôleur pour récupérer toutes les réservations
export const getReservations = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.id, r.date_arrivee, r.date_depart, r.nombre_personnes,
                   c.nom AS client_nom, c.telephone AS client_telephone, c.email AS client_email,
                   ch.numero AS chambre_numero, ch.capacite AS chambre_capacite
            FROM reservations r
            JOIN clients c ON r.id_client = c.id
            JOIN chambres ch ON r.chambre_id = ch.id
            ORDER BY r.date_arrivee DESC
        `);

        const today = new Date().toISOString().split('T')[0];

        const reservations = rows.map(r => {
            let statut = "À venir";
            let statut_class = "";

            if (r.date_depart < today) {
                statut = "Terminée";
                statut_class = "status-past";
            } else if (r.date_arrivee <= today && r.date_depart >= today) {
                statut = "En cours";
                statut_class = "status-active";
            }

            return {
                ...r,
                date_arrivee: formatDate(r.date_arrivee),
                date_depart: formatDate(r.date_depart),
                statut,
                statut_class
            };
        });

        res.render('reservations/index', { reservations });
    } catch (error) {
        console.error('Erreur lors du chargement des réservations :', error);
        res.status(500).send("Erreur serveur");
    }
};
