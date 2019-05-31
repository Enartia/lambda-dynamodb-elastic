const { pushStream } = require('dynamodb-stream-elasticsearch');

const { ES_ENDPOINT, ES_INDEX, ES_TYPE } = process.env;

function myHandler(event, context, callback) {
    //  console.log('Received event:', JSON.stringify(event.Records));
    pushStream({ event, endpoint: ES_ENDPOINT, index: ES_INDEX, type: ES_TYPE })
        .then(() => {
            callback(null, `Successfully processed ${event.Records.length} records.`);
        })
        .catch((e) => {
            callback(`Error ${e}`, null);
        });
}

exports.handler = myHandler;