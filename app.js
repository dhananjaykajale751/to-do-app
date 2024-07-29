// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const tasksFilePath = path.join(__dirname, "data", "tasks.json");

// Load tasks from the JSON file
const loadTasks = () => {
    try {
        const data = fs.readFileSync(tasksFilePath);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save tasks to the JSON file
const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

let tasks = loadTasks();

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);
    res.render("list", { kindOfDay: day, newListItems: tasks });
});

app.post("/", function(req, res) {
    var newTask = {
        name: req.body.newItem,
        description: req.body.newDescription,
        timestamp: new Date().toISOString
