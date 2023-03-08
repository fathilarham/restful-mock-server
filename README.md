
# ⛺ REST Mock

A simple node service to serve RESTFul API from the json data file.


## Features

- Index (pagination, search)
- Show
- Store (with auto generate id)
- Update (MOCK)
- Delete (MOCK)
## Installation
Clone this repository
```sh
git clone ...
```

Build the docker image
```sh
docker build -t mock-server .
```
## ⚡ Quick start
Run the image (from port 3000)
```sh
docker run -d -p 3000:3000 mock-server:latest
```

Upload the mock list data json
```sh
curl --request POST \
  --url http://localhost:3000/entity \
  --header 'Content-Type: multipart/form-data' \
  --form name=user \
  --form file=user.json
```

Use the entity REST operation
```sh
curl --request GET \
  --url 'http://localhost:3000/user?limit=10&page=1&search=something'
```
## Usage

**Index**

Path: http://localhots:3000/{entity_name} \
Method: GET \
QueryParam: 
- limit (required|number)
- page (required|number)
- search (optional|string)

```sh
curl --request GET \
  --url 'http://localhost:3000/user?limit=10&page=1&search=something'
```

**Show**

Path: http://localhots:3000/{entity_name}/{id} \
Method: GET

```sh
curl --request GET \
  --url 'http://localhost:3000/user/1'
```

**Store**

Path: http://localhots:3000/{entity_name} \
Method: POST

```sh
curl --request POST \
  --url http://localhost:3000/user \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "New User Name"
}'
```

**Update**

Path: http://localhots:3000/{entity_name}/{id} \
Method: PATCH

```sh
curl --request PATCH \
  --url 'http://localhost:3000/user/101' \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "Updated"
}'
```

**Delete**

Path: http://localhots:3000/{entity_name}/{id} \
Method: DELETE

```sh
curl --request DELETE \
  --url http://localhost:3000/user/100
```

