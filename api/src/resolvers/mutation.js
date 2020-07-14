const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const gravatar = require('../util/gravatar');

module.exports = {
  /**
   * @param parent
   * @param args
   * @param models
   * @param user
   * @returns {Promise<*>}
   */
  newNote: async (parent, args, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id) // set the author as the user
    });
  },
  /**
   * @param parent
   * @param id
   * @param models
   * @param user
   * @returns {Promise<boolean>}
   */
  deleteNote: async (parent, { id }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError('You don\'t have permission to delete the note');
    }

    try {

      // everything is ok, remote the note
      await note.remove();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  /**
   * @param parent
   * @param content
   * @param id
   * @param models
   * @param user
   * @returns {Promise<*>}
   */
  updateNote: async (parent, { content, id }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError('You don\'t have the permission to update the note.');
    }

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
  /**
   * @param parent
   * @param username
   * @param email
   * @param password
   * @param models
   * @returns {Promise<undefined|*>}
   */
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
      throw new Error('Error creating account.');
    }
  },
  /**
   * @param parent
   * @param username
   * @param email
   * @param password
   * @param models
   * @returns {Promise<undefined|*>}
   */
  signIn: async (parent, { username, email, password }, { models }) => {

    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });


    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  /**
   * @param parent
   * @param id
   * @param models
   * @param user
   * @returns {Promise<*>}
   */
  toggleFavorite: async (parent, { id }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('Please sign in');
    }

    // check to see if the user has already favorited the note
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      // if the user exists in the list
      // pull them from the list and reduce the favoriteCount by 1
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        }, {
          // set new to true to return the updated doc
          new: true
        });
    } else {
      // the user doesn't exist in the list
      // add them to the list and increment the favorite count by 1
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }

  }
};