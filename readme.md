# Pages

GitHub: https://github.com/InmobilApp

Deploy: https://inmobil-app.herokuapp.com/

# Indice

<ul>
  <li><a href="#admin-schema-refs">Admin Schema</a></li>
  <li><a href="#get-api-admins-refs">GET /api/admins</a></li>
  <li><a href="#post-api-admins-refs">POST /api/admins</a></li>
  <li><a href="#get-api-admins-id-refs">GET /api/admins/:id</a></li>
  <li><a href="#delete-api-admins-id-refs">DELETE /api/admins/:id</a></li>
  <br>
  <li><a href="#property-schema-refs">Property Schema</a></li>
  <li><a href="#get-api-property-refs">GET /api/properties</a></li>
  <li><a href="#post-api-property-refs">POST /api/properties</a></li>
  <li><a href="#get-api-property-id-refs">GET /api/properties/:id</a></li>
  <li><a href="#put-api-property-id-refs">PUT /api/properties/:id</a></li>
  <li><a href="#delete-api-properties-id-refs">DELETE /api/properties/:id</a></li>
  <br>
  <li><a href="#review-schema-refs">Review Schema</a></li>
  <li><a href="#get-api-review-refs">GET /api/reviews</a></li>
  <li><a href="#get-api-review-id-refs">GET /api/reviews/:id</a></li>
  <li><a href="#post-api-review-refs">POST /api/reviews</a></li>
  <li><a href="#delete-api-review-id-refs">DELETE /api/reviews/:id</a></li>
  <br>
  <li><a href="#agent-schema-refs">AGENT SCHEMA</a></li>
  <li><a href="#get-api-agents-refs">GET /api/agents</a></li>
  <li><a href="#post-api-agents-refs">POST /api/agents</a></li>
  <li><a href="#put-api-agent-id-refs">PUT /api/agents/:id</a></li>
  <li><a href="#delete-api-agents-id-refs">DELETE /api/agents/:id</a></li>
  <br>
  <li><a href="#client-schema-refs">CLIENT SCHEMA</a></li>
  <li><a href="#get-api-clients-refs">GET /api/clients</a></li>
  <li><a href="#post-api-clients-refs">POST /api/clients</a></li>
  <li><a href="#update-api-clients-refs">PUT /api/clients</a></li>
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
  rentalPrice: {
    type: Number,
    min: 10,
    max: 5000000,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  description: {
    type: String,
    minlength: 10,
  },
  details: {
    area: {
      type: Number,
      min: 10,
      max: 1000,
    },
    rooms: {
      type: Number,
      min: 1,
      max: 20,
    },
    baths: {
      type: Number,
      min: 1,
      max: 20,
    },
    garage: Boolean,
  },
  agentID: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
  },
});
```

<h3 id="get-api-property-refs"><a href="#get-api-property-refs">GET /api/properties</a></h3>

Retorna un arreglo con todas las propiedades guardadas en la base de datos.

```json
[
  {
    "location": {
      "city": "Bogota",
      "neighborhood": "bosa",
      "address": "Cra 2B"
    },
    "details": {
      "area": 10,
      "rooms": 1,
      "baths": 1,
      "garage": true
    },
    "typeProperty": "casa",
    "images": [
      "https://assets-global.website-files.com/5f4f67c5950db17954dd4f52/5f5b7ee442f1e5b9fee1c117_hacerse-una-casa.jpeg"
    ],
    "state": "available",
    "rentalPrice": 500,
    "reviews": [],
    "description": "Esta es una casa ubicada en Bogota",
    "agentID": "62140409a933fe675f1d0db5",
    "date": "2022-02-24T01:19:07.461Z",
    "id": "6216dd0b1ad5cc90813e26d5"
  },
  {
    "location": {
      "city": "Florencia",
      "neighborhood": "La paz",
      "address": "Calle 22B"
    },
    "details": {
      "area": 500,
      "rooms": 15,
      "baths": 12,
      "garage": true
    },
    "typeProperty": "finca",
    "images": [
      "https://assets-global.website-files.com/5f4f67c5950db17954dd4f52/5f5b7ee442f1e5b9fee1c117_hacerse-una-casa.jpeg"
    ],
    "state": "available",
    "rentalPrice": 2000,
    "reviews": [],
    "description": "Esta es una casa ubicada en Bogota",
    "agentID": "62140409a933fe675f1d0db5",
    "date": "2022-02-24T01:24:31.824Z",
    "id": "6216de4f1ad5cc90813e26d9"
  },
  {
    "location": {
      "city": "Buenos aires",
      "neighborhood": "no se",
      "address": "Calle 22B"
    },
    "details": {
      "area": 100,
      "rooms": 5,
      "baths": 3,
      "garage": false
    },
    "typeProperty": "local",
    "images": [
      "https://assets-global.website-files.com/5f4f67c5950db17954dd4f52/5f5b7ee442f1e5b9fee1c117_hacerse-una-casa.jpeg"
    ],
    "state": "available",
    "rentalPrice": 5000,
    "reviews": [],
    "description": "Esta es una casa ubicada en Bogota",
    "agentID": "62140409a933fe675f1d0db5",
    "date": "2022-02-24T01:25:19.697Z",
    "id": "6216de7f1ad5cc90813e26dd"
  }
]
```

GET a "/api/properties/?detailsReviews=true" retorna un arreglo con todas las propiedades guardadas en la base de datos y ademas con los detalles de las reviews hechas a esta.

```json
[
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
        "user": "Pedro",
        "score": 3,
        "content": "Regular",
        "porpertyID": "62129899cde25ed20f597717",
        "date": "2022-02-20T19:39:01.315Z",
        "id": "621298d5cde25ed20f59771b"
      },
      {
        "user": "Maria",
        "score": 5,
        "content": "Regular",
        "porpertyID": "62129899cde25ed20f597717",
        "date": "2022-02-20T19:39:09.989Z",
        "id": "621298ddcde25ed20f59771f"
      }
    ],
    "description": "Decripcion del inmueble",
    "agentID": "62129850cde25ed20f597711",
    "date": "2022-02-20T19:38:01.097Z",
    "id": "62129899cde25ed20f597717"
  },
  {
    "location": {
      "city": "Bogota",
      "neighborhood": "Suba",
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
    "reviews": [
      {
        "user": "Dairo",
        "score": 5,
        "content": "Buena",
        "porpertyID": "621298fbcde25ed20f597723",
        "date": "2022-02-20T19:40:02.756Z",
        "id": "62129912cde25ed20f597727"
      }
    ],
    "description": "Decripcion del inmueble",
    "agentID": "62129850cde25ed20f597711",
    "date": "2022-02-20T19:39:39.178Z",
    "id": "621298fbcde25ed20f597723"
  }
]
```

<h3 id="post-api-property-refs"><a href="#post-api-property-refs">POST /api/properties</a></h3>

Por medio de "body" recibe un objeto con las propiedades requeridas para crear una propiedad, algunas propiedades se inicializan por defecto, como lo son la fecha, y el estado de la propiedad, entre otras. Para crear la propiedad se nesecita un Agente el cual es el encargado de esta, para ello solo nesecitan pasar el id del agente.

```json
{
  "typeProperty": "casa", //--> 'casa', 'apartamento', 'local', 'finca'
  "location": {
    "city": "Bogota",
    "neighborhood": "bosa",
    "address": "Cra 2B"
  },
  "images": [
    "https://assets-global.website-files.com/5f4f67c5950db17954dd4f52/5f5b7ee442f1e5b9fee1c117_hacerse-una-casa.jpeg"
  ],
  "rentalPrice": 500, //-> min: 10, max: 5000000
  "description": "Esta es una casa ubicada en Bogota", //--> min 10 characters
  "details": {
    "area": 10, //--> min: 10, max: 1000
    "rooms": 1, //--> min: 1, max: 20
    "baths": 1, //--> min: 1, max: 20
    "garage": true
  },
  "agentID": "62140409a933fe675f1d0db5"
}
```

Retorna

```json
{
  "typeProperty": "casa",
  "location": {
    "city": "Bogota",
    "neighborhood": "bosa",
    "address": "Cra 2B"
  },
  "images": [
    "https://assets-global.website-files.com/5f4f67c5950db17954dd4f52/5f5b7ee442f1e5b9fee1c117_hacerse-una-casa.jpeg"
  ],
  "state": "available",
  "rentalPrice": 500,
  "reviews": [],
  "description": "Esta es una casa ubicada en Bogota",
  "details": {
    "area": 10,
    "rooms": 1,
    "baths": 1,
    "garage": true
  },
  "agentID": "62140409a933fe675f1d0db5",
  "date": "2022-02-24T01:19:07.461Z",
  "id": "6216dd0b1ad5cc90813e26d5"
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

<h3 id="review-schema-refs">
<a href="#review-schema-refs">Review Schema</a>
</h3>

```javascript
const reviewSchema = new moongose.Schema({
  user: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  porpertyID: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Property",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
```

<h3 id="get-api-review-refs">
<a href="#get-api-review-refs">GET /api/reviews</a>
</h3>

Retorna un arreglo con todas las reviews de todas las propiedades.

```json
[
  {
    "user": "Pedro",
    "score": 3,
    "content": "Regular",
    "porpertyID": "62129899cde25ed20f597717",
    "date": "2022-02-20T19:39:01.315Z",
    "id": "621298d5cde25ed20f59771b"
  },
  {
    "user": "Maria",
    "score": 5,
    "content": "Regular",
    "porpertyID": "62129899cde25ed20f597717",
    "date": "2022-02-20T19:39:09.989Z",
    "id": "621298ddcde25ed20f59771f"
  },
  {
    "user": "Dairo",
    "score": 5,
    "content": "Buena",
    "porpertyID": "621298fbcde25ed20f597723",
    "date": "2022-02-20T19:40:02.756Z",
    "id": "62129912cde25ed20f597727"
  }
]
```

<h3 id="get-api-review-id-refs">
<a href="#get-api-review-id-refs">GET /api/reviews/:id</a>
</h3>

Retorna la review especifica de una propiedad.

```json
{
  "user": "Pedro",
  "score": 3,
  "content": "Regular",
  "porpertyID": "62129899cde25ed20f597717",
  "date": "2022-02-20T19:39:01.315Z",
  "id": "621298d5cde25ed20f59771b"
}
```

Si le agrega a la ruta la "query", "/api/reviews/:id/?detailsProperty=true" esta devulve la review y la propiedad a la que se le hizo.

```json
{
  "user": "Pedro",
  "score": 3,
  "content": "Regular",
  "porpertyID": {
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
    "reviews": ["621298d5cde25ed20f59771b", "621298ddcde25ed20f59771f"],
    "description": "Decripcion del inmueble",
    "agentID": "62129850cde25ed20f597711",
    "date": "2022-02-20T19:38:01.097Z",
    "id": "62129899cde25ed20f597717"
  },
  "date": "2022-02-20T19:39:01.315Z",
  "id": "621298d5cde25ed20f59771b"
}
```

<h3 id="post-api-review-refs">
<a href="#post-api-review-refs">POST /api/reviews</a>
</h3>

```json
{
  "user": "Dairo",
  "content": "Buena",
  "score": 5,
  "porpertyID": "621298fbcde25ed20f597723"
}

"retorna el siguiente Object"

{
  "user": "Dairo",
  "score": 5,
  "content": "Buena",
  "porpertyID": "621298fbcde25ed20f597723",
  "date": "2022-02-20T19:40:02.756Z",
  "id": "62129912cde25ed20f597727"
}
```

<h3 id="delete-api-review-id-refs">
<a href="#delete-api-review-id-refs">DELETE /api/reviews/:id</a>
</h3>

Borra la review a la que hace referencia el id.

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
  address: {
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
  "address": "Direccion random en bucaramanga",
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
  "address": "Direccion random en bucaramanga",
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
  adminID: "620e806162c266edbeaca6f7",  // ----> Se debe pasar el id del admin (RELACION)
  dni: "1075982698",
  name: "Gabriel",
  address: "Springfield",
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
    "address": "Springfield",
    "phone": "7591546",
    "age": "30",
    "properties": [],
    "permissions": {
        "crudProperty": true
    },
    "id": "620ed23cd2696158e8b89619"
}
```

### PUT "api/agents/620ed23cd2696158e8b89619"

<h3 id="put-api-agent-id-refs"><a href="#put-api-agent-id-refs">PUT /api/agents/:id</a></h3>
Por medio de "body" recibe un objeto con los datos que se quieren actualizar agente

```json
{
  "name": "David" // Aca solo quiero actualizar el nombre del agente
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
  password: {
    type: String,
    required: true,
  },
  address: {
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

Cuando no se envia el token, para hacer un update o delete de un cliente.

```json
{
    "name": "JsonWebTokenError",
    "message": "jwt must be provided"    <-------------
}
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

```json
{
  "name": "Mauricio",
  "dni": "39641178",
  "password": "miClaveSegurita",
  "address": "Direccion random en Colombia",
  "phone": "3194785623",
  "age": "28"
}
...
...
"JSON retornado al hacer este post"
{
    "name": "Mauricio",
    "dni": "39641178",
    "address": "Direccion random en Colombia",
    "phone": "3194785623",
    "age": "28",
    "paymentIssued": [],
    "id": "621028e3a791a20727b27883"
}
```

### PUT "api/clients/621028e3a791a20727b27883"

<h3 id="update-api-clients-id-refs"><a href="#update-api-clients-id-refs">UPDATE /api/clients/:id</a></h3>

Por medio de "body" recibe un objeto con los datos que se quieren actualizar del cliente. Sin el token, no se puede actualizar la info del cliente.

```JSON
{
   "propertyID": "620e811562c266edbeaca6fd",  --------> Si quiero hacer una relacion (Si quiero asignarle una propiedad al cliente). No es obligatorio enviarla
  "address": "Direccion random en Bogota",
  "phone": "3194785677",
  "age": "30",
  "payDay": "17"
}
...
...
"JSON retornado al hacer el PUT"
{
    "name": "Mauricio",
    "dni": "39641178",
    "address": "Direccion random en Bogota",
    "phone": "3194785677",
    "age": "30",
    "paymentIssued": [],
    "payDay": "17",
    "propertyID": "620e811562c266edbeaca6fd",                 ---------> Relacion hecha
    "id": "621028e3a791a20727b27883"
}
```

### DELETE "api/clients/620fbfb5110661bb445f1a0b"

<h3 id="delete-api-clients-id-refs"><a href="#delete-api-clients-id-refs">DELETE /api/clients/:id</a></h3>

Borra el cliente con el id pasado por parametros. Sin el token, no se puede eliminar un cliente.
