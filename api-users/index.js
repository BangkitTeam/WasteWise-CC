const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());

// Routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  return res.send(html);
});

// REST API
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = req.body;
    const user = users.find((user) => user.id === id);
    Object.assign(user, updatedUser);
    return res.json(user);
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);
    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.json(user);
  });

app.post("/api/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  return res.json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
