// arcjetMiddleware.mjs
import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 5 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: 'Too Many Requests' });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: 'No bots allowed' });
      } else {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    next();
  } catch (error) {
    console.error('Error in Arcjet Middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default arcjetMiddleware;
