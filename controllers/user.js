const { User, Token } = require("../models");
const { randomBytes, createHash } = require("crypto");

const hash = (password) => {
  return createHash('sha256').update(password).digest('hex');
}

const createToken = (user) => {
  return Token({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};

const login = async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: hash(req.body.password),
  })

  if (user === null) {
    res.status(400).send({
      message: "Invalid username or password",
    })
    return
  }

  const token = await Token.findOne({
    user: user._id
  })

  res.status(200).send({
    token: token.token,
  })
};

const signup = async (req, res) => {
  
  const user = User({
    username: req.body.username,
    password: hash(req.body.password),
    email: req.body.email,
    name: req.body.name,
  })

  try {
    await user.save()
  } catch (err) {
    res.status(400).send({
      message: err.message,
    })
    return
  }

  const token = createToken(user)
  await token.save()
  res.status(200).send({
    token: token.token
  })
  
};

const profile = async (req, res) => {

  await req.token.populate('user').execPopulate()
  res.status(200).send({
    id: req.token.user._id,
    name: req.token.user.name,
    email: req.token.user.email,
    username: req.token.user.username,
  })
};

module.exports = { login, signup, profile };
