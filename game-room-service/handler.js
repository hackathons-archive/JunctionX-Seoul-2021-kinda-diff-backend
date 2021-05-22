'use strict';

const {
  CHIME_ENDPOINT,
  MEETINGS_TABLE_NAME,
} = process.env

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const { v4: uuid } = require('uuid');
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint(CHIME_ENDPOINT);


module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


module.exports.join = async (event) => {
  const query = event.queryStringParameters;
  if (!query) {
    return {
      status: 400,
      body: JSON.stringify({
        'error': 'HTTP Event Context required'
      })
    }
  }
  if (!query.title || !query.name) {
    return {
      status: 400,
      body: JSON.stringify({
        'error': 'Invalid request'
      })
    }
  }

  // Look up the meeting by its title. If it does not exist, create the meeting.
  let meeting = await getMeeting(query.title);
  if (!meeting) {
    return {
      status: 404,
      body: JSON.stringify({
        error: 'Not Found!'
      })
    }
  }
  
  // Create new attendee for the meeting
  console.info('Adding new attendee');
  const attendee = (await chime.createAttendee({
    MeetingId: meeting.Meeting.MeetingId,
    ExternalUserId: uuid(),
  }).promise());

  return {
    statusCode: 200,
    body: JSON.stringify({
    JoinInfo: {
      Meeting: meeting,
      Attendee: attendee,
    },
  }, null, 2)
  }
};

async function getMeeting(title) {
  const result = await ddb.getItem({
    TableName: MEETINGS_TABLE_NAME,
    Key: {
      'Title': {
        S: title
      },
    },
  }).promise();
  return result.Item ? JSON.parse(result.Item.Data.S) : null;
}
