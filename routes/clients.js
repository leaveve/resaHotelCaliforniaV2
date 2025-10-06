// routes/clientRoutes.js
import express from 'express';
import { body } from 'express-validator';
import ClientController from '../controllers/clientController.js';

const router = express.Router();

// Validation des données de client
const clientValidation = [
    body('nom')
        .notEmpty()
        .withMessage('Le nom est obligatoire')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit faire entre 2 et 50 caractères')
        .trim()
        .escape(),
    
    body('prenom')
        .notEmpty()
        .withMessage('Le prénom est obligatoire')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit faire entre 2 et 50 caractères')
        .trim()
        .escape(),
    
    body('email')
        .notEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('L\'email doit être une adresse valide')
        .normalizeEmail(),
    
    body('telephone')
        .notEmpty()
        .withMessage('Le téléphone est obligatoire')
        .matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
        .withMessage('Le téléphone doit être un numéro français valide'),
    
    body('adresse')
        .notEmpty()
        .withMessage('L\'adresse est obligatoire')
        .isLength({ min: 5, max: 200 })
        .withMessage('L\'adresse doit faire entre 5 et 200 caractères')
        .trim()
];

router.get('/', ClientController.index);
router.get('/create', ClientController.create);
router.post('/', clientValidation, ClientController.store);
router.get('/:id/edit', ClientController.edit);
router.put('/:id', clientValidation, ClientController.update);
router.get('/:id/delete', ClientController.delete);
router.delete('/:id', ClientController.destroy);

export default router;
