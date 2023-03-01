const User = require("../model/User");
const bcrypt = require("bcrypt");

////////////////////////////* Get All Users From DataBase *////////////////////////////

exports.getUser = async (req, res, next) => {
  try {
    var response = await User.find();
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
};

////////////////////////////* Get All Users From DataBase *///////////////////////////

exports.getUserById = async (req, res, next) => {
  try {
    var response = await User.findById(req.params.id);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
};

////////////////////////////* Update User By Id *////////////////////////////

exports.updateUser = async (req, res, next) => {
  try {
    var response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        number: req.body.number,
      },
      { new: true }
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
};

////////////////////////////* Update User By Id *////////////////////////////

exports.updatePassword = async (req, res, next) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    var response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        password: newPassword,
      },
      { new: true }
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
};

////////////////////////////* Delete User By Id *////////////////////////////

exports.deleteUser = async (req, res, next) => {
  try {
    var response = await User.findByIdAndRemove(req.params.userId);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
};
