module.exports = {
  get: jest.fn().mockResolvedValue(null), // acts like Redis has no cache
  setex: jest.fn(), // don't need to test this
  del: jest.fn(),   // no need to test this
};
