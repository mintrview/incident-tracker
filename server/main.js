const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const incidentControllers = require("./controllers/incident.controller");

// App entry point.
const app = next({ dev: process.env.NODE_ENV !== "production" });
app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    // Register controllers.
    incidentControllers(server);

    // Fallback to nextjs handler.
    server.get("*", (req, res) => app.getRequestHandler()(req, res));

    server.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
