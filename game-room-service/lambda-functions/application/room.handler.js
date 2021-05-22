const AWS = require('aws-sdk');
const chime = new AWS.Chime({ region: 'us-east-1' });
const { v4: uuidv4 } = require('uuid');
chime.endpoint = new AWS.Endpoint(process.env.CHIME_ENDPOINT);
const {
  getGameRoom,
  putGameRoom,
  deleteGameRoom,
} = require('/infrastucture/dynamo.repository.js');

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

exports.join = async (event, context, callback) => {
  const pathParam = event.pathParameters;
  if (!pathParam.roomId) {
    response.statusCode = 400;
    response.body = 'Need parameters: roomId';
    callback(null, response);
    return;
  }

  let gameRoom = await getGameRoom(pathParam.roomId);
  if (!gameRoom) {
    response.statusCode = 404;
    response.body = 'Invalid roomId';
    callback(null, response);
    return;
  }

  // Create new player for the meeting
  console.info('Adding new player');
  const player = await chime
    .createAttendee({
      MeetingId: gameRoom.Meeting.MeetingId,
      ExternalUserId: `${uuidv4().substring(0, 8)}#${pathParam.name}`.substring(
        0,
        64
      ),
    })
    .promise();

  response.statusCode = 200;
  response.body = {
    JoinInfo: {
      gameRoom: gameRoom,
      player: player,
    },
  };
  callback(null, response);
  return;
};

exports.createGameRoom = async (event, context, callback) => {
  let roomId = uuidv4();
  // Look up the meeting by its title. If it does not exist, create the meeting.
  let gameRoom = await getGameRoom(roomId);
  if (gameRoom) {
    response.statusCode = 404;
    response.body = 'room already exist, try again';
    callback(null, response);
    return;
  }

  const request = {
    ClientRequestToken: uuidv4(),
    ExternalMeetingId: roomId.substring(0, 64),
  };
  console.info('Creating new game room: ' + JSON.stringify(request));
  const room = await chime.createMeeting(request).promise();
  await putGameRoom(roomId, room);

  console.info('Adding host player');
  const player = await chime
    .createAttendee({
      MeetingId: room.Meeting.MeetingId,
      ExternalUserId: uuidv4(),
    })
    .promise();

  const joinInfo = {
    JoinInfo: {
      hostInfo: player.Attendee,
      roomInfo: room.Meeting,
    },
  };
  console.info('joinInfo:', JSON.stringify(joinInfo, null, 2));
  response.statusCode = 200;
  response.body = JSON.stringify(joinInfo, '', 2);
  callback(null, response);
};

exports.endRoom = async (event, context, callback) => {
  console.log('end game:', JSON.stringify(event, null, 2));
  const pathParam = event.pathParameters;

  if (!pathParam.roomId) {
    console.log('end event > missing required fields: provide roomId');
    response.statusCode = 400;
    response.body = 'Must provide roomId';
    callback(null, response);
    return;
  }

  response.statusCode = 200;
  response.body = JSON.stringify(endGameRoom(pathParam.roomId));
  console.info('end Room > response:', JSON.stringify(response, null, 2));
  callback(null, response);
};

const endGameRoom = async (roomId) => {
  const roomInfo = await getGameRoom(roomId);

  try {
    await chime
      .deleteMeeting({
        MeetingId: roomInfo.Meeting.MeetingId,
      })
      .promise();
  } catch (err) {
    console.info('endMeeting > try/catch:', JSON.stringify(err, null, 2));
  }

  const result = await deleteGameRoom(roomId);
  console.info('deleteMeeting > result:', JSON.stringify(result, null, 2));
  return result;
};
