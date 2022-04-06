const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    methods: ['GET']
}));
app.get('/elearning', cors(), (req, res, next) => {
    res.send(myFavouriteAuthor);
});

    const myFavouriteAuthor = [
    {
        "myFavouriteAuthor": "Dawn Brown"
    }
];

app.get('/elearning', (req, res) =>{
    res.send(ingredients);
});
app.listen(8282);
