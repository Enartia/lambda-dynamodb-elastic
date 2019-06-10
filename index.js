const { pushStream } = require('dynamodb-stream-elasticsearch');

const { ES_ENDPOINT, ES_INDEX, ES_TYPE } = process.env;
/**
 * Handles Lambda invocation
 * 
 * @param {AWS DynamoDB Streams Record Event} event The event object
 * @param {AWS Lambda Context Object} context The context object
 * @param {callback} callback The callback function
 */
function myHandler(event, context, callback) {
    // invoke pushstream from dynamodb-stream-elasticsearch passing event, endpoint, index, type params
    pushStream({ event, endpoint: ES_ENDPOINT, index: ES_INDEX, type: ES_TYPE })
        .then(() => {
            callback(null, `Successfully processed ${event.Records.length} records.`);
        })
        .catch((e) => {
            callback(`Error ${e}`, null);
        });
}

exports.handler = myHandler;