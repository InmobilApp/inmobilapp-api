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
  <li><a href="#put-api-property-id-refs">PUT /api/properties/:id</a></li> 
  <li><a href="#delete-api-properties-id-refs">DELETE /api/properties/:id</a></li>
  <li><a href="#agent-schema-refs">AGENT SCHEMA</a></li>
  <li><a href="#get-api-agents-refs">GET /api/agents</a></li>
  <li><a href="#post-api-agents-refs">POST /api/agents</a></li>
  <li><a href="#delete-api-agents-id-refs">DELETE /api/agents/:id</a></li>
  <li><a href="#client-schema-refs">CLIENT SCHEMA</a></li>
  <li><a href="#get-api-clients-refs">GET /api/clients</a></li>
  <li><a href="#post-api-clients-refs">POST /api/clients</a></li>
  <li><a href="#delete-api-clients-id-refs">DELETE /api/clients/:id</a></li>
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
      values: ["casa", "apartamento", "local", "finca"],
      message: "{VALUE} is not supported",
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
      values: ["available", "unavailable", "reserved"],
      message: "{VALUE} is not supported",
    },
    default: "available",
  },
  rentalPrice: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
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
    ref: "Agent",
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

```json
{
  "typeProperty": "local",
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "images": ["url", "url1"],
  "rentalPrice": "500",
  "description": "Decripcion del inmueble",
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "agentID": "621271c06ec04903d5c20e0f"
}
...

...
"Objeto retornado al hacer este post"
{
  "typeProperty": "local",
  "location": {
      "city": "Florencia",
      "neighborhood": "La paz",
      "address": "Cll 22B etc..."
  },
  "images": [
      "url",
      "url1"
  ],
  "state": "available",
  "rentalPrice": "500",
  "reviews": [],
  "description": "Decripcion del inmueble",
  "details": {
      "area": "30",
      "rooms": "2",
      "baths": "2",
      "garage": true
  },
  "agentID": "621271c06ec04903d5c20e0f",
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

<h3 id="get-api-property-id-refs"><a href="#get-api-property-id-refs">GET /api/properties/:id</a></h3>

Al hacer un get con "id" a "/api/properties/:id" retorna la propiedad que coincida con ese ID.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "reviews": [],
  "description": "Decripcion del inmueble",
  "agentID": "621271c06ec04903d5c20e0f",
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

Al hacer un get con "id" a "/api/properties/:id/?detailsAgent=true" retorna la propiedad que coincida con ese ID y con los detalles del agente que la creo.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "reviews": [],
  "description": "Decripcion del inmueble",
  "agentID": {
    "permissions": {
      "crudProperty": true
    },
    "name": "Dairo",
    "dni": "1117531587",
    "adress": "Springfield",
    "phone": "322 225 4787",
    "age": "30",
    "properties": ["6212720c6ec04903d5c20e13"],
    "id": "621271c06ec04903d5c20e0f"
  },
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

Al hacer un get con "id" a "/api/properties/:id/?detailsReviews=true" retorna la propiedad que coincida con ese ID y con los detalles de las reviews hechas a esta propiedad.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "reviews": [
    {
      "user": "Dairo",
      "score": 4,
      "content": "No esta Mal",
      "porpertyID": "6212720c6ec04903d5c20e13",
      "date": "2022-02-20T17:00:28.778Z",
      "id": "621273ac6ec04903d5c20e1c"
    },
    {
      "user": "Pedro",
      "score": 3,
      "content": "Regular",
      "porpertyID": "6212720c6ec04903d5c20e13",
      "date": "2022-02-20T17:01:54.328Z",
      "id": "621274026ec04903d5c20e20"
    }
  ],
  "description": "Decripcion del inmueble",
  "agentID": "621271c06ec04903d5c20e0f",
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

Al hacer un get con "id" a "/api/properties/:id/?detailsReviews=true&detailsAgent=true" retorna la propiedad que coincida con ese ID y con los detalles de las reviews hechas a esta propiedad y ademas los detalles del agente.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "reviews": [
    {
      "user": "Dairo",
      "score": 4,
      "content": "No esta Mal",
      "porpertyID": "6212720c6ec04903d5c20e13",
      "date": "2022-02-20T17:00:28.778Z",
      "id": "621273ac6ec04903d5c20e1c"
    },
    {
      "user": "Pedro",
      "score": 3,
      "content": "Regular",
      "porpertyID": "6212720c6ec04903d5c20e13",
      "date": "2022-02-20T17:01:54.328Z",
      "id": "621274026ec04903d5c20e20"
    }
  ],
  "description": "Decripcion del inmueble",
  "agentID": {
    "permissions": {
      "crudProperty": true
    },
    "name": "Dairo",
    "dni": "1117531587",
    "adress": "Springfield",
    "phone": "322 225 4787",
    "age": "30",
    "properties": ["6212720c6ec04903d5c20e13"],
    "id": "621271c06ec04903d5c20e0f"
  },
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

<h3 id="put-api-property-id-refs"><a href="#put-api-property-id-refs">PUT /api/properties/:id</a></h3>

Para hacer un put deverian hacer primero un get al la propiedad que desean modificar con "/api/properties/:id" sin ninguna "query", enviar el objeto completo con las propiedades que cambiaron.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "500",
  "reviews": ["621273ac6ec04903d5c20e1c", "621274026ec04903d5c20e20"],
  "description": "Decripcion del inmueble",
  "agentID": "621271c06ec04903d5c20e0f",
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

Por ejemplo desean cambiar el "rentalPrice", el axios le devolveria ya un objeto de "javascript".

```javascript
const propertyReturned = {
  ...property,
  rentalPrice: "700",
};
```

Esto retornaria el siguiente Objeto.

```json
{
  "location": {
    "city": "Florencia",
    "neighborhood": "La paz",
    "address": "Cll 22B etc..."
  },
  "details": {
    "area": "30",
    "rooms": "2",
    "baths": "2",
    "garage": true
  },
  "typeProperty": "local",
  "images": ["url", "url1"],
  "state": "available",
  "rentalPrice": "700",
  "reviews": ["621273ac6ec04903d5c20e1c", "621274026ec04903d5c20e20"],
  "description": "Decripcion del inmueble",
  "agentID": "621271c06ec04903d5c20e0f",
  "date": "2022-02-20T16:53:32.667Z",
  "id": "6212720c6ec04903d5c20e13"
}
```

<h3 id="delete-api-properties-id-refs"><a href="#delete-api-properties-id-refs">DELETE /api/properties/:id</a></h3>

Borra la propiedad con el id pasado por parametro de la base de datos y quita la referencia a esta en el agent.

---

get reviews

```json
[
  {
    "user": "Dairo",
    "score": 4,
    "content": "No esta Mal",
    "porpertyID": "6212720c6ec04903d5c20e13",
    "date": "2022-02-20T17:00:28.778Z",
    "id": "621273ac6ec04903d5c20e1c"
  },
  {
    "user": "Pedro",
    "score": 3,
    "content": "Regular",
    "porpertyID": "6212720c6ec04903d5c20e13",
    "date": "2022-02-20T17:01:54.328Z",
    "id": "621274026ec04903d5c20e20"
  }
]
```

Post reviews

```json

  {
    "user": "Dairo",
    "content": "No esta Mal",
    "score": 4,
    "porpertyID": "6212720c6ec04903d5c20e13"
  }

  "Objeto retornado al hacer este post"

  {
    "user": "Dairo",
    "score": 4,
    "content": "No esta Mal",
    "porpertyID": "6212720c6ec04903d5c20e13",
    "date": "2022-02-20T17:00:28.778Z",
    "id": "621273ac6ec04903d5c20e1c"
  }
```

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

<h3 id="get-api-agents-refs"><a href="#get-api-agents-refs">GET /api/agents</a></h3>

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

Retorna un JSON con la informacion completa de un agente guardado en la base de datos y su relacion con una propiedad (Muestra la info completa de esa propiedad)

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

<h3 id="post-api-agents-refs"><a href="#post-api-agents-refs">POST /api/agents</a></h3>

Por medio de "body" recibe un objeto con las propiedades requeridas para crear un agente

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

<h3 id="delete-api-agents-id-refs"><a href="#delete-api-agents-id-refs">DELETE /api/agents/:id</a></h3>

Borra el agente con el id pasado por parametros.

---

<h3 id="client-schema-refs"><a href="#client-schema-refs">Client Schema</a></h3>

```javascript
const clientSchema = new Schema({
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
  permissions: {
    crudClient: Boolean,
  },
  payDay: String,
  paymentIssued: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  propertyID: {
    type: Schema.Types.ObjectId,
    ref: "Property",
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

```javascript
response.status(400).json({ error: error.message });
```

# Rutas "api/clients"

### GET "api/clients"

<h3 id="get-api-clients-refs"><a href="#get-api-clients-refs">GET /api/clients</a></h3>

Retorna un arreglo con todas los clientes guardados en la base de datos y su relacion con una propiedad (propertyID)

```json
{
        "permissions": {
            "crudClient": true
        },
        "name": "Alexander",
        "dni": "1012312432",
        "adress": "Direccion random en Medellin",
        "phone": "3194785677",
        "age": "29",
        "payDay": "16/02/2022",
        "paymentIssued": [
            {
                "_id": "620ea3ef1e94bd784df9d473",
                "date": "2022-02-17T19:37:19.985Z"
            }
        ],
        "propertyID": "620e82348c77394d2ef5f506", ----> Relacion
        "id": "620ea3ef1e94bd784df9d472"
    }
```

### GET "api/clients/:id"

Retorna un JSON con la informacion completa del cliente en la base de datos y su relacion con una propiedad (Muestra la info completa de esa propiedad)

```JSON
{
    "permissions": {
        "crudClient": true
    },
    "name": "Alexander",
    "dni": "1012312432",
    "adress": "Direccion random en Medellin",
    "phone": "3194785677",
    "age": "29",
    "payDay": "16/02/2022",
    "paymentIssued": [
        {
            "_id": "620ea3ef1e94bd784df9d473",
            "date": "2022-02-17T19:37:19.985Z"
        }
    ],
    "propertyID": {      ------> Info completa de la relacion
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
        "images": [
            "url",
            "url1"
        ],
        "state": "available",
        "rentalPrice": "500",
        "description": "Decripcion del inmueble",
        "agentID": "620e808a8034ceb08eb309a8",
        "date": "2022-02-17T17:13:24.958Z",
        "reviews": [],
        "id": "620e82348c77394d2ef5f506"
    },
    "id": "620ea3ef1e94bd784df9d472"
}
```

### POST "api/clients"

<h3 id="post-api-clients-refs"><a href="#post-api-clients-refs">POST /api/clients</a></h3>

Por medio de "body" recibe un objeto con las propiedades requeridas para crear un cliente

```javascript
{
  propertyID: "620e819562c266edbeaca701", -----> Se debe enviar para hacer la relación
  name: "David",
  dni: "1245896152",
  adress: "Direccion random en Barranquilla",
  phone: "3228942237",
  age: "22",
  permission: {
    crudClient: true
  },
  payDay: "16",
  paymentIssued: [
    {
      date: "2022-01-16T02:40:10.671Z"
    }
  ]
}
...
...
"JSON retornado al hacer este post"
{
    "name": "David",
    "dni": "1245896152",
    "adress": "Direccion random en Barranquilla",
    "phone": "3228942237",
    "age": "22",
    "payDay": "16",
    "paymentIssued": [
        {
            "date": "2022-01-16T02:40:10.671Z",
            "_id": "620fbfb5110661bb445f1a0c"
        }
    ],
    "propertyID": "620e819562c266edbeaca701", ----> Relacion
    "id": "620fbfb5110661bb445f1a0b"
}
```

### DELETE "api/clients/620fbfb5110661bb445f1a0b"

<h3 id="delete-api-clients-id-refs"><a href="#delete-api-clients-id-refs">DELETE /api/clients/:id</a></h3>

Borra el cliente con el id pasado por parametros.
