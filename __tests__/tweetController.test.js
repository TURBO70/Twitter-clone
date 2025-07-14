jest.mock('../config/db.config');
jest.mock('../config/redisCache'); // redis won't do anything now
jest.mock('../events');

const { postTweet } = require('../controllers/tweet.controllers');
const pool = require('../config/db.config');

describe('postTweet', () => {
  const req = {
    body: { text: 'Hello Twitter' },
    user: { username: 'youssef' },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tweet and return it', async () => {
    const mockTweet = { id: 1, text: 'Hello Twitter', username: 'youssef' };
    pool.query.mockResolvedValueOnce({ rows: [mockTweet] });

    await postTweet(req, res, next);

    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: mockTweet });
  });
});
