import cluster from "cluster";
import { cpus } from "os";
import { createApp } from "./app.js";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`🚀 Master ${process.pid} running with ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  (async () => {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`⚡ Worker ${process.pid} running on port ${PORT}`)
    );
  })();
}
