import express from 'express';
import {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} from '../controllers/reservationsController.js';

const router = express.Router();

//  Récupérer toutes les réservations
router.get('/', getReservations);

//  Récupérer une réservation par ID
router.get('/:id', getReservationById);

//  Créer une nouvelle réservation
router.post('/', createReservation);

//  Mettre à jour une réservation existante
router.put('/:id', updateReservation);

//  Supprimer une réservation
router.delete('/:id', deleteReservation);

export default router;
