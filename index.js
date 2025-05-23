// Simple redirect to the main HTML page
module.exports = (req, res) => {
  res.writeHead(302, { Location: '/' });
  res.end();
};
