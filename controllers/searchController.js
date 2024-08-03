const {
  searchPostgres,
  searchMongo,
  logSearch,
} = require("../services/searchService");

exports.renderSearchPage = (req, res) => {
  res.render("search", { stat: req.session.stat, results: [] });
};

exports.performSearch = async (req, res) => {
  const query = req.body.query;
  const usePostgres = req.body.database === "Postgres";
  const useMongo = req.body.database === "MongoDB";
  const useBoth = req.body.database === "Both";

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
    await logSearch(req.user, query, dataSource); // Log search with data source
    res.render("search", { stat: req.session.stat, results, query });
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).send("Error performing search");
  }
};
