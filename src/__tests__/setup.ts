import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Event } from "../entities/Event";
import { Contact } from "../entities/Contact";

async function createTestDatabase() {
  const adminDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "postgres",
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

// new DataSource will connect but can't create the db
export const testDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "life_schedule_test",
  username: "postgres",
  password: "postgres",
  entities: [User, Event, Contact],
  synchronize: true,
  logging: false,
});

beforeAll(async () => {
  await createTestDatabase();
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});

beforeEach(async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.createQueryBuilder().delete().execute();
  }
});
