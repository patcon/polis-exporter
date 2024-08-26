import { Curl, CurlFeature } from 'node-libcurl';

const url = 'https://pol.is/api/v3/conversations?conversation_id=6bkf4ujff9';

const curl = new Curl();
curl.setOpt(Curl.option.URL, url);
curl.setOpt(Curl.option.HTTPHEADER, [
  'user-agent: x',
  'host: pol.is',
  'accept: */*'
]);

// Enable verbose mode to get detailed information
curl.setOpt(Curl.option.VERBOSE, true);

// Enable all debug information
curl.enable(CurlFeature.Raw);

// Set up a debug function to capture and log debug information
curl.setOpt(Curl.option.DEBUGFUNCTION, (infoType, content) => {
  const infoTypeMap = {
    [Curl.info.Debug]: {
      Text: 'Text',
      HeaderIn: 'HeaderIn',
      HeaderOut: 'HeaderOut',
      DataIn: 'DataIn',
      DataOut: 'DataOut',
      SslDataIn: 'SslDataIn',
      SslDataOut: 'SslDataOut',
    }
  };

  const type = infoTypeMap[Curl.info.Debug][infoType] || 'Unknown';
  console.log(`[${type}] ${content.toString('utf8')}`);
});

curl.on('end', (statusCode, body, headers) => {
  console.log('Response status:', statusCode);
  console.log('Response headers:', headers);
  console.log('Response body:', body);
  curl.close();
});

curl.on('error', (error) => {
  console.error('Error:', error);
  curl.close();
});

curl.perform();