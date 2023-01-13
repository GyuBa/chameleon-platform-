import {readUser} from "../controller/UserController";

const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            { // 프론트에서 req.body에 넣어주는 정보. 객체 key 값을 정확히 적어줘야한다.
                usernameField: 'email', // req.body = { userId: 'abcd', passport: 'xxx' }
                passwordField: 'password',
            },
            async (userId, password, done) => {
                console.log('passport login')
                try {
                    const user = await readUser(userId)
                    if (!(userId && password)) {
                        return done(null, false, {reason: {msg: "non_field_errors"}});
                    }
                    if (!user) {
                        // 유저가 있는지 확인 후 유저가 없다면
                        return done(null, false, {reason: {msg: "unable_credential_errors"}});
                    }
                    const result = await bcrypt.compare(password, user.password);
                    if (result) {
                        // 유저가 있다면 비밀번호 확인 후 done 두 번째 인자로 유저 정보 넘김
                        const {id, email, name} = user;
                        const filteredUser = {
                            "id": id,
                            "email": email,
                            "name": name
                        }
                        return done(null, filteredUser);
                    }
                    return done(null, false, {reason: {msg: 'unable_credential_errors'}}); // 비밀번호 틀렸을 때
                } catch (e) {
                    console.error(e);
                    return done(e); // 서버 에러가 있는 경우 done 첫 번째 인자로 error 정보 넘김
                }
            },
        ),
    );
};