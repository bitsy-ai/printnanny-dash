// capture console output
declare global {
  interface Console {
    stdlog: any;
    stdwarn: any;
    stderr: any;
    logs: any;
  }
}

console.stdlog = console.log.bind(console);
console.stdwarn = console.warn.bind(console);
console.stderr = console.error.bind(console);

console.logs = [];

console.log = function () {
  // attempt to JSON.stringify log line
  let line = "[INFO]";
  try {
    line += JSON.stringify(Array.from(arguments));
  } catch {
    // JSON.stringify failed, for example with error:
    // TypeError: Converting circular structure to JSON
    line += `console.log failed to JSON.stringify arguments: ${arguments}`;
  }
  console.logs.push(line);
  console.stdlog.apply(console, arguments);
};

console.warn = function () {
  // attempt to JSON.stringify log line
  let line = "[WARN]";
  try {
    line += JSON.stringify(Array.from(arguments));
  } catch {
    // JSON.stringify failed, for example with error:
    // TypeError: Converting circular structure to JSON
    line += `console.warn Failed to JSON.stringify arguments: ${arguments}`;
  }
  console.logs.push(line);
  console.stdwarn.apply(console, arguments);
};

console.error = function () {
  let line = "[ERROR]";
  try {
    line += JSON.stringify(Array.from(arguments));
  } catch {
    // JSON.stringify failed, for example with error:
    // TypeError: Converting circular structure to JSON
    line += `console.warn Failed to JSON.stringify arguments: ${arguments}`;
  }
  console.logs.push(line);
  console.stderr.apply(console, arguments);
};

function browserLogFile() {
  return new File(
    [JSON.stringify(console.logs), "application/json"],
    "browser.log"
  );
}

export { browserLogFile };
