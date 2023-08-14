# 🤼‍♂️CO-WORKING TOOL - IDLE Service

![Main](/src/views/assets/img/ToyTrelloMain.PNG)

## 프로젝트 목적

> 협업 툴을 개발하며 전반적인 개발 프로세스에 대해 깊게 생각해볼 수 있는 기회를 가질 수 있습니다.  
> 각각의 기능에 어떤 기술이 필요한지, 또 어떻게 문제를 해결해야 하는지를 직접 경험해볼 수 있습니다.  
> Nest.js와 TypeScript를 사용하여 Express가 아닌 새로운 프레임워크를 사용하여 과제를 진행하였습니다.

## ERD

![ERD](/src/views/assets/img/ToyKanbanBoard.png)

## API 명세

| Path                                                     | API Method | Verify |      Description      |
| -------------------------------------------------------- | :--------: | :----: | :-------------------: |
| /users/signup                                            |    POST    |        |       회원가입        |
| /users/login                                             |    POST    |        |        로그인         |
| /users                                                   |    GET     |   ✔    |      프로필 조회      |
| /users                                                   |   PATCH    |   ✔    |      프로필 수정      |
| /users/password                                          |   PATCH    |   ✔    |     비밀번호 수정     |
| /users/logout                                            |   DELETE   |   ✔    |       로그아웃        |
| /projects                                                |    POST    |   ✔    |     프로젝트 생성     |
| /projects                                                |    GET     |        |  전체 프로젝트 조회   |
| /projects/:projectId                                     |    GET     |   ✔    |   프로젝트 상세조회   |
| /projects/:projectId                                     |   PATCH    |   ✔    |     프로젝트 수정     |
| /projects/:projectId                                     |   DELETE   |   ✔    |     프로젝트 삭제     |
| /getProjects/myProject                                   |    GET     |   ✔    |  나의 프로젝트 조회   |
| /projects/:projectId/invitaiton                          |    POST    |   ✔    |     프로젝트 초대     |
| /getProjects/joinProject                                 |    GET     |   ✔    |     프로젝트 참여     |
| /getProjects/participation                               |    POST    |        | 참여자 상태 업데이트  |
| /proejcts/:projectId/boards                              |    POST    |   ✔    |       보드 생성       |
| /proejcts/:projectId/boards                              |    GET     |   ✔    |       보드 조회       |
| /proejcts/:projectId/boards/:boardId                     |    GET     |   ✔    |     보드 상세조회     |
| /proejcts/:projectId/boards/:boardId                     |   PATCH    |   ✔    |       보드 수정       |
| /proejcts/:projectId/boards/:boardId/order               |   PATCH    |   ✔    | 동일 컬럼 내 순서변경 |
| /proejcts/:projectId/boards/:boardId/:columnId/move      |   PATCH    |   ✔    |  다른 컬럼으로 이동   |
| /proejcts/:projectId/boards/:boardId                     |   DELETE   |   ✔    |       보드 삭제       |
| /proejcts/:projectId/columns                             |    GET     |   ✔    |       컬럼 조회       |
| /proejcts/:projectId/columns                             |    POST    |   ✔    |       컬럼 생성       |
| /proejcts/:projectId/columns/:columnId                   |   PATCH    |   ✔    |      컬럼명 수정      |
| /proejcts/:projectId/columns/:columnId/order             |   PATCH    |   ✔    |    컬럼 순서 변경     |
| /proejcts/:projectId/columns/:columnId                   |   DELETE   |   ✔    |       컬럼 삭제       |
| /proejcts/:projectId/columns/:columnId                   |   DELETE   |   ✔    |       컬럼 삭제       |
| /projects/:projectId/boards/:boardId/comments            |    POST    |   ✔    |       댓글 생성       |
| /projects/:projectId/boards/:boardId/comments            |    GET     |   ✔    |       댓글 조회       |
| /projects/:projectId/boards/:boardId/comments/:commentId |   PATCH    |   ✔    |       댓글 수정       |
| /projects/:projectId/boards/:boardId/comments/:commentId |   DELETE   |   ✔    |       댓글 삭제       |

## [상세 API 명세보기](https://charming-castanet-ba9.notion.site/eaeb9964f75444169b3d954e4410653b?v=3f5b85388fc74a7988ffdcd5478f6324)

## [시연 영상](https://youtu.be/hu-WotbqMhg)

## 역할 분담

| 이름   | 기능 구현 및 역할                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 박성민 | API 작성, Project(발제자료 상 Board) CRUD, 알람 및 실시간 채팅기능 구현(socket.io), 팀원 초대 시 메일 인증(nodemailer), 담당파트 프론트엔드 연결 |
| 인한별 | ERD 작성, 전반적인 프로젝트 초기세팅, User CRUD, redis를 사용하여 토큰관리, 전반적인 프론트엔드 초기세팅 및 담당파트 연결                        |
| 이재혁 | Comment CRUD, 담당파트 프론트엔트 연결                                                                                                           |
| 이상훈 | WireFrame 작성, Board(발제자료 상 Card), BoardColumn(발제자료 상 Column) CRUD, 드래그앤드랍, 담당파트 프론트엔드 연결                            |

---

## Problems

각자 어려웠던 점 (코드내용 첨부하면 좋을 듯 싶습니다)

박성민 :

- socket으로 room을 만들어서 해당 room에 있는 인원들에게 새로운 메시지가 왔을 때, 해당 room에 있지 않아도 채팅 기록을 갱신시키고 한 번의 알림만을 보내주는 기능을 구현하는 것이 어려웠음
- room에 있는 유저들에게 메시지를 전송하면 방에 접속한 모든 유저가 전달을 받으면서 룸에 접속한 유저의 인원 수 만큼의 알림이 중복되어 생성 되는 부분을 해결하는 것이 어려웠음

```javascript
socket.on('newMessage', ({ userId, message, room, date }) => {
  if (document.getElementById(`${room}-chat-container`)) return;

  const result = updateRoomMessage(room, message, date);
  if (result === false) return;
  announceMessage(room, message, userId, date);
});
```

인한별 :

- 토큰 방식으로 로그인을 구현하였으며, 보안에 취약한 점이 치명적 단점으로 보여 보안을 어느정도 강화할 수 있는 리프레시토큰을 도입해봤음
- 지속 보안에 대한 욕심이 생겨 토큰을 레디스에 저장시켜 세션방식과 비슷한 로직으로 변질되었으나, 서버에서는 세션관련된 메모리를 차지하지 않을 수 있도록 리프레시토큰과 액세스토큰만 사용하여 로직을 수정
- 해당 과정에서 리프레시 토큰을 통해 액세스 토큰이 만료되면 재발급 처리하는 로직을 백엔드에서 구현하기로 결정했고, 미들웨어를 통해 액세스 토큰이 만료되었을 경우 리프레시토큰으로 토큰을 재발급 받을 수 있도록 로직을 구현하는데 어려움이 있었음 (방향성 문제)

```javascript
export class TokenValidMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}
  async use(req: IRequest, res: Response, next: NextFunction) {
    const requestAccessToken = req.cookies.accessToken;
    const requestRefreshToken = req.cookies.refreshToken;

    const accessTokenVerify = this.jwtService.verifyErrorHandle(requestAccessToken, process.env.ACCESS_SECRET_KEY);
    if (accessTokenVerify == 'jwt normal') {
      const accessTokenVerify = this.jwtService.verify(requestAccessToken, process.env.ACCESS_SECRET_KEY);
      req.user = accessTokenVerify;
      return next();
    }

    const refreshTokenVerifyErrorHandle = this.jwtService.verifyErrorHandle(requestRefreshToken, process.env.REFRESH_SECRET_KEY);
    if (refreshTokenVerifyErrorHandle == 'jwt normal') {
      const refreshPayload = this.jwtService.verify(requestRefreshToken, process.env.REFRESH_SECRET_KEY);
      const findByUser = await this.usersService.tokenValidateUser(refreshPayload);

      const accessToken = this.jwtService.sign(
        { id: findByUser.id, name: findByUser.name, email: findByUser.email, imageUrl: findByUser.imageUrl },
        process.env.ACCESS_SECRET_KEY,
        process.env.JWT_ACCESS_EXPIRATION_TIME,
      );

      const accessTokenVerify = this.jwtService.verify(accessToken, process.env.ACCESS_SECRET_KEY);

      req.user = accessTokenVerify;
      res.cookie('accessToken', accessToken);
      return next();
    }

    return next();
  }
}
```

이재혁 :

- 타입을 하나하나 지정해주는게 익숙치 않고, 외부 클래스에서 다른 클래스의 메서드를 쓰기 위해 의존성을 주입해주는 개념이 이해는 되었지만, 실제로 사용하려고 하면 되게 어려웠습니다.

이상훈 :

- 보드(카드) 이동 시 지정해놓은 Sequence 번호가 불규척이지 않게 변경되는 현상이 생김  
  ex) 1, 3, 4 이렇게 변경되는 경우가 있었음, 원래는 순차적으로 보드(카드)를 이동했을 때 1, 2, 3, 4 이렇게 변경되어야 함
- JqueryUI 라이브러리를 사용하여 Drag & Drop 작업을 구현하였고, 카드를 선택한 후 드랍했을때 바뀌는 타겟 카드의 시퀀스 번호를 추출하는 작업에서 .prev()와 .next()를 사용하면서 작업을 진행했으나 위의 예시처럼 번호가 한칸 건너뛰는 현상과 함께 .prev()는 역방향으로 카드를 끝과 끝으로 이동했을때 오류가 생기고, next()는 정방향으로 카드를 이동했을때 오류가 생겼음
  ex) .prev() = 4번카드에서 1번카드로 이동했을때 undefined 에러 발생 / .next() = 1번에서 4번으로 이동할때 undefined 에러 발생
- 시퀀스 번호는 보드나 컬럼이 생성될 때 1부터 순차적으로 생기게 코드를 구성하였기 때문에 아래와 같이 index()를 사용하여 부모 요소 내에서 몇 번째 위치에 있는지 파악할 수 있도록 구현
- DB에 생성되는 시퀀스 번호와 카드의 인덱스를 일치시키기 위해 +1
- 시퀀스번호가 일치하는 컬럼(카드)이 있다면 번호를 교체해줌, 번호를 일괄수정하려 했으나 컬럼개수가 많아진다면 일일이 DB를 업데이트 해줘야하므로 비효율적이라고 판단

```javascript
$('.card-body').sortable({
  handle: '.card-title',
  connectWith: `.card-body[data-column-id]`,
  opacity: 0.5,
  update: function (event, ui) {
    const targetBoard = ui.item;
    const boardId = targetBoard.find('.card-title').attr('data-board-id');
    const newColumnId = targetBoard.closest('.card-body').attr('data-column-id');
    const newBoardSequence = targetBoard.index() + 1;

    orderBoardSequence(boardId, newBoardSequence);
    moveBoard(boardId, newColumnId); // 보드를 새로운 컬럼으로 이동
  },
});
```

```javascript
  // 보드(카드) 동일 컬럼 내 이동
  async orderBoard(body: orderBoardDto, projectId: number, boardId: number): Promise<IResult> {
    const { newBoardSequence } = body;
    const entityManager = this.boardRepository.manager;

    const findBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });

    if (!findBoard) throw new HttpException('해당 보드를 찾을 수 없습니다', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const targetBoard = await this.boardRepository.findOne({ where: { boardSequence: newBoardSequence } });

      if (targetBoard) {
        const changeSequence = findBoard.boardSequence;
        findBoard.boardSequence = targetBoard.boardSequence;
        targetBoard.boardSequence = changeSequence;
        await transactionEntityManager.save(Board, [findBoard, targetBoard]);
      }

      findBoard.boardSequence = newBoardSequence;
      await transactionEntityManager.save(Board, findBoard);
    });

    return { result: true };
  }

  // 보드(카드) 다른 컬럼으로 이동
  async moveBoard(projectId: number, boardId: number, columnId: number): Promise<IResult> {
    const targetBoard = await this.boardRepository.findOne({ where: { id: boardId, project: { id: projectId } } });
    const targetColumn = await this.boardColumnRepository.findOne({ where: { id: columnId }, relations: ['boards'] });
    const entityManager = this.boardRepository.manager;

    if (!targetBoard || !targetColumn) throw new HttpException('해당 보드 또는 컬럼을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);

    await entityManager.transaction(async (transactionEntityManager: EntityManager) => {
      const maxSequence = targetColumn.boards.reduce((max, b) => Math.max(max, b.boardSequence), 0);

      targetBoard.boardColumn = targetColumn;
      targetBoard.boardSequence = maxSequence + 1;
      await transactionEntityManager.save(Board, targetBoard);
    });

    return { result: true };
  }
```
