const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const user = req.user;
    const timeline = req.timeline;
    const friends = req.friends;
    // const messages = req.messages.events;
    const messages = req.messages;    
    res.render('index', { user, timeline, friends, messages });
});

module.exports = router;