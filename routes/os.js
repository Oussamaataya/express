var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/', function (req, res, next) {
    res.json({
        hostname: os.hostname(),
        platform: os.platform(),
        type: os.type()
    });
});


router.get('/cpus', function (req, res, next) {
    res.json(os.cpus());
});


router.get('/cpus/:id', (req, res) => {
    const cpus = os.cpus();
    const cpu = cpus[req.params.id]; 

    if (!cpu) {
        return res.status(404).json({ error: 'Processeur non trouvé' });
    }

    res.json(cpu);
});


module.exports = router;
