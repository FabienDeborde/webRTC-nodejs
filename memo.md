ROOM document
  - id
  - name
  - password
  - currentActiveUsers
  - lastJoined


TODO:
  - improve layout

dbAdmin
  h4yJttCpZd2YLxMM

rtcDbUser
  NPhwp3zh4DKn9EuF





if room is verified
 - create / join socket room
 - on join broadcast user has join
 - create a new peer / join a peer
 - call each other peer

---
- server
  - on connection
    - on 'join-room'
       => receive roomID & userID
       => socket join room (roomID)
       => broadcast to everyone in room, emit 'user-connected' with userID
       => on 'disconnect'
        => broadcast emit 'user-disconnected' with userID

- client
  - create new Peer
  - on peer 'open'
    => receive ID
    - emit 'join-room' with roomID & userID (peer ID)
  - get own video stream
    - on 'user-connected'
      => receive userID
      => call connected user & send stream peer.call(userID, stream)
        => call on 'stream', receive new user stream (create new video element with it)
        => call on 'close', remove video element
      => store userID & associated call somewhere
    - on peer 'call'
      => receive call object
      => answer the call (call.answer(stream))
      => call on 'stream', receive new user stream (create new video element with it)
  - on 'user-disconnected'
    => receive userID
    => close call for this userID
