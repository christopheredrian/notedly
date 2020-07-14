const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const gravatar = require('../util/gravatar');

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

  },
  signUp: async (parent, { username, email, password }, { models }) => {

    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    } catch (e) {
      console.log(e);
      throw new Error('Error creating account.');
    }
  },

  signIn: async (parent, {username, email, password}, {models}) => {

    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{email}, {username}]
    });


    if (!user) {
      throw new AuthenticationError("Error signing in");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError("Error signing in");
    }

    return jwt.sign({id: user._id}, process.env.JWT_SECRET);
  }
};