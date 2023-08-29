import express from 'express'
import mongoose from 'mongoose'

/*const Animal = mongoose.model('Animal', new mongoose.Schema({
    species: String,
    averageWeight: String,
    color: String
}))*/

const animalSchema = new mongoose.Schema({
    species: String,
    averageWeight: String,
    color: String
}, { collection: 'animals' }); // Especifica el nombre de la colección como 'animals'

// Crea el modelo
const Animal = mongoose.model('Animal', animalSchema);


const app = express()

mongoose.connect('mongodb://jaime:password@monguito:27017/zoo?authSource=admin', {
    serverSelectionTimeoutMS: 30000, // Aumentar el tiempo de espera a 30 segundos
  })


app.get('/animals', async(_req,res) => {
    console.log('getting animals registered in zoo')
    const animals = await Animal.find();
    return res.send(animals)
})

app.post('/animal', async (_req, res) => {
    console.log('creating animal')
    await Animal.create({species: _req.query.species, averageWeight: _req.query.averageWeight, color: _req.query.color})
    return res.status(200).send()
})

app.listen(3000, () => console.log('listening...'))