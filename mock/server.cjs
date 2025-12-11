const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "leads.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Bulk update endpoint with ID check
server.post("/leads/bulk-update", (req, res) => {
  const { ids, data } = req.body;
  const db = router.db;

  if (!Array.isArray(ids) || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updatedIds = [];
  const notFoundIds = [];

  ids.forEach((id) => {
    const lead = db.get("leads").find({ id }).value();
    if (lead) {
      db.get("leads").find({ id }).assign(data).write();
      updatedIds.push(id);
    } else {
      notFoundIds.push(id);
    }
  });

  res.json({
    updated: updatedIds.length,
    updatedIds,
    notFoundIds,
  });
});

server.use(router);

server.listen(5047, () => {
  console.log("Mock API running at http://localhost:5047");
});
