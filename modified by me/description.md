# 초기설정
- npm init
- sample이라는 이름의 DB schema 생성(password:1234)
- .env 파일 만들기(PORT:5000   SECRET:SECRET)

# 구현 기능
-회원가입, 회원정보 수정, 회원탈퇴
-로그인, 로그아웃
-게시물 업로드(파일, 텍스트)
-index에서 전체 게시물 확인 및 장바구니 추가
-mypage에서 내 게시물 확인 및 삭제
-cart에서 장바구니에 추가한 게시물 확인 및 선택 삭제


## Passport

- 요청 객체에 passport 설정을 심음

```
passport.initialize():
```

- req.session 객체에 passport 정보를 저장

```
passport.session()
``` 

- 로그인 과정

1. 로그인 요청이 들어옴

```
router.post('/login', (req, res, next) => {});
```

2. passport.authenticate 호출

```
passport.authenticate('local', (error, user, info) => {})(req, res, next);
```

3. 로그인 전략 수행

```
passport.use(new Strategy({
    usernameField: 'id',
    passwordField: 'password'
}, async (id, password, done) => {
    // 로그인 전략 완료 시, 사용자 (user) 객체와 함께 done 함수 호출
    done(null, user);
}));
```

4. passport.authenticate의 콜백 함수가 호출되고, req.login 호출

```
passport.authenticate('local', (error, user, info) => {
    // 로그인 성공 시, 사용자 (user) 객체와 함께 req.login 호출
    req.login(user);

    // 로그인 실패 시, 로그인 실패 정보와 함께 next 함수 호출
    next(info);
})(req, res, next);
```

5. req.login이 passport.serializeUser를 호출함

passport.serializeUser((user, done) => {
    // req.session 객체에 저장할 사용자 아이디 (user.id)와 함께 done 함수 호출 
    done(null, user.id);
});

6. req.session 객체에 사용자 아이디 (user.id)를 저장 후 로그인 완료


- 로그인 이후 과정

1. 모든 요청에 passport.session() 미들웨어가 passport deserializeUser 호출

2. req.session 객체에 저장된 사용자 아이디 (user.id)로 사용자 정보 (user 객체) 조회

```
passport.deserializeUser((id, done) => {
    // user 객체와 함께 done 함수 호출
    done(null, user)
});
```

3. 조회된 사용자 정보 (user 객체)가 req.user 객체에 저장됨

4. 미들웨어에서 req.user 객체 사용 가능

