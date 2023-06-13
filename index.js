import { CronJob } from 'cron';
import weatherService from './core/services/weatherService';

const job = new CronJob('0 * * * *', () => {
  console.log('Starting process...');
  weatherService.startProcess();
});

job.start();