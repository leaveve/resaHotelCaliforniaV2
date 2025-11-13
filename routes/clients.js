// routes/clientRoutes.js

import express from 'express';
import { body } from 'express-validator';
import ClientController from '../controllers/clientController.js';

const router = express.Router();

// Validation des données du client
const clientValidation = [
    body('nom')
        .notEmpty()
        .withMessage('Le nom du client est obligatoire')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit faire entre 2 et 50 caractères'),
    body('prenom')
        .notEmpty()
        .withMessage('Le prénom du client est obligatoire')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit faire entre 2 et 50 caractères'),
    body('email')
        .notEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('L\'email doit être valide'),
    body('telephone')
        .notEmpty()
        .withMessage('Le téléphone est obligatoire')
        .isLength({ min: 10, max: 15 })
        .withMessage('Le téléphone doit faire entre 10 et 15 caractères'),
    body('nombre_personnes')
        .notEmpty()
        .withMessage('Le nombre de personnes est obligatoire')
        .isInt({ min: 1, max: 50 })
        .withMessage('Le nombre de personnes doit être un nombre entre 1 et 50')
];

router.get('/clients', ClientController.index);
router.get('/clients/create', ClientController.create);
router.post('/clients', clientValidation, ClientController.store);
router.get('/clients/:id/edit', ClientController.edit);
router.post('/clients/:id/edit', clientValidation, ClientController.update);
router.get('/clients/:id/delete', ClientController.delete);
router.post('/clients/:id/delete', ClientController.destroy);

export default router;
