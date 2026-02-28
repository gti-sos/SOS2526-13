let cool = require('cool-ascii-faces');
let express = require('express');
const app = express();

app.use(express.static(require("public"));

app.get('/cool',(req, res) =>{
    res.send(cool())
} )

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});





app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})
