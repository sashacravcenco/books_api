var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var data = require('./data/books');
const books = require('./data/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* Homework:
Create an express application which will work with Books entity.
A book entity should be made of: { id: number, author: string, name: 'string', release: date, collection: string }
 Create CRUD operations for the books entity. Validation should be applied.
Release should never be in future. And the types when update/create should be preserved, ex: collection should be string and is required. If anything is wrong you should return the right status code, no 500 allowed.
Create a .js file which if run inside the browser or console will populate the API with at least 5 books, will update some books using id, will remove any books.
Methods to be defined inside express:
PUT /books/:id
POST /books
GET /books
DELETE /books/:id
DELETE /books?id[]=1&id[]=2 */

function isPresent(field) {
    return field !== undefined && field !== null;
}


function validateDate(date) {
    return new Date(date).getTime() < new Date().getTime();
}

function validateString(field) {
    return typeof field === 'string' && field.trim() !== '';
}

function validateBookForCreate(book) {
    return validateString(book.author) &&
        validateString(book.name) && 
        validateString(book.collection) && validateDate(book.release);
}

function validateBookForUpdate(book) {
    return (!isPresent(book.author) || validateString(book.author)) &&
    (!isPresent(book.name) || validateString(book.name)) &&
    (!isPresent(book.collection) || validateString(book.collection)) &&
    (!isPresent(book.release) || validateDate(book.release));
}



function createBook(body) {
    return {
        author: body.author,
        name: body.name,
        release: body.release,
        collection: body.collection,
    };
}

 
app.get('/books', (req, res) => {
    return res.status(200).send(data.BOOKS).end();
}
     
    
)

app.post('/books', (req, res) => {
        const book = createBook(req.body);
    
        if (validateBookForCreate(book)) {
            const _id = data.BOOKS.length + 1;
            data.BOOKS.push({_id, ...book})
            return res.status(201).end();
        } else {
            return res.status(400).end();
        }    
    }
);


app.put('/books/:id', (req, res) => {
    const bookToUpdate = data.BOOKS.find(b => b._id === Number(req.params.id));
    const book = createBook(req.body);

    if (validateBookForUpdate(book)) {
        Object.assign(bookToUpdate, req.body);
        return res.status(200).end();    
    } else {
        return res.status(400).end();
    }
    
});

app.delete('/books/:id',(req, res) => {
    data.BOOKS = data.BOOKS.filter(book =>  book._id !== Number(req.params.id));
    return res.status(200).end();
});

app.delete('/books', (req, res) => {
    const ids = req.query.id;
    data.BOOKS = data.BOOKS.filter(book => !ids.includes(String(book._id)));
    return res.status(200).end();
});

module.exports = app;
