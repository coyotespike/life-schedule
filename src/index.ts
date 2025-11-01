import { createApp, AppDataSource } from "./server";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const app = createApp(AppDataSource);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

main();

// we start index
// index imports server
// server instantiates AppDataSource
// index initializes AppDataSource
// services now have the initialized AppDataSource
// Sometimes it's easier to have a central store
// where all resources are set up and stored and used
