import type {
  BookingProps,
  UserProps,
} from "../../../../client/src/assets/definition/lib";
import databaseClient, { type Result } from "../../../database/client";

class ProfilRepository {
  async ReadUserData(id: string) {
    const [rows] = await databaseClient.query(
      `SELECT firstName, lastName, city, photo, birthday, zipCode 
          FROM user
          WHERE email = ? `,
      [id],
    );
    return rows as UserProps[];
  }

  async UpdateUserInfo(
    user: Omit<
      UserProps,
      "id" | "password" | "confirm" | "dbpassword" | "role"
    >,
  ) {
    const [result] = await databaseClient.query<Result>(
      `UPDATE user
        SET firstName = ?, lastName = ?,  birthday =  DATE_FORMAT(STR_TO_DATE(?, '%d/%m/%Y'), '%Y/%m/%d') ,photo = ?, city = ?, zipCode = ?
        WHERE email = ?`,
      [
        user.firstName,
        user.lastName,
        user.birthday,
        user.photo,
        user.city,
        user.zipCode,
        user.email,
      ],
    );

    return result.affectedRows;
  }

  async ReadBooking(id: string) {
    const [rows] = await databaseClient.query(
      `SELECT b.id, b.start_book, b.end_book, s.name, s.address
      FROM book AS b
      JOIN station AS s ON s.id_station = b.station_id
      JOIN user AS u ON u.id = b.user_id
      WHERE u.email = ?;`,
      [id],
    );
    return rows as BookingProps[];
  }

  async DestroyBooking(id: number) {
    const [result] = await databaseClient.query<Result>(
      `DELETE FROM book
      WHERE id= ?`,
      [id],
    );
    return result.affectedRows;
  }
}

export default new ProfilRepository();
