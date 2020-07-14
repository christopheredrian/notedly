const models = require('../models');

module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find();
  },
  note: (parent, args, { models }, info) => {
    return models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    // find a user given their username
    return models.User.findOne({ username: username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  }
};