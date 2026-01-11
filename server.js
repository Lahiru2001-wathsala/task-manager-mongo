const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// --- REST API ROUTES ---

// GET: Fetch all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST: Add a new task
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.status(201).json(newTask);
});

// PUT: Edit task text
app.put('/api/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        { text: req.body.text }, 
        { new: true }
    );
    res.json(updatedTask);
});

// PATCH: Toggle completion
app.patch('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));