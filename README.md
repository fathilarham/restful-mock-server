
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
git clone https://github.com/fathil11/restful-mock-server.git
```

Chage to repository directory
```sh
cd restful-mock-server
```

Build the docker image
```sh
docker build -t restful-mock-server .
```

## ⚡ Quick start
Run the image (from port 3000)
```sh
docker run -d -p 3000:3000 restful-mock-server:latest
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

**Index Entity**

Path: http://localhots:3000/entity \
Method: GET

```sh
curl --request GET \
  --url http://localhost:3000/entity
```

**Store Entity**

Path: http://localhots:3000/entity \
Method: POST \
Form: 
- file (required|jsonFile)
- name (required|string)
- replace (optional|boolean)

```sh
curl --request POST \
  --url http://localhost:3000/entity \
  --header 'Content-Type: multipart/form-data' \
  --form name={entity_name} \
  --form file={entity_file_name}.json
```

**Delete Entity**

Path: http://localhots:3000/entity \
Method: POST

```sh
curl --request DELETE \
  --url http://localhost:3000/entity/{entity_name}
```

**Index**

Path: http://localhots:3000/{entity_name} \
Method: GET \
QueryParam: 
- limit (required|number)
- page (required|number)
- search (optional|string)

```sh
curl --request GET \
  --url 'http://localhost:3000/{entity_name}?limit=10&page=1&search=something'
```

**Show**

Path: http://localhots:3000/{entity_name}/{id} \
Method: GET

```sh
curl --request GET \
  --url 'http://localhost:3000/{entity_name}/1'
```

**Store**

Path: http://localhots:3000/{entity_name} \
Method: POST

```sh
curl --request POST \
  --url http://localhost:3000/{entity_name} \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "New User Name"
}'
```

**Update (MOCK)**

Path: http://localhots:3000/{entity_name}/{id} \
Method: PATCH

```sh
curl --request PATCH \
  --url 'http://localhost:3000/{entity_name}/101' \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "Updated"
}'
```

**Delete (MOCK)**

Path: http://localhots:3000/{entity_name}/{id} \
Method: DELETE

```sh
curl --request DELETE \
  --url http://localhost:3000/{entity_name}/100
```