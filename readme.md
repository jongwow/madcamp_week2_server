# 몰입캠프 2주차

## 버전 상세

- MongoDB: v3.6.8
- Node Version: v12.18.2
- Server: Ubuntu 20.04 LTS (노상관)

## 세팅

- **NVM**을 통한 Node 설치를 권장.
- MongoDB 설치 후, `week2` DB를 만들고 ID: kaist, PW: kaist 인 User 생성 권장.
  - 또는 .env 파일 수정을 통해 해당 DB 설정에 맞춰도 상관없음.
  - 설치 방법(Ubuntu 16.04 LTS 기준)
    1. 우선 `sudo apt-get update`을 통해 매니저를 항상 최신상태로 해준다.
    2. `sudo apt-get install mongodb` 명령어 수행
    3. `systemctl status mongodb` 로 잘 설치됐는지 확인.
    - 만약 `systemctl`가 없으면 `service`로 확인해야한다.
    4. `mongo` 명령어로 접속해서 확인해보자~
  - 프로젝트를 위한 디비 만드는 방법
    1. `mongo` 명령어로 접속
    2. `use week2` 명령어로 DB 생성
    3. `db.createUser({ user:'kaist', pwd:'kaist',roles:['readWrite', 'dbAdmin']})` 명령어로 kaist/kaist의 계정을 생성한다.
    4. `db.getUsers()`로 잘 생성됐는지 확인해보자~
