const response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST',
    'Content-Type': 'application/json',
  },
  body: '',
  isBase64Encoded: false,
};

const suits = ['hearts', 'diams', 'clubs', 'spades'];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

exports.getTwoRandomCards = async (event, context, callback) => {
  let card = [];
  card.push(generateRandomCard());
  card.push(generateRandomCard());

  response.statusCode = 202;
  response.body = card;
  callback(null, response);
};

const generateRandomCard = async () => {
  const suitRandom = Math.floor(Math.random() * 3);
  const ranksRandom = Math.floor(Math.random() * 9);

  const card = {
    suit: suits[suitRandom],
    rank: ranks[ranksRandom],
  };
  return card;
};
