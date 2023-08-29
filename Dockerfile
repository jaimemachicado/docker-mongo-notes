#Indicamos imagen base
FROM node:18

#Creamos carpeta para crear el contenedor
RUN mkdir -p /home/app

#Indicamos el código que debe utilizar para añadir al contenedor
COPY . /home/app

#Exponer un purto para conectarse al contenedor
EXPOSE 3000

#Comando que debe ejecutar para ejecutar la aplicación ["<comando>","<ruta_absuluta_del_main>"]
CMD [ "node", "/home/app/index.js" ]


