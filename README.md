# Final Sprint Full Stack and Database

to start the program you will need a .env file with:<br>
PGUSER,
PGHOST,
PGDATABASE,
PGPASSWORD,
PGPORT,
PORT,
SESSION_SECRET and
JWT_SECRET

---

#### Project Overview

- **Goal:** Create a search secure engine with data stored in PostgreSQL and MongoDB.

#### Project Requirements

1. **Choose Subject Area:**

   - Select a topic for the search engine.

2. **Generate Mock Data:**

   - Use mock data generators or find sample databases.
   - Ensure more than 100 rows of data.
   - Suggested tools: Mockaroo, Software Testing Help.

3. **Set Up Databases:**

   - **PostgreSQL:** Insert mock data using SQL insert statements.
   - **MongoDB:** Insert mock data using JSON files.
   - Tools: pgAdmin, MongoDB Compass, and MongoDB shell.

4. **Build Node.js Objects and Query Display:**

   - Create webpages for query input and result display.
   - Users should choose their data source(s): PostgreSQL, MongoDB, or both.
   - Implement a home page, login page, signup page, and search page.

5. **Implement Security Features:**

   - Ensure users sign up and log in before accessing search functionality.
   - Use packages like passport.js or build a basic registration and login system.

6. **Display Search Results:**

   - Show results similar to Google search results.
   - Use EJS to render search results on the page.

7. **Log Search Queries:**

   - Save each query keyword with a timestamp and user ID.
   - Store logs in PostgreSQL, MongoDB, or on disk.

8. - **Logging:**

- Implement logging for each search query.
- Store logs in databases or on disk.

---

#### Bonus Features

- **Automated Unit Testing:**

  - Implement tests for parts of the code.

- **Enhanced User Experience:**
  - Use CSS with EJS for better UI/UX.

---
