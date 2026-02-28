let cool = require('cool-ascii-faces');
let express = require('express');
const app = express();

app.get('/cool',(req, res) =>{
    res.send(cool())
} )

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})