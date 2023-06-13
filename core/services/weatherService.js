const fs = require("fs");
const cheerio = require('cheerio');
const env = require('../../config/environment');
const meteoredClient = require('../clients/meteoredClient');

const {
  CITIES,
  OUTPUTS_PATH,
} = env;
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
}

const startProcess = async () => {
  try {
    const id = Date.now();
    const promises = CITIES.map(async (city) => {
      const { data, status, config: { url } = {} } = await meteoredClient.getHistoricData(city);
  
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
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { startProcess };
