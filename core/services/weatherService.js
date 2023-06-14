import fs from 'fs';
import cheerio from 'cheerio';
import env from '../../config/environment';
import meteoredClient from '../clients/meteoredClient';
import City from '../../domain/models/City';
import Request from '../../domain/models/Request';
import SuccessfulResponse from '../../domain/models/SuccessfulResponse';

const { OUTPUTS_PATH } = env;
const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

const scrapeHistoricalData = async (data) => {
  const $ = cheerio.load(data);
  const distance = $('#dist_cant').text().trim();
  const updateDate = $('#fecha_act_dato').text().trim();
  const temp = $('#ult_dato_temp').text().trim();
  const humidity = $('#ult_dato_hum').text().trim();

  return {
    distance,
    update_date: updateDate,
    temperature: temp,
    humidity,
  };
};

const validateDate = (date) => {
  if (dateRegex.test(date)) {
    console.log("Date is valid.");
  } else {
    console.log("Date is invalid.");
  }
};

const createFile = (timestamp, data) => {
  if (!fs.existsSync(OUTPUTS_PATH)) {
    fs.mkdir(OUTPUTS_PATH, { recursive: true }, (error) => {
      if (error) {
        console.error('Error creating directory:', error);
        throw error;
      }
    });
  }
  const json = JSON.stringify(data);
  fs.writeFileSync(`outputs/${timestamp}.json`, json);
  console.log(`Done, file created: outputs/${timestamp}.json`);
};

const saveResponses = async (runId, cities, data) => {
  const promises = data.map(async (requestData) => {
    const { url, status, data } = requestData;
    const [,,,cityName] = url.split('/');
    const city = cities.find(({ name }) => name === cityName);
    const request = await Request.insert({
      city_id: city.id,
      run_id: runId,
      url,
      response_code: status,
    });
    if (status === 200) {
      await SuccessfulResponse.insert({
        request_id: request.id,
        data,
      });
    }
  });

  await Promise.all(promises);
  console.log('Done, responses saved in DB');
};

const startProcess = async () => {
  try {
    const id = Date.now();
    const cities = await City.findAll({});
    const promises = cities.map(async ({ name }) => {
      const { data, status, config: { url } = {} } = await meteoredClient.getHistoricData(name);
  
      let weatherData = null;
      if (status === 200) {
        weatherData = await scrapeHistoricalData(data);
        validateDate(weatherData.update_date);
      }
  
      return {
        id,
        url,
        status,
        data: weatherData,
      }
    });

    const responses = await Promise.all(promises);
    
    createFile(id, responses);
    await saveResponses(id, cities, responses);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default { startProcess };
