import express from 'express';

export const app = express();

app.get('/', (_req, res) => {
  return res.json({ message: 'Voxieverse' });
});

app.listen(9001, () => {
  console.log('Listening to server in dev mode on port 9001');
});
