const express = require('express');
const app = express();

app.use(express.json()); // initial Parse JSON bodies

let notes = [
  {
    id: 1,
    content: 'HTML is easy!',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  }
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === Number(id));
  console.log("show notes");

  if (note) {
    response.json(note);
  } else {
    // response.send('<h1>Llorela papaaa, no hay nada</h1>');
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const note = request.body;

  // Get all the ids
  const ids = notes.map(note => note.id);
  // Get the max id from the ids variable
  const maxId = Math.max(...ids);

  // Create a new note object
  const newNote = {
    id: Math.max(...ids) + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  console.log("new notes list:", notes);

  // Use body parser to parse the body of the request
  response.json(note);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
