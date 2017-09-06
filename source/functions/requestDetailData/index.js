const request = require("request");
const xml2js = require('xml2js');

exports.handler = (_event, _context, _callback) => {
    let url = "http://openapi.youth.go.kr/openapi/service/";
    let key = "HF1eUr96KfQkuZe3Pl1v0stWJvCU8eH72E%2BPGfe%2BiUOMDUlk0P1%2FMgO4SpXf0qq74hzOF7ctuBDJl2L7aXXOsw%3D%3D";
    let path = _event.params.path;
    let apiPath = path.method;
    let options = {
        url : url,
        method : "GET",
        timeout : 20 * 1000
    };

    _context.callbackWaitsForEmptyEventLoop = false;

    switch(apiPath) {
        case "getCertiProgrmInfo" :
            options.url = options.url + "YouthActivInfoCertiSrvc/" + apiPath + "?serviceKey=" + key + "&key1=" + path.key; 
            break;
        case "getVolProgrmInfo" :
            options.url = options.url + "YouthActivInfoVolSrvc/" + apiPath + "?serviceKey=" + key + "&key1=" + path.key;
            break;
    }

    request(options, (_reqError, _response, _body) => {
        let statusCode = _response.statusCode;
        let parser = new xml2js.Parser();
        let result = {};

        if (statusCode === 200) {
            parser.parseString(_body, (_parserErr, _result) => {
                result = _result;
            });
        }

        _callback(null, result);
    });
};