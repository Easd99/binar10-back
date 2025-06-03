# binar10

Proyecto backend desarrollado con NestJS

Este proyecto incluye integración con bases de datos **PostgreSQL** y **MongoDB**, una **Cloud Function** para registrar los puntos obtenidos de las compras y un API GraphQL.

Por cada compra realizada, se registran los puntos obtenidos en una base de datos **PostgreSQL** y se envían a una **Cloud Function** que los registra en **BigQuery**.

Los puntos obtenidos se pueden canjear por **rewards** (recompensas).

Se da 1 punto por cada 1.000 gastados en compras ( amount / 1000 ).

---

## ☁️ Cloud Function: register-purchase

El proyecto incluye una **Cloud Function** ubicada en:

```
cloud-functions/register-purchase
```

### ¿Qué hace?

- Es una función HTTP que recibe un payload:

```json
{
  "userId": "1",
  "points": 100
}
```

- Inserta estos datos en BigQuery.
- Retorna una respuesta HTTP `200 OK`.

### ¿Cómo se despliega?

Debes desplegarla usando el CLI de Google Cloud (`gcloud`):

```bash
cd cloud-functions/register-purchase
gcloud functions deploy registerPurchase \
  --runtime=nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region=us-central1
```

### ¿Cómo se usa?

Una vez desplegada, Google Cloud te dará una URL pública, por ejemplo:

```
https://us-central1-your-project-id.cloudfunctions.net/registerPurchase
```

### Variable de entorno:

Esta URL debes colocarla en tu `.env`:

```
GCP_URI=https://us-central1-your-project-id.cloudfunctions.net/registerPurchase
```

El backend usará esta URL para invocar la función.

---

## 🗄️ Explicación de MONGO_URI

La variable de entorno `MONGO_URI` tiene la siguiente estructura:

```
MONGO_URI=mongodb://<usuario>:<password>@<host>:<puerto>/<nombre_db>?authSource=admin
```

### Ejemplo concreto en este proyecto:

```
MONGO_URI=mongodb://root:12345@localhost:27017/binar10_db?authSource=admin
```

### Significado:

- `root`: usuario de MongoDB
- `12345`: contraseña del usuario
- `localhost`: dirección del servidor de MongoDB
- `27017`: puerto de MongoDB (por defecto)
- `binar10_db`: nombre de la base de datos que usará la app
- `authSource=admin`: indica que las credenciales se validan contra la base `admin`

Si ejecutas Mongo en Docker (como en este proyecto), esta conexión funcionará directamente:

```bash
docker-compose up mongo_db
```

---

## 🕸️ Uso de la API GraphQL

El proyecto expone un endpoint **GraphQL** en la siguiente ruta:

```
/graphql
```

### Ejemplo de URL local:

```
http://localhost:5000/graphql
```

### ¿Cómo funciona?

- Las peticiones GraphQL se hacen mediante el método `POST`.
- El cuerpo de la petición debe incluir la propiedad `query` en formato JSON.

Ejemplo de cuerpo (body → raw → JSON):

```json
{
  "query": "query { getUsers { id name email } }"
}
```

Opcionalmente, si la query acepta variables:

```json
{
  "query": "query($id: ID!) { getUser(id: $id) { id name email } }",
  "variables": { "id": "123" }
}
```

### Esquema GraphQL

Todos los **schemas** generados por el proyecto se encuentran en:

```
schema.gql
```

Este archivo contiene todo el esquema de tipos, queries, mutations y sus relaciones.
Al iniciar el servidor, este archivo se genera automáticamente y refleja la estructura actual de la API GraphQL, Postman o Insomnia pueden usar este esquema para autocompletar y validar las peticiones.

---

## 🗄️ Base de datos PostgreSQL - Scripts de inicialización

El proyecto incluye un script de inicialización para PostgreSQL ubicado en:

```
db/init/init.sql
```

### ¿Qué hace este script?

- Crea las **tablas necesarias** para el funcionamiento del proyecto.
- Inserta algunos **datos de ejemplo** en las tablas, por ejemplo:

- Rewards precargadas
- Usuario de ejemplo

### ¿Cómo se ejecuta?

Si usas el `docker-compose.yml` del proyecto:

```bash
docker-compose up postgres_db
```

Docker ejecutará automáticamente el script `init.sql` en el contenedor de PostgreSQL, ya que la carpeta `./db/init` está montada en:

```yaml
volumes:
  - ./db/init:/docker-entrypoint-initdb.d
```

Por lo tanto, al levantar `postgres_db` por primera vez, el script se ejecutará y tendrás las tablas y los datos de ejemplo ya listos.


---

## 🚀 Tecnologías

- NestJS
- PostgreSQL
- MongoDB
- Docker
- Docker Compose
- Google Cloud Functions
- GraphQL

---

## ⚙️ Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Easd99/binar10-back
cd binar10
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

---

## 🏃 Ejecución

### 🔹 Ejecución local

1️⃣ Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=
NODE_ENV=
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
MONGO_URI=
GCP_URI=
```

2️⃣ Iniciar bases de datos (solo PostgreSQL y MongoDB):

```bash
docker-compose up postgres_db mongo_db
```

3️⃣ En otro terminal, iniciar NestJS en modo desarrollo:

```bash
npm run start:dev
```

La API estará disponible en: [http://localhost:5000/graphql](http://localhost:5000/graphql)

---

### 🔹 Ejecución completa con Docker Compose

Puedes levantar toda la aplicación (backend + bases de datos) con:

```bash
docker-compose up --build
```

Esto levantará:

- `binar10_back` en el puerto `5000`
- `PostgreSQL` en el puerto `4561`
- `MongoDB` en el puerto `27017`

La API estará disponible en: [http://localhost:5000/graphql](http://localhost:5000/graphql)

---

## 🧪 Scripts útiles

```bash
# Correr la aplicación
npm run start

# Correr en modo desarrollo (hot reload)
npm run start:dev

```

---

## 📝 Ejemplos de Mutations en GraphQL

A continuación se muestran ejemplos de cómo invocar las Mutations principales del proyecto.

Todas las Mutations se envían al endpoint:

```
POST http://localhost:5000/graphql
```

El cuerpo de la petición debe ser JSON con el campo `query`.

---

### 🔹 Mutation: CreateReward

```graphql
mutation CreateReward {
    createReward(createRewardInput: {
        name: "Nuevo Reward",
        pointsCost: 100
    }) {
        id
        name
        pointsCost
        createdAt
        updatedAt
        deletedAt
    }
}
```

---

### 🔹 Mutation: CreateUser

```graphql
mutation CreateUser {
    createUser(createUserInput: {
        name: "Nuevo Usuario"
    }) {
        id
        name
        createdAt
        updatedAt
        deletedAt
    }
}
```

---

### 🔹 Mutation: RegisterPurchase

```graphql
mutation RegisterPurchase {
    registerPurchase(createPurchaseInput: {
        userId: 1,
        amount: 50.75,
        date: "2024-06-01T10:00:00Z"
    }) {
        id
        amount
        date
        createdAt
        updatedAt
        deletedAt
        
    }
}
```

---

### 🔹 Mutation: RedeemPoints

```graphql
mutation RedeemPoints {
    redeemPoints(userId: 1, rewardId: 1) {
        id
        type
        points
        date
        createdAt
        updatedAt
        deletedAt
    }
}
```

---

## 🔎 Ejemplos de Queries en GraphQL

---

### 🔹 Query: GetUserPoints

```graphql
query GetUserPoints {
    getUserPoints(id: 1)
}
```

Este query devuelve la cantidad total de **puntos actuales** del usuario con `id = 1`.

---

### 🔹 Query: GetUserHistory

```graphql
query GetUserHistory {
    getUserHistory(userId: 1) {
        id
        type
        points
        date
        createdAt
        updatedAt
        deletedAt
    }
}
```

Este query devuelve el **historial de transacciones** (earn / redeem) del usuario con `id = 1`.

---

### ⚠️ Notas:

- Los `id` y `userId` deben ser válidos (correspondientes a usuarios existentes en la base de datos).
- Si usas `null` no devolverá resultados válidos (los parámetros son requeridos).

---

## 🔗 Recomendaciones para pruebas

Puedes usar:

- Postman
- GraphQL Playground
- Insomnia

---


## 📝 Notas

- Puedes modificar las variables de entorno en `.env` o en `docker.env`.
- Al usar Docker, las bases de datos se crean automáticamente con los usuarios y contraseñas definidos en el docker-compose.
- El script `init.sql` carga las tablas y datos de ejemplo automáticamente.
- La Cloud Function se despliega aparte en Google Cloud.

---
