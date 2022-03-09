function Capture(success, data) {
  return `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Inmobil App</title>
        <style>
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>${success} ${data && data.id}</h1>
          <button>
            <a href="https://inmobilapp.vercel.app">Volver a Inmobil App</a>
          </button>
        </div>
      </body>
    </html>`;
}

module.exports = Capture;
