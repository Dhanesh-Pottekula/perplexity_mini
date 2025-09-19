import { createApp } from "./app";


(async () => {
  const app = await createApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`⚡ Server running on port ${PORT}`)
  );
})();
