# Zoo App
## Ejecución
Se debe tener instalado:
* NodeJS
* Mongoose (https://mongoosejs.com/docs/index.html)
* Docker desktop
* VScode o cualquier IDE/editor de preferencia
* MongoSH (https://www.mongodb.com/docs/mongodb-shell/),para poder realizar consultas con mongo directamente

Una vez se descargue mediante un clone del repositorio se debe levantar con docker compose:

```console
docker compose -f docker-compose-dev.yml up --build
```

Esto generará todo lo necesario para poder realizar las siguientes llamadas en la aplicación:

| Método | URL                                              | Descripción                                        |
| ------ | ------------------------------------------------ | ------------------------------------------------- |
| GET    | http://localhost:3000/animals                   | Esta llamada listaría todos los animales registrados en el zoo |
| POST   | http://localhost:3000/animal?species=Lion&averageWeight=150-250kg&color=Yellow-Brown | Esto registraría un nuevo animal León en el zoo con los datos que le pasamos como query params |


> **Nota:** Se incluye en la carpeta "postman", la colección y las variables que se pueden importar en postman y que tiene ya especificado el endpoint para listar los animales y crear una serie de animales.

>Cadena de conexión con mongosh:
>* mongodb://jaime:password@127.0.0.1:27017/zoo?authSource=admin

> Se ejecuta el fichero index.js con nodemon

# Docker notes

## Comandos: 

* docker pull \<image>:\<tag> // Nos trae una imagen con el nombre especificado y el tag especificado
* docker pull –platform linux/x86_64 \<image>:\<tag>  -> Se debe usar esto en mac por si da error de "no matching manifest for linux/arm64/v8 in the manifest list entries" 
* docker images 
* docker image rm <nombre_imagen> 

## Crear contenedor 

* docker pull <nombre_imagen>    // Nos trae la imagen con el nombre especificado
    * Ejemplo:
        * docker pull mongo     // Nos trae la imagen de mongo
* docker create <nombre_imagen> // Crea un contenedor, con el nombre autogenerado por docker, con la imagen que le indiquemos y recupera el id de contenedor 
* docker container create mongo // Es equivalente al comando anterior
* docker [container] create --name <nombreQueLeQueramosAsignar> <nombre_Imagen> //"Container" es opcional, como se indica en los anteriores comandos es equivalente. Este comando crea un contenedor con un nombre específico que le queramos asignar a partir de una imagen indicada
* docker start <id_contenedor> // Inicia el contenedor con el id indicado
* docker ps // Lista los contenedores que están corriendo e información adicional 
* docker ps -a // Con la opción -a lista todos los contenedores iniciados o parados
* docker stop <id_contendor> // Para el contenedor con el id indicado
* docker rm <nombre_contenedor> // elimina un contenedor a partir de su nombre 
 
## Crear un contenedor con un puerto activo  

* docker create –p<puertoEntrada>:<puertoDocker> --name <nombre_contenedor> <nombre_imagen>  // Crea un mapeo de puertos entre un puerto de entrada y un puerto interno de docker
    * EJEMPLO 
        * indicando puerto -->  docker create -p27017:27017 –name monguito mongo 
        * Sin indicar puerto -->  docker create -p:27017 -name monguito mongo 

## Logs 
* docker logs <nombre_contenedor> // Logs actuales sin mostrar los que se sigan generando 
* docker logs --follow <nombre_contenedor> // Muestra un prompt con los logs y continua mostrando los logs que se van generando hasta que cortemos la ejecución

 

## Comando RUN 

Hace 3 cosas a la vez: 
1. Si no encuentra la imagen la descarga 
2. Crea un contenedor 
3. Inicia el contenedor 

Usos del comando run:
* docker run <nombre_imagen> // Ejecuta lo comentado  y nos va mostrando el progreso 
* docker run -d <nombre_imagen> // Ejecuta y nos devuelve el id del contenedor  (modo detached) sin dejar el promt bloqueado
* docker run –name <nombre_contenedor> -p<puerto_acceso>:<puerto_contenedor> -d <nombre_imagen>  // Se ejecuta de forma similar a los anteriores comandos y, además, asigna un nombre y un mapeo de puerto
    * Ejemplo:
        * docker run --name monguito –p27017:27017 -d mongo 

## Ejemplo de aplicación que se conecta a una instancia en docker de mongo 

* docker pull mongo 
* docker create -p27017:27017 --name monguito -e MONGO_INITDB_ROOT_USERNAME=nico -e MONGO_INITDB_ROOT_PASSWORD=password mongo  

Este ejemplo incluye dos variables de entorno que se deben añadir según lo que se indican en la documentación de la imagen mongo que estamos utilizando (https://hub.docker.com/_/mongo -> Environment Variables) 


## Crear Redes dentro de docker 

* docker network ls // Lista las redes existentes 
* docker network create <nombre_red> // Crea la red con el nombre 
    * Ejemplo:
        * docker network create mired
* docker network rm <nombre_red> // Elimina la red con el nombre indicado 


## Construir una imagen creada con un Dockerfile 

* docker build –t <nombre_de_la_imagen>:\<tag> <ruta_donde_se_encuentra_mi_dockerfile> // Crea una imagen con el nombre y etiqueta especificados a partir del dockerfile que se encuentra en la ruta especificada
    * Ejemplo con la ruta actual, es decir cuando nos encontramos en la misma carpeta que nuestro Dockerfile:
        * docker build -t miapp:1 . 

 
## Creamos un contenedor incluyendo la subred creada anteriormente "mired" 

* docker create -p27017:27017 --name monguito --network mired -e MONGO_INITDB_ROOT_USERNAME=nico -e MONGO_INITDB_ROOT_PASSWORD=password mongo 
 

## Crear contenedor de la aplicación que acabamos de crear en una imagen (miapp:1): 

docker create -p3000:3000 --name animalito --network mired miapp:1 


Ahora arrancamos nuestros contenedores 

## Para cada contenedor se hace en general
  
1. Descargar imagen 
2. Crear red 
3. Crear contenedor 
4. Asignar puertos 
5. Asignar nombre 
6. Asignar variables de entorno 
7. Especificar red 
8. Indicar imagen:etiqueta 

Todo esto se puede hacer utilizando DOCKER-COMPOSE 

## Docker compose
* docker compose up
 

## Volumes

Tipos de volúmenes: 
1. Anonimo: solo indicas la ruta y docker se encarga del resto 
2. De anfitrión o host: tu indicas qué carpeta montar y dónde 
3. Nombrado: equivalente al anónimo, pero asignando un nombre al que se puede referenciar desde otros contenedores 


Indicar un fichero de configuración de docker que no se llama docker-compose.yml. Si se quiere utilizar otro nombre de fichero que no sea el por defecto (docker-compose.yml) se puede utilizar la opción -f, de forma que, por ejemplo, tengamos ficheros para diferentes entornos preproductivos como:
* Desarrollo: docker-compose-dev.yml
* Preproducción: docker-compose-pre.yml
* Producción: docker-compose.yml

De forma que se pueda utilizar el comando de esta forma:
* docker compose -f docker-compose-dev.yml up --build

La opción --build ejecuta una construcción en docker


# Mongo notes
## Crear y administrar bases de datos y colecciones
* use <nombre_base_datos> //Si no existe crea la base de datos con el nombre indicado
* db.<nombre_coleccion>.insertOne({campo1:"dato1",campo2:"dato2"}) //Si no existe la colección se crea con el nombre indicado y realiza un insert de los datos especificados
* show dbs // Muestra las bases de datos exitentes
* show collections // Muestra las colecciones en la base de datos actual
* db.dropDatabase() // Elimina la base de datos actual
* db.<nombre_coleccion>.drop() // Elimina la colección con el nombre indicado

## Insertar documento
* db.<nombre_coleccion>.insertOne({<campo_1>:<valor_1>,<campo_n>:<valor_n>})
* db.<nombre_coleccion>.insertMany({<campo_1>:<valor_1>,<campo_n>:<valor_n>},{<campo_1>:<valor_1>,<campo_n>:<valor_n>})

## Actualizar documento
* db.<nombre_coleccion>.updateOne({<campo_x>:<valor_x>},{<operador_x>: {<campo_x>:<valor_x>}})
    * Ejemplo que actualiza el primer documento que coincida con el filtro:
        * db.mycollection.updateOne({name:"Jane"},{$set: {age:29}})
* db.<nombre_coleccion>.upateMany({<campo_x>:{<operador_x>:<valor_x>}})
    * Ejemplo que actualiza todos los documentos que coincidan con el filtro:
        * db.mycollection.updateMany({age:{$gt:30},{$inc: {age:1}}})
* db.<nombre_coleccion>.replaceOne({<campo_x>:<valor_x>,{<campo_1>:<valor_1>,<campo_n>:<valor_n>}})
    * Ejemplo que reemplaza el primer documento que coincida con el filtro
        * db.mycollection.updateMany({age:{$gt:30},{$inc: {age:1}}})

## Eliminar documentos
* db.<nombre_coleccion>.deleteOne({<campo_x>: <valor_x>})
    * Ejemplo que elimina el primer documento que coincida con el filtro:
        * db.animals.deleteOne({species:"Tiger"})
* db.<nombre_coleccion>.deleteMany({<campo_x>:<valor_x>})
    * Ejemplo que elimina todos los documentos que coincidan con el filtro
        * db.animals.deleteMany({averageWeight:{$eq:'6kg'}})

## Consulta
* db.<nombre_coleccion>.find({<clave_x>:<valor_x>})

>**Operadores de consulta:**
>* $eq -> igual a
>* $ne -> no igual a
>* $gt -> mayor que
>* $gte -> mayor o igual que
>* $lt -> menor que
>* $lte -> menor o igual que
>* $in -> en un conjunto de valores
>* $nin -> no esta en un conjunto de valores
>
> Ejemplo:
> * db.animals.find({species:{$eq:'Giraffe'}})

>**Operadores lógicos:**
>* $and
>* $or -> o lógico
>* $not
>* $nor -> ni lógico
>
> Ejemplo:
> * db.animals.find({$or: [{species:'Panda'},{species:'Giraffe'}]})

>**Operadores de elementos:**
>* $exists -> verifica si un campo existe o no en un documento
>* $type -> verifica si un campo tiene un tipo de datos específico
>
>Ejemplo:
>* db.animals.find({species:{$exists:true}})

>**Operadores de arrays:**
>* $all -> coincide con documentos donde un campo contiene todos los elementos del array
>* $size -> coincide con documentos donde un campo de array tiene un tamaño específico
>* $elementMatch -> coincide con documentos donde un campo de array contiene al menos un elemento que cumple con todas las condiciones especificadas
>
>Ejemplo que encuentra documentos que tengan un array del campo "studies" con tamaño 2:
>db.myCollection.find({studies:{$size:2}})

>**Operadores de evaluación:**
>* $mod -> coincide con documentos donde un campo dividido por un divisor tiene un residuo específico
>* $regex -> coincide con documentos donde un campo coincide con una expresión regular
>* $text -> realiza una búsqueda de texto en los campos indexados por texto
>
>Ejemplo para encontrar documentos que contengan en el campo "species" una "P"
>* db.animals.find({species:{$regex:/P/i}})

>**Operadores geoespaciales:**
>* $geoWithin -> coincide con documentos donde un campo de geometría está completamente dentro de una geometría especificada
>* $geoIntersects -> coincide con documentos donde un campo de geometría se cruza con una geometría especificada
>* $near -> coincide con documentos donde un campo de geometría está cerca de un punto especificado, requiere un índice geoespacial para poder utiliarlo
>* $nearSphere -> similar a $near, pero considera la geometría esférica

>**Proyecciones:**
>Las proyecciones permiten especificar qué campos deben incluirse o excluirse en los resultados de una consulta. Para incluir un campo, establece su valor en 1 y para excluirlo en 0.
>* Ejemplo en el que cabe destacar que solo el campo _id es el único que deja excluir específicamente y que, si no lo excluyes, se devolverá igualmente en cualquier consulta:
>   *  db.animals.find({},{species:1,color:1,_id:0})


>**Ordenar:**
>* sort() -> Ordena los resultados de acuerdo con el valor 1 para ascendente o -1 para descendente
>   * Ejemplo: db.animals.find().sort({species:-1})
>* limit(<numero_resultados>) -> Limita el número de resultados
>   * Ejemplo: db.animals.find().limit(2)
>* skip(<numero_saltos>) -> Omite una cantidad específica de resultados
>   * Ejemplo: db.animals.find().skip(2)
>
> OJO: no importa el orden en el que se pongan sort, limit y skip, siempre se ejecutará primero el sort, después skip y, por último, limit si se ejecutan de forma combinada.

>**Indexación:**

>**Agregación:**

>**Transacciones:**

