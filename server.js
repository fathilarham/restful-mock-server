const fs = require('fs');
const express = require('express');
const { check, validationResult } = require('express-validator');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

// Index Entity
app.get('/entity', (req, res) => {
    let entities = [];

    files = fs.readdirSync('./data');

    files.forEach(file => {
        entity = file.slice(0, -5)
        entities.push(entity)
    });

    return res.status(200).json({data: entities})
})

// Store/Put Entity
app.post('/entity', check('name', 'required').notEmpty(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({errors: [{msg: 'required', param: 'file', location: 'body'}]});
    }

    let entityName = req.body.name
    let file = req.files.file;
    let replace = req.body.replace || false
    if (isEntityExists(entityName) && !replace) {
        return res.status(400).json({message: 'entity is already exists. Set the "replace" field to true to replace'})
    }

    file.mv(`./data/${entityName}.json`, function (err) {
        if (err) return res.status(500).send(err);
    });

    return res.sendStatus(200);
})

// Delete Entity
app.delete('/entity/:entityName', (req, res) => {
    entityName = req.params.entityName
    if (!isEntityExists(entityName)) {
        return res.sendStatus(404)
    }

    fs.unlinkSync(`./data/${entity}.json`)

    return res.sendStatus(200)
})

// Index
app.get('/:entityName', (req, res) => {
    let entityName = req.params.entityName
    
    let entities = getEntityJSON(entityName);
    if (!entities) {
        return res.sendStatus(404)
    }

    let limit = req.query.limit;
    let page = req.query.page;
    let search = req.query.search;

    if (!limit || !page) {
        return res.status(400).json({ "message": "limit and page is required" })
    }

    if (search) {
        entities = processSearch(search, entities)
    }

    entities = processPagination(limit, page, entities)

    return res.status(200).json(entities)
})

// Show
app.get("/:entityName/:id", (req, res) => {
    let entityName = req.params.entityName
    let id = req.params.id

    let entities = getEntityJSON(entityName);
    if (!entities) {
        return res.sendStatus(404)
    }

    entities = findEntitiesById(id, entities)
    if (entities.length == 0) {
        return res.sendStatus(404)
    }

    return res.status(200).json({data: entities[0]})
})

// Store
app.post("/:entityName", (req, res) => {
    let entityName = req.params.entityName
    let jsonInput = req.body
    
    let entities = getEntityJSON(entityName);
    if (!entities) {
        return res.sendStatus(404)
    }

    if (Object.keys(jsonInput).length === 0) {
        return res.status(400).json({message: `JSON body must have a ${entityName} value`})
    }

    entityLastId = entities[entities.length - 1].id || entities[entities.length - 1].uuid
    if (!entityLastId) return res.status(400).json({message: 'undefine identifier'})

    let insertedId
    if (Number.isInteger(entityLastId)) {
        insertedId = entityLastId + 1
    } else {
        insertedId = uuidv4()
    }
    jsonInput = {id: insertedId, ...jsonInput}
    entities.push(jsonInput)

    fs.writeFileSync(`./data/${entityName}.json`, JSON.stringify(entities, null, 4))

    return res.status(200).json({data: {id: insertedId}})
})

// Update
app.patch('/:entityName/:id', (req, res) => {
    let entityName = req.params.entityName
    let id = req.params.id
  
    let entities = getEntityJSON(entityName);
    if (!entities) {
        return res.sendStatus(404)
    }

    entities = findEntitiesById(id, entities)
    if (entities.length == 0) {
        return res.sendStatus(404)
    }

    return res.sendStatus(200)
})

// Delete
app.delete('/:entityName/:id', (req, res) => {
    let entityName = req.params.entityName
    let id = req.params.id
  
    let entities = getEntityJSON(entityName);
    if (!entities) {
        return res.sendStatus(404)
    }
})

app.listen(3000)









// Helper
function getEntityJSON(entity) {
    try {
        let entityJSON = fs.readFileSync(`./data/${entity}.json`, 'utf8');
        return JSON.parse(entityJSON)
    } catch (error) {
        return null
    }
}

function processSearch(search, data) {
    const keys = Object.keys(data[0]);

    const result = data.filter(d => {
        let verdict = false;

        keys.forEach(k => {
            if (k != 'id' || k != 'uuid') {
                if (d[k].toString().toLowerCase().includes(search.toLowerCase())) verdict = true;
            }
        });

        return verdict;
    });

    return result;
}

function processPagination(limit, page, data) {
    let startOffset = (limit * page) - limit
    let endOffset = limit * page
    let ids = []

    if (data.length > 0) {
        if ("id" in data[0]) {
            ids = data.map(item => item.id)
        } else if ("uuid" in data[0]) {
            ids = data.map(item => item.uuid)
        }
    }

    result = data.slice(startOffset, endOffset)
    return {
        metadata: {
            count: result.length,
            page: parseInt(page),
            total_page: Math.ceil(data.length / limit),
            total_count: data.length
        },
        data: {
            paginated_result: result,
            ids: ids
        }
    }
}

function findEntitiesById(id, entities) {
    return entities.filter(d => {
        let idKey = d['id'] ? 'id' : d['uuid'] ? 'uuid' : 'id'
        if (d['id']) {
            idKey = 'id'
        } else if (d['uuid']) {
            idKey = 'uuid'
        }

        return (d[idKey].toString() == id.toString());
    })
}

function isEntityExists(entity) {
    let files = fs.readdirSync('./data');
    let found = false
    
    files.forEach(file => {
        if (file.slice(0, -5) == entity) {
            found = true
        }
    });

    return found
}
