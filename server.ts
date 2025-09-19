import { createApp } from "./app";
import { envDefaults } from "./envDefaults";


(async () => {
  const app = await createApp();
  const PORT = envDefaults.PORT;
  app.listen(PORT, () =>
    console.log(`⚡ Server running on port ${PORT}`)
  );
})();
