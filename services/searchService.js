const db = require("./db");

exports.logSearch = async (user, query) => {
  const userId = user ? user.user_id : null;
  await db.pool.query(
    "INSERT INTO search_logs (user_id, query) VALUES ($1, $2)",
    [userId, query]
  );
};

exports.searchPostgres = async (query) => {
  const result = await db.pool.query(
    "SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1",
    [`%${query}%`]
  );
  return result.rows;
};

exports.searchMongo = async (query) => {
  if (!db.mongoose || !db.mongoose.connection.readyState) {
    throw new Error("MongoDB not connected");
  }

  const Product = db.mongoose.model("Product");
  const regex = new RegExp(query, "i");
  const results = await Product.find({
    $or: [{ name: regex }, { description: regex }],
  });
  return results;
};
