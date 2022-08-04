/**
 * Try getting an environment variable from process.env. Throws an error if the variable is not set.
 * @param key Environment variable to look for
 * @returns string
 */
function getOsEnv(key) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key];
}

/**
 * Try getting an environment variable from process.env (optional)
 * @param key Environment variable to look for
 * @returns string | undefined
 */
function getOsEnvOptional(key) {
  return process.env[key];
}

function normalizePort(port) {
  const parsedPort = parseInt(port, 10);

  if (isNaN(parsedPort)) { // named pipe
    return port;
  }

  if (parsedPort >= 0) { // port number
    return parsedPort;
  }

  return false;
}

module.exports = {
  getOsEnv,
  getOsEnvOptional,
  normalizePort
};