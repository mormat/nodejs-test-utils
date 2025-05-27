const path = require('path');

const uris = {
    'quick_brown_fox': 'file://' + path.join(__dirname, 'quick_brown_fox.html'),
    'clickables':      'file://' + path.join(__dirname, 'clickables.html'),
    'waits':           'file://' + path.join(__dirname, 'waits.html'),
}

module.exports = { uris }