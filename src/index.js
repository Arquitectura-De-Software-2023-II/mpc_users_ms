const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.js')
const dashboardRoutes = require('./routes/dashboard.js')
const petRoutes = require('./routes/pet.js')
const verifyToken = require('./routes/validate-token.js')
const cors = require('cors')
require('dotenv').config()

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a la base de datos')
  })
  .catch((e) => {
    console.log('Database error', e)
  })

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

const app = express()

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoutes)
app.use('/pet', petRoutes)
app.use('/dashboard', verifyToken, dashboardRoutes)


app.get('/', (req, res) => {
  res.json({ mensaje: 'My Auth Api Rest' })
})

const PORT = process.env.PORT || 3080
app.listen(PORT, () => {
  console.log(`Tu servidor está corriendo en el puerto: ${PORT}`)
})
