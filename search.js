var elasticsearch = require('elasticsearch');
const { ES_ENDPOINT, ES_INDEX, ES_TYPE } = process.env;
var client = new elasticsearch.Client({
    host: ES_ENDPOINT + '',
    log: 'trace'
});

exports.handler = (event, context, callback) => {

    try {
        var bodyData = JSON.parse(event.body);
        var searchParams = {
            index: ES_INDEX,
            type: ES_TYPE,
            body: {
                query: {

                }
            },
            "from": bodyData.from || 0,
            "size": bodyData.size || 10,
        };
        if (bodyData.query) {
            searchParams.body.query = bodyData.query;
        }
        if (bodyData.qs) {
            searchParams.body.query = {
                "query_string": {
                    "query": bodyData.qs
                }
            };
        }
        if (bodyData.vendorId) {
            searchParams.body.query = { match: { vendorId: bodyData.vendorId } };
        }
        console.log(searchParams);
        client.search(searchParams).then(function (resp) {
            //console.log(resp);
            var hits = resp.hits.hits;
            callback(null, {
                statusCode: '200',
                body: JSON.stringify({ error: null, data: { total: resp.hits.total, results: hits.map(h => { return h._source; }) } }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
        }, function (err) {
            console.trace({ error: err });
            callback(null, {
                statusCode: '500',
                body: JSON.stringify(err),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
        });
    }
    catch (e) {
        console.log({ error: e });
        callback(null, {
            statusCode: '500',
            body: JSON.stringify(e),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
    }
}