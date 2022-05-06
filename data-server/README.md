## Sample cars positions update service

```
npm run server
```

Will start the service on port 8080 (you're free to change the port) and will accept socket.io connections using default settings.

On initial connection the socket.io client will receive `cars` event with all cars in the following format:

```json
[
{"id":7,"name":"Car 7","lat":54.629796087903216,"lng":18.900004673694244},
{"id":6,"name":"Car 6","lat":54.726860675942255,"lng":18.904665864862093}
]
```

Afterwards updates to cars positions will be emited with `carPositionChanged` event e.g.

```json
{"id":7,"name":"Car 7","lat":54.629798087903216,"lng":18.900004673694244}
```
