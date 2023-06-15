import { CronJob } from 'cron';
import weatherService from './core/services/weatherService';
import parquetService from './core/services/parquetService';

const scraperJob = new CronJob('0 * * * *', () => {
  console.log('Starting scraperJob...');
  weatherService.startProcess();
});

const parquetJob = new CronJob('1 * * * *', () => {
  console.log('Starting parquetJob...');
  parquetService.generateParquetFile()
  .then(() => {
    console.log('Parquet file generated successfully.');

    console.log('Reading Parquet file.');
    parquetService.readParquetFile()
    .catch((error) => {
      console.error('Error reading Parquet file:', error);
    });
  })
  .catch((error) => {
    console.error('Error generating Parquet file:', error);
  });
});

scraperJob.start();
parquetJob.start();