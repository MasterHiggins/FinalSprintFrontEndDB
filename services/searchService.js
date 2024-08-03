const db = require("./db");

exports.logSearch = async (user, query, dataSource) => {
  const userId = user ? user.user_id : null;
  await db.pool.query(
    "INSERT INTO search_logs (user_id, query, data_source) VALUES ($1, $2, $3)",
    [userId, query, dataSource]
  );
};

exports.searchPostgres = async (query) => {
  const result = await db.pool.query(
    "SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1",
    [`%${query}%`]
  );

  // Increment hit count for each product found
  for (let row of result.rows) {
    await db.pool.query(
      "UPDATE products SET hit_count = hit_count + 1 WHERE product_id = $1", // Use the correct column name
      [row.product_id] // Use the correct column name
    );
  }

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

  // Log the results and update process
  console.log("MongoDB search results:", results);

  // Increment hit count for each product found in MongoDB
  for (let result of results) {
    const updateResult = await Product.updateOne(
      { _id: result._id },
      { $inc: { hit_count: 1 } }
    );
    console.log(
      `Updated product ${result._id} with hit count increment`,
      updateResult
    );
  }

  return results;
};
