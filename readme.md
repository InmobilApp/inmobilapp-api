# Pages

GitHub: https://github.com/InmobilApp

Deploy: https://inmobil-app.herokuapp.com/

# Indice

<ul>
  <li><a href="#property-schema-refs">Property Schema</a></li>
</ul>

# Schemas

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
  ubication: {
    city: { type: String, required: true },
    neighbourhooh: { type: String, required: true },
    adress: { type: String, required: true },
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

## Rutas "/api/properties"

### GET "/api/properties"

Retorna un arreglo con todas las propiedades guardadas en la base de datos.

### POST "/api/properties"

Por medio de "body" recibe un objeto con las propiedades requeridas para crear una propiedad, algunas propiedades se inicializan por defecto como la fecha, y el estado de la propiedad, por defecto es "available" y para crear la propiedad tambien nesecita un Agente el cual es el responsable de esa propiedad, para ello solo nesecitan pasar el id del agente.

```javascript
{
  typeProperty: "casa",
  ubication: {
    city: "Bogota",
    neighbourhooh: "usme",
    adress: "Cll 22B etc...",
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
    "typeProperty": "casa",
    "ubication": {
        "city": "Bogota",
        "neighbourhooh": "usme",
        "adress": "Cll 22B etc..."
    },
    "images": [
        "url",
        "url1"
    ],
    "state": "available",
    "rentalPrice": "500",
    "description": "Decripcion del inmueble",
    "details": {
        "area": "30",
        "rooms": "2",
        "baths": "2",
        "garage": true
    },
    "date": "2022-02-16T02:40:10.671Z",
    "reviews": [],
    "id": "620c640ab2c22c087c7d326d"
}
```

### GET "/api/properties/620c640ab2c22c087c7d326d"

Al hacer un get con "id" a "/api/properties/:id" retorna la propiedad que coincida con ese ID.

```json
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
  "date": "2022-02-16T02:40:10.671Z",
  "reviews": [],
  "id": "620c640ab2c22c087c7d326d"
}
```

### DELETE "/api/properties/620c640ab2c22c087c7d326d"

Borra la propiedad con el id pasado por parametro de la base de datos.
