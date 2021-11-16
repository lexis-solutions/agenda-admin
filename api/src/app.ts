import express from 'express';
import path from 'path';

const app = express();

app.use('/', express.static(path.join(__dirname, '../../client/build')));

app.listen(4000, () => console.info('App running on port 4000'));
