import express from "express"
import cors from "cors"
import { MongoClient, ObjectId }  from "mongodb"

const app = express()
app.use(cors())
app.use(express.json())

// Endpoint logowania
app.post("/api/login", async (req, res) => {
  const { username, password, login } = req.body;
  const userLogin = username || login;
  // Szukaj użytkownika w kolekcji users
  const user = await db.collection("users").findOne({ login: userLogin });
  if (user && user.password === password) {
    res.json({ success: true, token: "test-token" });
  } else {
    res.status(401).json({ success: false, message: "Błędny login lub hasło" });
  }
})

const MONGO_URL = "mongodb://localhost:27017"
const DB_NAME = "managme"
let db

MongoClient.connect(MONGO_URL).then(client => {
  db = client.db(DB_NAME)
  app.listen(4000, () => {
    console.log("Backend działa na http://localhost:4000")
  })
})

app.get("/api/projects", async (req, res) => {
  const projects = await db.collection("projects").find().toArray()
  res.json(projects.map(p => ({ ...p, id: p._id })))
})

app.post("/api/projects", async (req, res) => {
  const { name, description } = req.body
  const result = await db.collection("projects").insertOne({ name, description })
  res.json({ id: result.insertedId, name, description })
})

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  await db.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: { name, description } })
  res.json({ id, name, description })
})

app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params
  await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
  res.json({ id })
})

app.get("/api/projects/:projectId/stories", async (req, res) => {
  const { projectId } = req.params
  const stories = await db.collection("stories").find({ projectId }).toArray()
  res.json(stories.map(s => ({ ...s, id: s._id })))
})

app.post("/api/projects/:projectId/stories", async (req, res) => {
  const { projectId } = req.params
  const story = { ...req.body, projectId }
  const result = await db.collection("stories").insertOne(story)
  res.json({ ...story, id: result.insertedId })
})

app.put("/api/projects/:projectId/stories/:id", async (req, res) => {
  const { id } = req.params
  // Usuń id i _id z body, żeby nie próbować ich nadpisywać
  const { id: _, _id, ...fieldsToUpdate } = req.body
  console.log("Aktualizuję story:", id, fieldsToUpdate)
  const result = await db.collection("stories").updateOne(
    { _id: new ObjectId(id) },
    { $set: fieldsToUpdate }
  )
  console.log("Mongo wynik:", result)
  res.json({ id, ...fieldsToUpdate })
})

app.delete("/api/projects/:projectId/stories/:id", async (req, res) => {
  const { id } = req.params
  await db.collection("stories").deleteOne({ _id: new ObjectId(id) })
  res.json({ id })
})

app.get("/api/me", (req, res) => {
  const auth = req.headers.authorization
  if (auth === "Bearer test-token") {
    res.json({
      id: "1",
      firstName: "Admin",
      lastName: "Konto"
    })
  } else {
    res.status(401).json({ message: "Nieautoryzowany" })
  }
})

// TASKS CRUD
app.get("/api/tasks", async (req, res) => {
  const tasks = await db.collection("tasks").find().toArray();
  res.json(tasks.map(t => ({ ...t, id: t._id })));
});

app.get("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ ...task, id: task._id });
});

app.post("/api/tasks", async (req, res) => {
  const task = {
    ...req.body,
    status: "todo",
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection("tasks").insertOne(task);
  res.json({ ...task, id: result.insertedId });
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { id: _, _id, ...fieldsToUpdate } = req.body;
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    { $set: fieldsToUpdate }
  );
  res.json({ id, ...fieldsToUpdate });
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
  res.json({ id });
});