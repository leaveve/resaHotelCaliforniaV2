import express from 'express';
import {
  listClients,
  createClient,
  editClientForm,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';

const router = express.Router();

// Afficher tous les clients + formulaire
router.get('/', listClients);

// Ajouter un client
router.post('/', createClient);

// Formulaire modification
router.get('/:id/edit', editClientForm);

// Modifier un client
router.post('/:id/edit', updateClient);

// Supprimer un client
router.post('/:id/delete', deleteClient);

export default router;
