module.exports = {
  newNote: async (parent, args, { models }) => {
    return await models.Note.create({
      content: args.content,
      author: args.author || 'Chris Esp'
    });
  },
  deleteNote: async (parent, { id }, { models }) => {

    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    try {

      return await models.Note.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            content
          }
        },
        {
          new: true
        }
      );
    } catch (e) {

    }

  }
};