ROOM document
  - id
  - name
  - password
  - currentActiveUsers
  - lastJoined


TODO:
  - create Peer & Socket
  - update videosContainer layout
  - updte app flow (create & join)
  - on create success
    - redirect user to room
    - start Socket
    - start Peer
  - add send invitation email endpoint

dbAdmin
  h4yJttCpZd2YLxMM

rtcDbUser
  NPhwp3zh4DKn9EuF


Setup Sendgrid to use private domain


if room is verified
 - create / join socket room
 - on join broadcast user has join
 - create a new peer / join a peer
 - call each other peer
