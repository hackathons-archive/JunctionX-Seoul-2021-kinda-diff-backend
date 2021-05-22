const ddb = new AWS.DynamoDB();
const { ROOM_TABLE_NAME } = process.env;
const oneDayFromNow = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

// Retrieves the meeting from the table by the meeting title
async function getGameRoom(roomId) {
  const result = await ddb
    .getItem({
      TableName: ROOM_TABLE_NAME,
      Key: {
        roomId: {
          S: roomId,
        },
      },
    })
    .promise();
  return result.Item ? JSON.parse(result.Item.Data.S) : null;
}

// Stores the meeting in the table using the meeting title as the key
async function putGameRoom(roomId, gameRoom) {
  await ddb
    .putItem({
      TableName: ROOM_TABLE_NAME,
      Item: {
        roomId: { S: roomId },
        roomData: { S: JSON.stringify(gameRoom) },
        TTL: {
          N: '' + oneDayFromNow,
        },
      },
    })
    .promise();
}

async function deleteGameRoom(roomId) {
  const result = await ddb
    .delete({
      TableName: ROOM_TABLE_NAME,
      Item: {
        roomId: { S: roomId },
      },
    })
    .promise();
  return result;
}
S;
