# Pages

GitHub: https://github.com/InmobilApp

Deploy: https://inmobil-app.herokuapp.com/

# Indice

<ul>
  <li><a href="#property-schema-refs">Property Schema</a></li>
  <li><a href="#admin-schema-refs">Admin Schema</a></li>
  <li><a href="#get-api-admins-refs">GET /api/admins</a></li>
  <li><a href="#post-api-admins-refs">POST /api/admins</a></li>
  <li><a href="#get-api-admins-id-refs">GET /api/admins/:id</a></li>
  <li><a href="#delete-api-admins-id-refs">DELETE /api/admins/:id</a></li>
  <li><a href="#get-api-property-refs">GET /api/properties</a></li>
  <li><a href="#post-api-property-refs">POST /api/properties</a></li>
  <li><a href="#get-api-property-id-refs">GET /api/properties/:id</a></li>
  <li><a href="#delete-api-properties-id-refs">DELETE /api/properties/:id</a></li>
</ul>

# Schemas

<h3 id="admin-schema-refs"><a href="#admin-schema-refs">Admin Schema</a></h3>

```javascript
const adminSchema = new moongose.Schema({
  name: String,
  DNI: {
    type: String,
    unique: true,
  },
  address: String,
  phone: String,
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  permissions: {
    crudAgent: Boolean,
    crudAdmin: Boolean,
  },
  agentsID: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  ],
});
```

<h3 id="property-schema-refs"><a href="#property-schema-refs">Property Schema</a></h3>

```javascript
const propertySchema = new moongose.Schema({
  typeProperty: {
    type: String,
    enum: {
      values: ['casa', 'apartamento', 'local', 'finca'],
      message: '{VALUE} is not supported',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    address: { type: String, required: true },
  },
  images: [String],
  state: {
    type: String,
    enum: {
      values: ['available', 'unavailable', 'reserved'],
      message: '{VALUE} is not supported',
    },
    default: 'available',
  },
  rentalPrice: String,
  reviews: [
    {
      user: String,
      content: String,
      score: {
        type: Number,
        min: 0,
        max: 5,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  description: String,
  details: {
    area: String,
    rooms: String,
    baths: String,
    garage: Boolean,
  },
  agentID: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
  },
});
```

# Routes

Cuando pasa una ruta desconocida para el "Servidor"

```javascript
response.status(404).send({ error: "unknown endpoint" });
```

Cuando pasas un "id" no valido va a retornar

```javascript
response.status(400).send({ error: "malformatted id" });
```

Cuando ocurre un error al hacer un PUT o POST con el Schema va a retornar un message relacionado con el error.

```javascript
response.status(400).json({ error: error.message });
```

## Ruta: "/api/admins"

<h3 id="get-api-admins-refs"><a href="#get-api-admins-refs">GET /api/admins</a></h3>

Retorna un arreglo con todos los admins guardados en la base de datos.

```json
[
  {
    "permissions": {
      "crudAgent": true,
      "crudAdmin": true
    },
    "name": "David",
    "DNI": "1117598847",
    "address": "...",
    "phone": "322 548 7898",
    "age": 50,
    "agentsID": [],
    "id": "620fb78e52948f937ec1c313"
  }
]
```

<h3 id="post-api-admins-refs"><a href="#post-api-admins-refs">POST /api/admins</a></h3>

Cuando se hace un POST de un Admin no, se nesecita especificar el Agent que tiene a cargo, este se relaciona cuando se crea un Agent y se le pasa como adminID, el id de este.

```json
{
  "name": "David",
  "DNI": "1117598847",
  "address": "...",
  "phone": "322 548 7898",
  "age": 50,
  "permissions": {
    "crudAgent": true,
    "crudAdmin": true
  }
}
...

...
"Objeto retornado al hacer el post"
{
  "name": "David",
  "DNI": "1117598847",
  "address": "...",
  "phone": "322 548 7898",
  "age": 50,
  "permissions": {
      "crudAgent": true,
      "crudAdmin": true
  },
  "agentsID": [],
  "id": "620fb78e52948f937ec1c313"
}
```

<h3 id="get-api-admins-id-refs"><a href="#get-api-admins-id-refs">GET /api/admins/:id</a></h3>

Al hacer un get con "id" a "/api/admins/:id" retorna el admin que coincida con ese ID y adicionalmente trae los detalles de los agentes que tiene a cargo.

```json
{
  "permissions": {
    "crudAgent": true,
    "crudAdmin": true
  },
  "name": "David",
  "DNI": "1117598847",
  "address": "...",
  "phone": "322 548 7898",
  "age": 50,
  "agentsID": [],
  "id": "620fb78e52948f937ec1c313"
}
```

<h3 id="delete-api-admins-id-refs"><a href="#delete-api-admins-id-refs">DELETE /api/admins/:id</a></h3>

Borra el admin con el id pasado por parametro de la base de datos.

---

## Ruta: "/api/properties"

<h3 id="get-api-property-refs"><a href="#get-api-property-refs">GET /api/properties</a></h3>

Retorna un arreglo con todas las propiedades guardadas en la base de datos.

```json
[
  {
    "location": {
      "city": "San luis",
      "neighborhood": "barrio jardin",
      "address": "siempre viva 123"
    },
    "date": null,
    "images": ["dkanvnifnbon", "fjioenaonjj", "fikmieijaij"],
    "state": "available",
    "rentalPrice": "15000",
    "description": "jijikokijijkoko",
    "reviews": [],
    "id": "620e50f466963436806d5aa1"
  },
  {
    "location": {
      "city": "Bogota",
      "neighborhood": "usme",
      "address": "Cll 22B etc..."
    },
    "details": {
      "area": "30",
      "rooms": "2",
      "baths": "2",
      "garage": true
    },
    "typeProperty": "casa",
    "images": ["url", "url1"],
    "state": "available",
    "rentalPrice": "500",
    "description": "Decripcion del inmueble",
    "agentID": "620ebd5845ed0a43962601f8",
    "date": "2022-02-17T23:04:28.918Z",
    "reviews": [],
    "id": "620ed47c289ae07764681633"
  },
  {
    "location": {
      "city": "Bogota",
      "neighborhood": "usme",
      "address": "Cll 22B etc..."
    },
    "details": {
      "area": "30",
      "rooms": "2",
      "baths": "2",
      "garage": true
    },
    "typeProperty": "casa",
    "images": ["url", "url1"],
    "state": "available",
    "rentalPrice": "500",
    "description": "Decripcion del inmueble",
    "agentID": "620ebd5845ed0a43962601f8",
    "date": "2022-02-18T02:31:17.152Z",
    "reviews": [],
    "id": "620f04f5820cd052940c9b4d"
  }
]
```

<h3 id="post-api-property-refs"><a href="#post-api-property-refs">POST /api/properties</a></h3>

Por medio de "body" recibe un objeto con las propiedades requeridas para crear una propiedad, algunas propiedades se inicializan por defecto, como lo son la fecha, y el estado de la propiedad, entre otras. Para crear la propiedad se nesecita un Agente el cual es el encargado de esta, para ello solo nesecitan pasar el id del agente.

```javascript
{
  typeProperty: "casa",
  location: {
    city: "Bogota",
    neighborhood: "usme",
    address: "Cll 22B etc...",
  },
  images: ["url", "url1"],
  rentalPrice: "500",
  description: "Decripcion del inmueble",
  details: {
    area: "30",
    rooms: "2",
    baths: "2",
    garage: true,
  },
  agentID: "620ebd5845ed0a43962601f8",
}
...

...
"Objeto retornado al hacer este post"
{
  "location": {
    "city": "Bogota",
    "neighborhood": "usme",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "casa",
  "images": [
      "url",
      "url1"
    ],
  "state": "available",
  "rentalPrice": "500",
  "description": "Decripcion del inmueble",
  "agentID": "620ebd5845ed0a43962601f8",
  "date": "2022-02-18T02:31:17.152Z",
  "reviews": [],
  "id": "620f04f5820cd052940c9b4d"
}
```

<h3 id="get-api-property-id-refs"><a href="#get-api-property-id-refs">GET /api/properties/:id</a></h3>

Al hacer un get con "id" a "/api/properties/:id" retorna la propiedad que coincida con ese ID y adicionalmente trae las propiedades del agente relacionado a esta.

```json
{
  "location": {
    "city": "Bogota",
    "neighborhood": "usme",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "casa",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "description": "Decripcion del inmueble",
  "agentID": {
    "permissions": {
      "crudProperty": true
    },
    "name": "Dairo",
    "dni": "1014826698",
    "adress": "Direccion random",
    "phone": "56952632614",
    "age": "27",
    "properties": ["620ed47c289ae07764681633", "620f04f5820cd052940c9b4d"],
    "id": "620ebd5845ed0a43962601f8"
  },
  "date": "2022-02-18T02:31:17.152Z",
  "reviews": [],
  "id": "620f04f5820cd052940c9b4d"
}
```

<h3 id="delete-api-properties-id-refs"><a href="#delete-api-properties-id-refs">DELETE /api/properties/:id</a></h3>

Borra la propiedad con el id pasado por parametro de la base de datos y quita la referencia a esta en el agent.

---

<h3 id="agent-schema-refs"><a href="#agent-schema-refs">Agent Schema</a></h3>

```javascript
const agentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  adress: {
    type: String,
    required: true,
  },
  phone: String,
  age: String,
  properties: [
    {
      type: Schema.Types.ObjectID,
      ref: "Property",
    },
  ],
  permissions: {
    crudProperty: Boolean,
  },
  admindID: {
    type: Schema.Types.ObjectID,
    ref: "Admin",
  },
});
```

# Errores

Cuando pasa una ruta desconocida para el "Servidor"

```javascript
response.status(404).send({ error: "unknown endpoint" });
```

Cuando pasas un "id" no valido va a retornar

```javascript
response.status(400).send({ error: "malformatted id" });
```

Cuando ocurre un error al hacer un PUT o POST con el Schema va a retornar un message relacionado con el error.

response.status(400).json({ error: error.message });

# Rutas "api/agents"

### GET "api/agents"

Retorna un arreglo con todas los agentes guardados en la base de datos y su relacion con una propiedad

```json
{
  "permissions": {
    "crudProperty": true
  },
  "name": "David",
  "dni": "1012437698",
  "adress": "Direccion random en bucaramanga",
  "phone": "98565621",
  "age": "22",
  "properties": [
    "620e82d3a72c0b07f4a80ae3" // --> Relacion
  ],
  "id": "620e808a8034ceb08eb309a8"
}
```

### GET "api/agents/:id"

Retorna un arreglo con todas las propiedades guardadas en la base de datos y su relacion con una propiedad (Muestra la info completa de esa propiedad)

```json
{
  "permissions": {
    "crudProperty": true
  },
  "name": "David",
  "dni": "1012437698",
  "adress": "Direccion random en bucaramanga",
  "phone": "98565621",
  "age": "22",
  "properties": [
    // -----> Info completa de esa propiedad
    {
      "ubication": {
        "city": "Bogota",
        "neighbourhooh": "usme",
        "adress": "Cll 22B etc..."
      },
      "details": {
        "area": "30",
        "rooms": "2",
        "baths": "2",
        "garage": true
      },
      "typeProperty": "casa",
      "images": ["url", "url1"],
      "state": "available",
      "rentalPrice": "500",
      "description": "Decripcion del inmueble",
      "agentID": "620e808a8034ceb08eb309a8",
      "date": "2022-02-17T17:16:03.063Z",
      "reviews": [],
      "id": "620e82d3a72c0b07f4a80ae3"
    }
  ],
  "id": "620e808a8034ceb08eb309a8"
}
```

### POST "api/agents"

Por medio de "body" recibe un objeto con las propiedades requeridas para crear una propiedad

```javascript
{
  adminID: "620e806162c266edbeaca6f7",
  dni: "1075982698",
  name: "Gabriel",
  adress: "Springfield",
  phone: "7591546",
  age: "30",
  permissions: {
    crudProperty: true
  }
}
...
...
"JSON retornado al hacer este post"
{
    "name": "Gabriel",
    "dni": "1075982698",
    "adress": "Springfield",
    "phone": "7591546",
    "age": "30",
    "properties": [],
    "permissions": {
        "crudProperty": true
    },
    "id": "620ed23cd2696158e8b89619"
}
```

### DELETE "api/agents/620e808a8034ceb08eb309a8"

Borra la propiedad con el id pasado por parametro de la base de datos.
