const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PWD,
  MONGO_DBNAME,
} = process.env;

const URL = `mongodb://${MONGO_USERNAME}:${MONGO_PWD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;
export default URL;
