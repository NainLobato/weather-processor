import axios from 'axios';

const METEORED_HOST = 'https://www.meteored.mx';

const mapAxiosConfig = ({
  url,
  method,
  data,
  params,
  timeout: configTimeout,
  headers,
}) => ({
  url,
  method,
  data,
  params,
  timeout: configTimeout,
  headers,
});

const getHistoricData = async (city) => axios.get(`${METEORED_HOST}/${city}/historico`)
  .catch((error) => {
    let statusCode = null;
    if (error.response) {
      const { data, status } = error.response;
      statusCode = status;
      console.error(`Request failed [response] ${error.message}`, { status });
    } else if (error.request) {
      console.error(`Request failed [request] ${error.message}`);
    } else {
      console.error(`Request failed [error] ${error.message}`);
    }
    const mapppedConfig = mapAxiosConfig(error.config);
    console.error(`Request failed [config] ${error.message}`, { ...mapppedConfig });

    return { config: mapppedConfig, status: statusCode };
  })

export default { getHistoricData };
