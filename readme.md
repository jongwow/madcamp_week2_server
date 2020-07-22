# 몰입캠프 2주차

## 버전 상세

- MongoDB: v3.6.8
- Node Version: v12.18.2
- Server: Ubuntu 20.04 LTS (노상관)

## 세팅

- **NVM**을 통한 Node 설치를 권장.
- MongoDB 설치 후, `week2` DB를 만들고 ID: kaist, PW: kaist 인 User 생성 권장.
  - 또는 .env 파일 수정을 통해 해당 DB 설정에 맞춰도 상관없음.
  - 설치 방법(Ubuntu 18.04 LTS 기준)
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

## API

[API 문서](https://app.gitbook.com/@jjongwoo-dev/s/madcamp/qr-api)

> V3 api을 만들 때부터 명세서를 작성해서 v3만 존재합니다.

## 스펙
* Typescript + Express + MongoDB(Mongoose) + socket.io
  * Javascript의 superset인 typescript를 사용했습니다.
  * Express를 이용해 REST API를 따라 API를 구현했습니다.
  * MariaDB와 MongoDB 중 낯선 DB를 학습하자는 목적으로 MongoDB를 선택했습니다. mongoDB를 사용하기 위해 ODM인 Mongoose를 사용했습니다.
  * *admin* 어플의 QR 자동 갱신을 위해 Socket 통신이 필요했고, socket.io를 사용했습니다.
  * 실제 Node는 Typescript를 Javascript로 compile해서 사용합니다.
* 무중단 운영을 지원하기 위해 PM2를 이용해 node 프로세스를 관리합니다.
* Nginx를 이용해 reverse proxy를 도입했고 ssl 통신을 구축했었지만 안드로이드 앱에서 SSL통신을 하기 위해선 CA 인증서이 필요한데 비싸서 못샀습니다.ㅠㅜ
