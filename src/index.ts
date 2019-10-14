import express from 'express';
import { renderImage } from './renderer';

const app = express();

const PORT = process.env.CARAMEL_PORT || 3000;

interface Query {
  title: string;
  body: string;
}

const extractQuery = (req: express.Request): Query | null => {
  if (req.query.title != null && req.query.body != null) {
    try {
      return {
        title: decodeURIComponent(req.query.title),
        body: decodeURIComponent(req.query.body)
      };
    } catch (e) {
      return null;
    }
  }
  return null;
};

app.get('/', function(req, res) {
  const query = extractQuery(req);
  if (query == null) {
    res.status(400).send('');
    return;
  }
  res.type('png').send(renderImage(query.title, query.body));
});

app.listen(PORT, () => console.log(`caramel is running on 0.0.0.0:${PORT}🌟`));
