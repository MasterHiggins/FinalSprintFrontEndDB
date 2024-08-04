const fs = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");

const logEvents = async (event, level, message) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${level}\t${event}\t${message}\n`;

  try {
    const logDir = path.join(__dirname, "..", "logs");
    const year = format(new Date(), "yyyy");
    const month = format(new Date(), "MM");
    const day = format(new Date(), "dd");
    const yearDir = path.join(logDir, year);
    const monthDir = path.join(yearDir, month);
    const dayDir = path.join(monthDir, day);

    await fs.mkdir(dayDir, { recursive: true });

    const logFile = event.toLowerCase().includes("error")
      ? "error.log"
      : "events.log";
    const logPath = path.join(dayDir, logFile);

    await fs.appendFile(logPath, logItem);
    console.log("Log written successfully:", logPath);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
};

const events = require("events");
const myEmitter = new events.EventEmitter();

myEmitter.on("log", (event, message) => logEvents(event, "INFO", message));
myEmitter.on("error", (event, message) => logEvents(event, "ERROR", message));

module.exports = myEmitter;
