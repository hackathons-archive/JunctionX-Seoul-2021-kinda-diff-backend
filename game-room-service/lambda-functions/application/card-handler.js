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
  let cards = [];

  // generateRandomCard().then((data) => cards.push(data));
  // generateRandomCard().then((data) => cards.push(data));
  cards.push(generateRandomCard());
  cards.push(generateRandomCard());

  console.info(
    `Card Geneate: ${cards[0]['rank']} ${cards[0]['suit']}, ${cards[1]['rank']} ${cards[1]['suit']}`
  );
  response.statusCode = 202;
  response.body = cards;
  callback(null, response);
};

const generateRandomCard = () => {
  const suitRandom = Math.floor(Math.random() * 3);
  const ranksRandom = Math.floor(Math.random() * 9);
  const card = {
    suit: suits[suitRandom],
    rank: ranks[ranksRandom],
  };
  return card;
  // return new Promise((resolve) => {
  //   resolve({ card });
  // });
};
