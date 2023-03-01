const User = require('../model/User');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mailer = require("../middleware/Mailsender");


////////////////////////* Registration Part *////////////////////////

exports.register = async (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(50).trim(true).required(),
        last_name: Joi.string().min(3).max(50).trim(true).required(),
        email: Joi.string().lowercase().min(6).max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        number: Joi.string().pattern(/^[0-9]+$/).required(),
        password: Joi.string().trim(true).required()
    })

    var { error } = await schema.validate(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    var existUser = await User.findOne({ "email": req.body.email }).exec();
    if (existUser) return res.status(400).send({ msg: "Email already exists.", status: "error" });

    var existNumber = await User.findOne({ "number": req.body.number }).exec();
    if (existNumber) return res.status(400).send({ msg: "Number already exists.", status: "error" });

    const salt = await bcrypt.genSalt(10);
    const Password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        number: req.body.number,
        password: Password
    })
    try {
        var response = await user.save();
        res.status(201).send({ msg: "You Have Successfully Registered Your Account..!", status: "success" }).send(response);
    } catch (err) {
        res.status(400).send(err);
    }

}


////////////////////////* Login Part *////////////////////////


exports.login = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(50).email().required(),
        password: Joi.string().min(4).max(15).required()
    })

    try {
        var { error } = await schema.validate(req.body);
        if (error) return res.status(400).send({ msg: error.details[0].message });

        var existUser = await User.findOne({ "email": req.body.email }).exec();
        if (!existUser) return res.status(400).send({ msg: "Email not reqistered", status: "error" });
        var user = {};
        user.first_name = existUser.first_name;
        user.last_name = existUser.last_name;
        user._id = existUser._id;


        var isValid = await bcrypt.compare(req.body.password, existUser.password);
        if (!isValid) return res.status(400).send({ msg: "Password doesn't match.", status: "error" });

        var token = jwt.sign({ user }, 'SWERA', { expiresIn: '2h' });
        res.send({ userToken: token, status: "success" });
    } catch (err) {
        res.status(400).send(err);
    }
}

////////////////////////////* Google Registration Part *////////////////////////////

exports.googleregister = async (req, res, next) => {
  var existUser = await User.findOne({ email: req.body.email }).exec();

  try {
    if (!existUser) {
      const schema = Joi.object({
        first_name: Joi.string().min(3).max(50).trim(true).required(),
        last_name: Joi.string().min(3).max(50).trim(true).required(),
        email: Joi.string()
          .lowercase()
          .min(6)
          .max(50)
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required(),
        g_password: Joi.string().trim(true).required(),
      });

      var { error } = await schema.validate(req.body);
      if (error) return res.status(400).send({ msg: error.details[0].message });

      const salt = await bcrypt.genSalt(10);
      const G_password = await bcrypt.hash(req.body.g_password, salt);

      let userSave = new User({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        g_password: G_password,
      });

      await userSave.save();
    }

    let user = {
      first_name: existUser.first_name,
      last_name: existUser.last_name,
      _id: existUser._id,
    };

    var isValid = await bcrypt.compare(
      req.body.g_password,
      existUser.g_password
    );
    if (!isValid)
      return res
        .status(400)
        .send({ msg: "Password doesn't match.", status: "error" });

    var token = jwt.sign({ user }, "SWERA", { expiresIn: "2h" });
    res.send({ userToken: token, status: "success" });
  } catch (err) {
    res.status(400).send(err);
  }
};

////////////////////////* Forgot Password *////////////////////////

exports.forgotpassword = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
  });
  try {
    var { error } = await schema.validate(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    var existUser = await User.findOne({ email: req.body.email }).exec();
    if (!existUser)
      return res
        .status(400)
        .send({ msg: "Email not reqistered", status: "error" });

    var user = {
      id: existUser._id,
    };

    var token = jwt.sign({ user }, "SWERA", { expiresIn: "2m" });

    const data = {
      email: req.body.email,
      id: existUser._id,
      token: token,
    };

    await Mailer.mailer(data);    
    res.status(200).send({ msg: "Reset password link has been sent to your mail." });
  } catch (err) {
    res.status(400).send(err);
  }
};

