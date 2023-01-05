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
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
};

console.warn = function () {
  console.logs.push(Array.from(arguments));
  console.stdwarn.apply(console, arguments);
};

console.error = function () {
  console.logs.push(Array.from(arguments));
  console.stderr.apply(console, arguments);
};

function browserLogFile() {
  return new File([JSON.stringify(console.logs), "application/json"], "browser.log");
}

export { browserLogFile };
