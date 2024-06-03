require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import cors
const mainRouter = require('./routes/main');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });
app.use(upload.single('file'));

app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
