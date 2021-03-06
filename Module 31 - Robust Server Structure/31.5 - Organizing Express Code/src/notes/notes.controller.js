const notes = require("../data/notes-data");

const noteExists = (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${req.params.noteId}`,
    });
  }
};

const hasText = (req, res, next) => {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  return next({ status: 400, message: "A 'text' property is required." });
};

function create(req, res, next) {
  const { data: { text } = {} } = req.body;

  const newNote = {
    id: notes.length + 1, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

function update(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));

  const originalText = foundNote.text;
  const { data: { text } = {} } = req.body;

  if (originalText !== text) {
    foundNote.text = text;
  }

  res.json({ data: foundNote });
}

function destroy(req, res, next) {
  const { noteId } = req.params;
  const index = notes.findIndex((note) => note.id === Number(noteId));
  notes.splice(index, 1);

  next({
    status: 204,
    message: `Note with ID ${req.params.noteId} has been deleted`,
  });
}

function list(req, res) {
  res.json({ data: notes });
}

function read(req, res) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.json({ data: foundNote });
}

module.exports = {
  update: [noteExists, hasText, update],
  create: [hasText, create],
  delete: [noteExists, destroy],
  list,
  read: [noteExists, read],
};
