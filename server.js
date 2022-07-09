const express = require('express');
const { static } = express;
const path = require('path');

const app = express();
app.use(express.json());

app.use('/dist', static(path.join(__dirname, 'dist')));
app.use(express.json());

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/groceries', async(req, res, next)=> {
  try {
    res.send(await Grocery.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/groceries/:id', async(req,res,next) => {
  try {

    const thing = await Grocery.findByPk(req.params.id);
    await thing.destroy();
    res.sendStatus(204);

  }catch(er){
    next(er);
  }
})

app.put('/api/groceries/:id', async(req, res, next)=> {
  try {
    const grocery = await Grocery.findByPk(req.params.id);
    await grocery.update(req.body);
    res.send(grocery);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/groceries', async(req, res, next)=> {
  try {
    res.send(await Grocery.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/groceries/random', async(req, res, next)=> {
  try {
    res.send(await Grocery.createRandom());
  }
  catch(ex){
    next(ex);
  }
});

const init = async()=> {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

const Sequelize = require('sequelize');
const { STRING, BOOLEAN } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_grocery_db');
const { faker } = require('@faker-js/faker');

const Grocery = conn.define('grocery', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  purchased: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
});

Grocery.createRandom = function(){
  return Grocery.create({ name: faker.commerce.productName()});
}
const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  await Promise.all([
    Grocery.create({ name: 'milk' }),
    Grocery.create({ name: 'eggs' }),
    Grocery.create({ name: 'cheeze', purchased: true })
  ]);
};

init();

