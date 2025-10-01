import Client from '../models/Client.js';

export const listClients = async (req, res) => {
  const clients = await Client.findAll();
  res.render('clients/index', { clients });
};

export const createClient = async (req, res) => {
  await Client.create(req.body);
  res.redirect('/clients');
};

export const editClientForm = async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.render('clients/edit', { client });
};

export const updateClient = async (req, res) => {
  await Client.update(req.params.id, req.body);
  res.redirect('/clients');
};

export const deleteClient = async (req, res) => {
  await Client.delete(req.params.id);
  res.redirect('/clients');
};
