/**
 * seeder001_user - Userデータ設定
 */
import { createConnection } from "typeorm";
import { User } from "../entity/User";

createConnection().then(async connection => {

    let user = new User();
    user.name = "鈴木　太郎";
    user.nameKana = "すずき　たろう";
    user.email = "taro.suzuki@example.com";
    user.password = "ttt";
    user.userType = "admin";

    let userRepository = connection.getRepository(User);

    await userRepository.save(user);
    console.log("User has been saved");

    let savedUsers = await userRepository.find();
    console.log("All users from the db: ", savedUsers);

    process.exit(0);
}).catch(error => console.log(error));
