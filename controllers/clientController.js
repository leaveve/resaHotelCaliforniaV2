// controllers/clientController.js
import { validationResult } from 'express-validator';
import Client from '../models/Client.js';

class ClientController {
    // Afficher la liste des clients
    static async index(req, res) {
        try {
            const clients = await Client.findAll();
            res.render('clients/index', {
                title: 'Gestion des Clients',
                clients: clients
            });
        } catch (error) {
            res.redirect('/');
        }
    }

    // Afficher le formulaire de création
    static create(req, res) {
        res.render('clients/create', {
            title: 'Ajouter un Client',
            client: {},
            errors: []
        });
    }

    // Traiter la création d'un client
    static async store(req, res) {
        try {
            const validatorErrors = validationResult(req);
            const errors = [];

            if (!validatorErrors.isEmpty()) {
                validatorErrors.array().forEach(error => {
                    errors.push({ msg: error.msg });
                });
            }

            if (!req.body.nom || req.body.nom.trim() === '') {
                errors.push({ msg: 'Le nom est requis' });
            }

            if (!req.body.prenom || req.body.prenom.trim() === '') {
                errors.push({ msg: 'Le prénom est requis' });
            }

            if (!req.body.email || req.body.email.trim() === '') {
                errors.push({ msg: 'L\'email est requis' });
            }

            if (!req.body.telephone || req.body.telephone.trim() === '') {
                errors.push({ msg: 'Le téléphone est requis' });
            }

            if (!req.body.nombre_personnes || req.body.nombre_personnes.trim() === '') {
                errors.push({ msg: 'Le nombre de personnes est requis' });
            }

            if (errors.length > 0) {
                return res.render('clients/create', {
                    title: 'Ajouter un Client',
                    client: req.body,
                    errors: errors
                });
            }

            await Client.create(req.body);
            res.redirect('/clients');
        } catch (error) {
            res.render('clients/create', {
                title: 'Ajouter un Client',
                client: req.body,
                errors: [{ msg: error.message }]
            });
        }
    }

    // Afficher le formulaire d'édition
    static async edit(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                return res.redirect('/clients');
            }
            res.render('clients/edit', {
                title: 'Modifier le Client',
                client: client,
                errors: []
            });
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // Traiter la mise à jour d'un client
    static async update(req, res) {
        try {
            const validatorErrors = validationResult(req);
            const errors = [];

            if (!validatorErrors.isEmpty()) {
                validatorErrors.array().forEach(error => {
                    errors.push({ msg: error.msg });
                });
            }

            if (errors.length > 0) {
                const client = await Client.findById(req.params.id);
                return res.render('clients/edit', {
                    title: 'Modifier le Client',
                    client: { ...client, ...req.body, id_client: req.params.id },
                    errors: errors
                });
            }

            const unClient = await Client.findById(req.params.id);
            if (unClient) {
                await Client.update(req.params.id, req.body);
            }
            res.redirect('/clients');
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // Afficher la confirmation de suppression
    static async delete(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                return res.redirect('/clients');
            }
            res.render('clients/delete', {
                title: 'Supprimer le Client',
                client: client
            });
        } catch (error) {
            res.redirect('/clients');
        }
    }

    // Traiter la suppression d'un client
    static async destroy(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                return res.redirect('/clients');
            }
            await Client.delete(req.params.id);
            res.redirect('/clients');
        } catch (error) {
            if (req.session) {
                req.session.messages = [{ type: 'error', text: error.message }];
            }
            res.redirect('/clients');
        }
    }
}

export default ClientController;
