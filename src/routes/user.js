const router = require('express').Router()
const User = require('../models/user')
const Joi = require('@hapi/joi')
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require("../models/user");
const verifyToken = require('./validate-token');

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().required()
})

// Esquema del login
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

const ldap = require('ldap');
const client = ldap.createClient({
    url: 'ldap://localhost',
    searchBase: 'dc=example,dc=com'
});

client.bind('cn=admin,dc=example,dc=com', 'password', (err) => {
    if (err) {
        console.error('Error binding to LDAP server:', err);
        return;
    }

    client.search({
        filter: `(&(email={email})&(objectClass=person))`,
        scope: ldap.constants.SUBTREE,
        attributes: ['dn', 'name', 'email', 'role']
    }, (err, searchResult) => {
        if (err) {
            console.error('Error searching LDAP server:', err);
            return;
        }

        const user = searchResult.entries[0].toObject();

        if (!user) {
            console.error('User not found');
            return;
        }

        // Validar la contraseña del usuario
        if (user.password !== req.body.password) {
            console.error('Invalid password');
            return;
        }

        // Autenticar y autorizar al usuario
        console.log('User authenticated and authorized');
    });
});

// LOGIN
router.post('/login', async (req, res) => {
    // Validaciones de login
    const { error } = schemaLogin.validate(req.body)
    if(error) return res.status(400).json({error: error.details[0].message})
    
    // Validaciond e existencia
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).json({error: 'Usuario no encontrado'})

    // Validacion de password en la base de datos
    // const validPassword = await bcrypt.compare(req.body.password, user.password)
    const validPassword = req.body.password === user.password
    if(!validPassword) return res.status(400).json({error: 'Constraseña invalida'})

    // Creando token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)
    
    // Colocando el token en el header y el cuerpo de la respuesta
    res.header('auth-token', token).json({
        // error: null,
        // data: { token },
        data: { token }
        // message: 'Bienvenido'
    })
})


// REGISTER
router.post('/register', async (req, res) => {

    const { error } = schemaRegister.validate(req.body)

    if (error) {
        console.log(error.details[0].message)
        return res.status(400).json(
            { error: error.details[0].message }
        )
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json(
            {error: 'Email ya registrado'}
        )
    }

    // const salt = await bcrypt.genSalt(10)
    // const password = await bcrypt.hash(req.body.password, salt)
    const password = req.body.password

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role
    });
    try {
        const savedUser = await user.save()
        res.json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
})


// get all users
router.get("/getall", (req, res) => {
    userSchema
      .find()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
  
  // get a user
  router.get("/get", (req, res) => {
    const email = req.body;
    userSchema
      .findByEmail(email)
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
  
  // delete a user
  router.delete("/delete", (req, res) => {
      const email = req.body.email;
      userSchema
        .deleteOne({email})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    });
  
  // update a user
  router.put("/put", (req, res) => {
    const { email, password } = req.body;
    userSchema
      .updateOne({ email }, { $set: { password } })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });

  router.get('/verify', verifyToken,(req, res) => {
    res.status(200).json(req.body.user)
  })


module.exports = router