import type {
  UserVehiculeProps,
  VehiculeProps,
} from "../../../../client/src/assets/definition/lib";
import databaseClient, {
  type Result,
  type Rows,
} from "../../../database/client";

class VehiculeRepository {
  async readUserVehicule(userId: number, vehiculeId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT b.label AS brand, m.label AS model, s.label AS socket
            FROM user_car AS u
            JOIN car AS c ON c.id = u.car_id
            JOIN brand AS b ON b.id = c.brand_id
            JOIN model AS m ON m.id = c.model_id
            JOIN socket AS s ON s.id = c.socket_id
            WHERE u.user_id = ?
            AND c.id = ?
        `,
      [userId, vehiculeId],
    );
    return rows as UserVehiculeProps[];
  }
  async readPrimaryCar(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT c.id, b.label AS brand, m.label AS model, s.label AS socket
            FROM user_car AS u
            JOIN car AS c ON c.id = u.car_id
            JOIN brand AS b ON b.id = c.brand_id
            JOIN model AS m ON m.id = c.model_id
            JOIN socket AS s ON s.id = c.socket_id
            WHERE user_id = ?
        `,
      [userId],
    );
    return rows[0] as UserVehiculeProps;
  }

  async updateUserVehicule(
    userVehicule: VehiculeProps,
    email: string,
    carIdid: number,
  ) {
    const { brand, model, socket } = userVehicule;
    const [result] = await databaseClient.query<Result>(
      `UPDATE car
      JOIN user_car AS uc ON uc.car_id = car.id
      JOIN user AS u ON u.id = uc.user_id
  SET brand_id = ?, model_id = ?, socket_id = ?
  WHERE u.email = ?
  AND car.id = ?`,
      [brand, model, socket, email, carIdid],
    );
    return result.affectedRows;
  }

  async createNewVehicule(userVehicule: VehiculeProps) {
    const { brand, model, socket } = userVehicule;
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO car (brand_id, model_id, socket_id)
      VALUES (?,?,?)
      `,
      [brand, model, socket],
    );
    return result.insertId;
  }

  async readUserByEmail(userMail: string) {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT u.id
      FROM user AS u
      WHERE email = ?
      `,
      [userMail],
    );

    return rows[0];
  }

  async createNewUserCar(userId: number, carId: number) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO user_car(user_id, car_id)
        VALUES (?,?)
      `,
      [userId, carId],
    );
    return result.insertId;
  }

  async readAllVehicule(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT b.label AS brand, m.label AS model, s.label AS socket, c.id AS id
      FROM user_car AS u
      JOIN car as c ON c.id = u.car_id
      JOIN brand AS b ON b.id = c.brand_id
      JOIN model AS m ON m.id = c.model_id
      JOIN socket AS s ON s.id = c.socket_id
      WHERE u.user_id = ? 
      `,
      [userId],
    );

    return rows as UserVehiculeProps[];
  }
}

export default new VehiculeRepository();
