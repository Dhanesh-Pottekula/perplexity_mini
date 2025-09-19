import { createApp } from "./app.js";
(async () => {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
})();
//# sourceMappingURL=server.js.map