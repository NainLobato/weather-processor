const DEFAULT_CITIES = [
  'ciudad-de-mexico',
  'monterrey',
  'merida',
  'wakanda'
];
const DEFAULT_OUTPUTS_PATH = './outputs';

const {
  CITIES = DEFAULT_CITIES,
  OUTPUTS_PATH = DEFAULT_OUTPUTS_PATH,
} = process.env;

export default {
  CITIES,
  OUTPUTS_PATH,
};
