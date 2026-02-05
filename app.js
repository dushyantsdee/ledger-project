const fs = require("fs");

fs.writeFileSync("note.txt", "Name: Parth\nCourse: B.Tech 2nd year");

const data = fs.readFileSync("note.txt", "utf8");
console.log(data);

fs.appendFileSync("note.txt", "\nLearning Node.js fs module");
