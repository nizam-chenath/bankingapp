const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const session = require('express-session');
const cors = require('cors')
const Schema = mongoose.Schema;

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect("mongodb+srv://admin:admin123@cluster0.a1xqqjl.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

  // Define user schema
  
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactions:  [{
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      }],
  });
  
  const User = mongoose.model('User', userSchema);

  // Middleware to verify JWT token
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  }

// Endpoint for user registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ email }, 'secret_key');
    res.json({ token });
  });

  // Endpoint for user login
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ email }, 'secret_key');
    res.json({ token });
  });

  app.post('/logout', verifyToken, async (req, res) => {
    const { email } = jwt.decode(req.token);
    try {
      await User.findOneAndUpdate({ email }, { $unset: { token: 1 } });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Endpoint for cash deposit


  app.post('/deposit', verifyToken, async (req, res) => {
    const { amount } = req.body;
    const { email } = jwt.decode(req.token);
    try {
      const user = await User.findOneAndUpdate({ email }, { $inc: { balance: amount },  $push: { transactions: { type: 'deposit', amount } } }, { new: true });
     
      res.json({ success: true, balance: user.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/withdraw', verifyToken, async (req, res) => {
    const { amount } = req.body;
    const { email } = jwt.decode(req.token);
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (user.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
   
      user.balance -= amount;
      user.transactions.push({ type: 'withdraw', amount });
      await user.save();
  
      res.json({ success: true, balance: user.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //for statement
  app.get('/statement', verifyToken, async (req, res) => {
    if(jwt.decode(req.token) == null){
        return res.status(401).json({message: 'token is required'})
    }
    else{
        const { email } = jwt.decode(req.token);
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          const statement = user.transactions.map(({ amount, type, date }) => ({ amount, type, date }));
        res.json({ statement });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
    }
    
  });
  

app.listen(port, () => console.log(`Server running on port ${port}`));
