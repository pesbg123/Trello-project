# 🤼‍♂️CO-WORKING TOOL - IDLE Service

![Main](/src/views/assets/img/ToyTrelloMain.PNG)

## 프로젝트 목적

> 협업 툴을 개발하며 전반적인 개발 프로세스에 대해 깊게 생각해볼 수 있는 기회를 가질 수 있습니다.  
> 각각의 기능에 어떤 기술이 필요한지, 또 어떻게 문제를 해결해야 하는지를 직접 경험해볼 수 있습니다.  
> Nest.js와 TypeScript를 사용하여 Express가 아닌 새로운 프레임워크를 사용하여 과제를 진행하였습니다.

## ERD

![ERD](/src/views/assets/img/ToyKanbanBoard.png)

## API 명세

| Path                                                | API Method | Verify |      Description      |
| --------------------------------------------------- | :--------: | :----: | :-------------------: |
| /users/signup                                       |    POST    |        |       회원가입        |
| /users/login                                        |    POST    |        |        로그인         |
| /users                                              |    GET     |   ✔    |      프로필 조회      |
| /users                                              |   PATCH    |   ✔    |      프로필 수정      |
| /users/password                                     |   PATCH    |   ✔    |     비밀번호 수정     |
| /users/logout                                       |   DELETE   |   ✔    |       로그아웃        |
| /projects                                           |    POST    |   ✔    |     프로젝트 생성     |
| /projects                                           |    GET     |        |  전체 프로젝트 조회   |
| /projects/:projectId                                |    GET     |   ✔    |   프로젝트 상세조회   |
| /projects/:projectId                                |   PATCH    |   ✔    |     프로젝트 수정     |
| /projects/:projectId                                |   DELETE   |   ✔    |     프로젝트 삭제     |
| /getProjects/myProject                              |    GET     |   ✔    |  나의 프로젝트 조회   |
| /projects/:projectId/invitaiton                     |    POST    |   ✔    |     프로젝트 초대     |
| /getProjects/joinProject                            |    GET     |   ✔    |     프로젝트 참여     |
| /getProjects/participation                          |    POST    |        | 참여자 상태 업데이트  |
| /proejcts/:projectId/boards                         |    POST    |   ✔    |       보드 생성       |
| /proejcts/:projectId/boards                         |    GET     |   ✔    |       보드 조회       |
| /proejcts/:projectId/boards/:boardId                |    GET     |   ✔    |     보드 상세조회     |
| /proejcts/:projectId/boards/:boardId                |   PATCH    |   ✔    |       보드 수정       |
| /proejcts/:projectId/boards/:boardId/order          |   PATCH    |   ✔    | 동일 컬럼 내 순서변경 |
| /proejcts/:projectId/boards/:boardId/:columnId/move |   PATCH    |   ✔    |  다른 컬럼으로 이동   |
| /proejcts/:projectId/boards/:boardId                |   DELETE   |   ✔    |       보드 삭제       |

## [상세 API 명세보기](https://charming-castanet-ba9.notion.site/eaeb9964f75444169b3d954e4410653b?v=3f5b85388fc74a7988ffdcd5478f6324)

## [시연 영상](https://youtu.be/hu-WotbqMhg)

## 역할 분담

| 이름   | 기능 구현 및 역할                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 박성민 | API 작성, Project(발제자료 상 Board) CRUD, 알람 및 실시간 채팅기능 구현(socket.io), 팀원 초대 시 메일 인증(nodemailer), 담당파트 프론트엔드 연결 |
| 인한별 | ERD 작성, 전반적인 프로젝트 초기세팅, User CRUD, redis를 사용하여 토큰관리, 전반적인 프론트엔드 초기세팅 및 담당파트 연결                        |
| 이재혁 | Comment CRUD, 담당파트 프론트엔트 연결                                                                                                           |
| 이상훈 | WireFrame 작성, Board(발제자료 상 Card), BoardColumn(발제자료 상 Column) CRUD, 드래그앤드랍, 담당파트 프론트엔드 연결                            |

> ⭕'COMPLTED LIST'
>
> - [x]
> - [x]
> - [x]
> - [x]
> - [x]
> - [x]
> - [x]

---

## Problems

각자 어려웠던 점 (코드내용 첨부하면 좋을 듯 싶습니다)

박성민 :

인한별 :

이재혁 :

이상훈 :
