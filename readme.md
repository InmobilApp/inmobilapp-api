https://github.com/InmobilApp
https://inmobil-app.herokuapp.com/

Post ruta: /api/properties
Unico dato requerido para hacer un post "name",
en la propiedad state: solo se permite ('available', 'unavailable', 'reserved') por defecto es 'available'.
```json
{
  "name": "Casa de familia",
  "ubication": "Calle 33B 1B12",
  "images": [
    "https://www.construyehogar.com/wp-content/uploads/2014/10/Decoraci%C3%B3n-de-interiores-de-departamento.jpg",
    "djasjdasi"
  ],
  "rentalPrice": 500000,
  "reviews": [{ "user": "Pedro", "content": "Muy mala", "score": 2 }],
  "description": "Casa en buen estado",
  "details": {
    "area": 120,
    "rooms": 4,
    "baths": 2,
    "garage": true
  },
  "ouner": "Matheo"
}
```

return:

```json
{
  "name": "Casa de familia",
  "ubication": "Calle 33B 1B12",
  "images": [
    "https://www.construyehogar.com/wp-content/uploads/2014/10/Decoraci%C3%B3n-de-interiores-de-departamento.jpg",
    "djasjdasi"
  ],
  "state": "available",
  "rentalPrice": 500000,
  "reviews": [
    {
      "user": "Pedro",
      "content": "Muy mala",
      "score": 2,
      "_id": "620b201f8dfb8640ef329e78",
      "date": "2022-02-15T03:38:07.353Z"
    }
  ],
  "description": "Casa en buen estado",
  "details": {
    "area": 120,
    "rooms": 4,
    "baths": 2,
    "garage": true
  },
  "ouner": "Matheo",
  "date": "2022-02-15T03:38:07.356Z",
  "id": "620b201f8dfb8640ef329e77"
}
```

get /api/properties/620b201f8dfb8640ef329e77

```json
{
  "details": {
    "area": 120,
    "rooms": 4,
    "baths": 2,
    "garage": true
  },
  "name": "Casa de familia",
  "ubication": "Calle 33B 1B12",
  "images": [
    "https://www.construyehogar.com/wp-content/uploads/2014/10/Decoraci%C3%B3n-de-interiores-de-departamento.jpg",
    "djasjdasi"
  ],
  "state": "available",
  "rentalPrice": 500000,
  "reviews": [
    {
      "user": "Pedro",
      "content": "Muy mala",
      "score": 2,
      "_id": "620b201f8dfb8640ef329e78",
      "date": "2022-02-15T03:38:07.353Z"
    }
  ],
  "description": "Casa en buen estado",
  "ouner": "Matheo",
  "date": "2022-02-15T03:38:07.356Z",
  "id": "620b201f8dfb8640ef329e77"
}
```

get: "/api/properties"
return: Array[property]
