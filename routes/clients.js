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
        .withMessage('Le nom doit faire entre 2 et 50 caractères'),
    body('prenom')
        .notEmpty()
        .withMessage('Le prénom est obligatoire')
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit faire entre 2 et 50 caractères'),
    body('email')
        .notEmpty()
        .withMessage("L'email est obligatoire")
        .isEmail()
        .withMessage("Le format de l'email n'est pas valide")
];

router.get('/', ClientController.index);
router.get('/create', ClientController.create);
router.post('/', clientValidation, ClientController.store);
router.get('/:id/edit', ClientController.edit);
router.put('/:id', clientValidation, ClientController.update);
router.get('/:id/delete', ClientController.delete);
router.delete('/:id', ClientController.destroy);

module.exports = router;