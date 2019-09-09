const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    //select * from post
    db('accounts')
        .select("*")
        .then(account => {
            res.status(200).json(account)
        })
        .catch(err => {
            res.json(err)
        });
});

server.get('/:id', (req, res) => {
    //select * from posts where id = 2
    const { id } = req.params

    db('accounts')
        .where({ id })
        .first()
        .then(account => {
            res.status(200).json(account)
        })
        .catch(err => {
            res.json(err)
        });
});

server.post('/', (req, res) => {
    //insert into posts() values ()
    const postData = req.body;

    db('accounts')
        .insert(postData, 'id')
        .then(([id]) => {
            db('accounts')
                .where({ id })
                .first()
                .then(post => {
                    res.status(201).json(post)
                })
        })
        .catch(err => {
            res.json(err);
        });
});

server.put('/:id', (req, res) => {
    //update posts set.... where id = 123
    const postChange = req.body;

    db('accounts')
        .where('id', req.params.id)
        .update(postChange)
        .then(count => {
            res.status(200).json({ message: `update ${count} record` })
        })
        .catch(err => {
            res.json(err);
        });
});

server.delete('/:id', (req, res) => {
    //delete from posts where...
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200).json({ message: `deleted ${count} records` })
        })
        .catch(err => {
            res.json(err)
        })
});



//custom middleware:

function validateAccountId(req, res, next) {
    const { id } = req.params;

    db(id)

        .then(account => {
            console.log(account)
            if (account) {
                req.account = account;
                next();
            } else {
                res.status(400).json({ message: "invalid project id" })
            }
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "Could not validate project with the specified id" })
        })


}

module.exports = server;