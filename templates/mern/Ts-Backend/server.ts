import app from './src/app';
import { env } from './src/constant/env.constant';

app.listen(env.PORT, () => {
  console.log(
    `Server is running on http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
