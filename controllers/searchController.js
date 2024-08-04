const {
  searchPostgres,
  searchMongo,
  logSearch,
} = require("../services/searchService");
const myEmitter = require("../services/logEvents"); // Import the event emitter

exports.renderSearchPage = (req, res) => {
  res.render("search", {
    stat: req.session.stat,
    results: [],
    searchPerformed: false,
  });
};

exports.performSearch = async (req, res) => {
  const query = req.body.query;
  const usePostgres = req.body.database === "Postgres";
  const useMongo = req.body.database === "MongoDB";
  const useBoth = req.body.database === "Both";

  if (!query) {
    return res.render("search", {
      stat: req.session.stat,
      results: [],
      searchPerformed: false,
    });
  }

  let results = [];
  let dataSource = "";
  try {
    if (usePostgres || useBoth) {
      const postgresResults = await searchPostgres(query, req.user);
      results = results.concat(postgresResults);
      dataSource = useBoth ? "Both" : "Postgres";
    }
    if (useMongo || useBoth) {
      const mongoResults = await searchMongo(query, req.user);
      results = results.concat(mongoResults);
      dataSource = useBoth ? "Both" : "MongoDB";
    }
    await logSearch(req.user, query, dataSource);
    myEmitter.emit(
      "log",
      "search",
      `Search performed by ${req.user.username} using ${dataSource}`
    );
    res.render("search", {
      stat: req.session.stat,
      results,
      query,
      searchPerformed: true,
    });
  } catch (error) {
    myEmitter.emit("error", "search", `Search error: ${error.message}`);
    res.status(500).send("Error performing search");
  }
};
