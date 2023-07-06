const app = require("./app");

const PORT = process.env.PORT || 8027;

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
