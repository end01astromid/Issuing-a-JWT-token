const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router()



module.exports = (users) => { // Регистрация
  router.post('/register',async(req,res)=>{
  const {name,login,password} = req.body
  if(!name || !login || !password){
    return res.status(400).json({error: 'Заполните все поля'})
  }

  const existingUser = await users.findOne({login})
  if(existingUser){
     return res.status(400).json({ error: 'Пользователь уже существует' });
  }
  const hash = await bcrypt.hash(password, 10)

  try{
    await users.insertOne({name,login, password: hash})
    res.json({ message: 'Регистрация успешна' });
  }catch(error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
  })
  
   router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    const user = await users.findOne({ login });
    if (!user) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    res.json({ message: 'Авторизация прошла отлично', name: user.name });
  });
  return router
}