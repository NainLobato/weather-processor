import parquet from 'parquetjs';
import env from '../../config/environment';
import City from '../../domain/models/City';
import SuccessfulResponse from '../../domain/models/SuccessfulResponse';

const { OUTPUTS_PATH } = env;

const schema = new parquet.ParquetSchema({
  city: { type: 'UTF8' },
  max_temperature: { type: 'INT32' },
  min_temperature: { type: 'INT32' },
  avg_temperature: { type: 'FLOAT' },
  last_temperature: { type: 'INT32' },
  max_humidity: { type: 'FLOAT' },
  min_humidity: { type: 'FLOAT' },
  avg_humidity: { type: 'FLOAT' },
  last_humidity: { type: 'FLOAT' },
});

const generateParquetFile = async () => {
  const writer = await parquet.ParquetWriter.openFile(schema, `${OUTPUTS_PATH}/report.parquet`);

  const cities = await City.findAll({});

  const promises = cities.map(async (city) => {
    const lastRecord = await SuccessfulResponse.findLast({ city_id: city.id });
    if (lastRecord) {
      const { max: maxTemp } = await SuccessfulResponse.findMax({ city_id: city.id }, 'temperature');
      const { min: minTemp } = await SuccessfulResponse.findMin({ city_id: city.id }, 'temperature');
      const { avg: avgTemp } = await SuccessfulResponse.getAvg({ city_id: city.id }, 'temperature');
      const { max: maxHmd } = await SuccessfulResponse.findMax({ city_id: city.id }, 'humidity');
      const { min: minHmd } = await SuccessfulResponse.findMin({ city_id: city.id }, 'humidity');
      const { avg: avgHmd } = await SuccessfulResponse.getAvg({ city_id: city.id }, 'humidity');
      const record = {
        city: city.name,
        max_temperature: maxTemp,
        min_temperature: minTemp,
        avg_temperature: avgTemp,
        last_temperature: lastRecord.temperature,
        max_humidity: maxHmd,
        min_humidity: minHmd,
        avg_humidity: avgHmd,
        last_humidity: lastRecord.humidity,
      };
      console.log('Saving city record:', record);
      await writer.appendRow(record);
    }
  });

  await Promise.all(promises);

  await writer.close();
};

const readParquetFile = async () => {
  const reader = await parquet.ParquetReader.openFile(`${OUTPUTS_PATH}/report.parquet`);

  const cursor = reader.getCursor();

  let record = null;
  while (record = await cursor.next()) {
    console.log(record);
  }
  await reader.close();
};

export default { generateParquetFile, readParquetFile };
