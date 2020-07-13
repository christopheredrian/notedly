const models =  require('../models');

module.exports = {
  notes: async (parent, args, {models}) => {
    return await models.Note.find();
  },
  note: (parent, args, {models}, info) => {
    return models.Note.findById(args.id);
  }
};