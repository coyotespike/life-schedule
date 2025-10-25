import "reflect-metadata";
import { DataSource } from "typeorm";
import { AppDataSource } from "../server";

async function createTestDatabase() {
  const adminDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
  });

  try {
    await adminDataSource.initialize();
    await adminDataSource.query(`CREATE DATABASE "life_schedule_test"`);
    console.log("Test database created");
  } catch (error: any) {
    if (error.code !== "42P04") {
      console.error("Error creating test database:", error);
    }
  } finally {
    await adminDataSource.destroy();
  }
}

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await createTestDatabase();
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.createQueryBuilder().delete().execute();
  }
});
