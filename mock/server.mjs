import jsonServer from "json-server";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "leads.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Search middleware
server.use((req, res, next) => {
  if (req.originalUrl.startsWith("/leads") && req.query.search) {
    const searchQuery = String(req.query.search).toLowerCase();
    const db = router.db;

    const filteredLeads = db
      .get("leads")
      .filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchQuery) ||
          lead.email?.toLowerCase().includes(searchQuery) ||
          lead.phone?.toLowerCase().includes(searchQuery) ||
          lead.status?.toLowerCase().includes(searchQuery) ||
          (lead.tags &&
            lead.tags.some((tag) =>
              String(tag).toLowerCase().includes(searchQuery)
            ))
      )
      .value();

    res.json(filteredLeads);
    return;
  }
  next();
});

// Bulk update
server.post("/leads/bulk-update", (req, res) => {
  const { ids, updates } = req.body;
  const db = router.db;

  if (!Array.isArray(ids) || typeof updates !== "object") {
    res.status(400).json({ message: "Invalid payload" });
    return;
  }

  ids.forEach((id) => {
    db.get("leads").find({ id }).assign(updates).write();
  });

  res.status(200).json({ message: "Bulk update successful" });
});

server.use(router);

server.listen(5047, () => {
  console.log("Mock API running at http://localhost:5047");
});
