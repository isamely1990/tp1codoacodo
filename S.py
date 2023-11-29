#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify
from flask import request

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app)

#--------------------------------------------------------------------
class Catalogo_juegos:
    #----------------------------------------------------------------
    # Constructor de la clase
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS juegos_api (
            id int(11) NOT NULL,
            title varchar(45) DEFAULT NULL,
            thumbnail text DEFAULT NULL,
            short_description text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
            game_url varchar(255) DEFAULT NULL,
            genre varchar(100) DEFAULT NULL,
            platform varchar(60) DEFAULT NULL,
            publisher text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
            developer text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
            release_date date DEFAULT NULL)''')
        self.conn.commit()

        # self.cursor.execute('''CREATE TABLE IF NOT EXISTS editor (
        #     id_editor PRIMARY KEY int(11) NOT NULL,
        #     nombre_edi varchar(255) NOT NULL''')
        # self.conn.commit()

        # self.conn.execute('''CREATE TABLE IF NOT EXISTS desarrollador
        #     id_desarrollador INT(11) NOT NULL,
        #     nombre_des VARCHAR(255) NOT NULL''')
        # self.conn.commit()

        # self.cursor.execute('''CREATE TABLE IF NOT EXIST genero
        #     id_genero INT(11) NOT NULL,
        #     nombre_gen VARCHAR(100) NOT NULL''')
        # self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        
    #----------------------------------------------------------------
    def agregar_juego(self, id, title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date):
        # Verificamos si ya existe un producto con el mismo código
        self.cursor.execute(f"SELECT * FROM juegos_api WHERE id = {id}")
        producto_existe = self.cursor.fetchone()
        if producto_existe:
            return False

        sql = "INSERT INTO productos (id, title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (id, title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date)

        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return True

    #----------------------------------------------------------------
    def consultar_juego(self, id):
        # Consultamos un producto a partir de su código
        self.cursor.execute(f"SELECT * FROM juegos_api WHERE id = {id}")
        return self.cursor.fetchone()

    #----------------------------------------------------------------
    def modificar_juego(self, id, new_title, new_thumbnail, new_short_description, new_game_url, new_genre, new_platform, new_publisher, new_developer, new_release_date):
        sql = "UPDATE productos SET title=%s, thumbnail=%s, short_description=%s, game_url=%s, genre=%s, platform=%s, publisher=%s, developer=%s, release_date=%s"
        valores = (new_title, new_thumbnail, new_short_description, new_game_url, new_genre, new_platform, new_publisher, new_developer, new_release_date, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def listar_juego(self):
        self.cursor.execute("SELECT * FROM juegos_api")
        productos = self.cursor.fetchall()
        return productos

    #----------------------------------------------------------------
    def eliminar_juego(self, id):
        # Eliminamos un producto de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM juegos_api WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def mostrar_juego(self, id):
        # Mostramos los datos de un producto a partir de su código
        juego = self.consultar_juego(id)
        if juego:
            print("-" * 40)
            print(f"Código.....: {juego['id']}")
            print(f"Nombre: {juego['title']}")
            print(f"Fecha de lanzamiento...: {juego['release_date']}")
            print(f"Descripcion.....: {juego['short_description']}")
            print(f"Imagen..: {juego['thumbnail']}")
            print(f"URL..: {juego['game_url']}")
            print(f"Plataforma..: {juego['platform']}")
            print(f"Genero..: {juego['genre']}")
            print(f"Desarrollador..: {juego['developer']}")
            print(f"Distribuidora..: {juego['publisher']}")
            print("-" * 40)
        else:
            print("Juego no encontrado.")

# -------------------------------------------------------------------
#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Catalogo
catalogo = Catalogo_juegos(host='localhost', user='root', password='los1062', database='gameland')

# Carpeta para guardar las imagenes.
RUTA_DESTINO ="./assets/img/"

#--------------------------------------------------------------------
@app.route("/crud", methods=["GET"])
def listar_juego():
    productos = catalogo.listar_juego()
    return jsonify(productos)


#--------------------------------------------------------------------
@app.route("/crud/<int:id>", methods=["GET"])
def mostrar_juego(id):
    producto = catalogo.consultar_juego(id)
    if producto:
        return jsonify(producto), 201
    else:
        return "Juego no encontrado", 404


#--------------------------------------------------------------------
@app.route("/crud/<int:id>", methods=["POST"])
def agregar_juegos():
    #Recojo los datos del form
    id = request.form['id']
    title = request.form ['title']
    release_date = request.form ['release_date']
    short_description = request.form['short_description']
    thumbnail = request.form['thumbnail']
    game_url = request.form['game_url']
    platform = request.form ['platform']
    genre = request.form ['genre']
    developer = ['developer']
    publisher = request.form ['publisher']

    # Me aseguro que el producto exista
    producto = catalogo.consultar_producto(id)
    if not producto: # Si no existe el producto...
        # Genero el nombre de la imagen
        nombre_imagen = secure_filename(thumbnail.filename)
        nombre_base, extension = os.path.splitext(nombre_imagen)
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"

    if catalogo.agregar_juego(id, title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date):
        thumbnail.save(os.path.join(RUTA_DESTINO, nombre_imagen))
        return jsonify({"mensaje": "Producto agregado"}), 201
    else:
        return jsonify({"mensaje": "Producto ya existe"}), 400

#--------------------------------------------------------------------
@app.route("/crud/<int:id>", methods=["PUT"])
def modificar_juego(id):
    #Recojo los datos del form
    new_title = request.form.get('title')
    new_release_date = request.form.get('release_date')
    new_short_description = request.form.get('short_description')
    new_game_url = request.form.get('game_url')
    new_platform = request.form.get('platform')
    new_genre = request.form.get('genre')
    new_publisher = request.form.get('publisher')
    new_developer = request.form.get('developer')
    new_thumbnail = request.files['thumbnail']

    # Procesamiento de la imagen
    nombre_imagen = secure_filename(new_thumbnail.filename)
    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
    new_thumbnail.save(os.path.join(RUTA_DESTINO, nombre_imagen))

    # Busco el producto guardado
    producto = producto = Catalogo_juegos.consultar_juego(id)
    if producto: # Si existe el producto...
        imagen_vieja = producto["thumbnail"]
        # Armo la ruta a la imagen
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        # Y si existe la borro.
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)
    
    if catalogo.modificar_juego(id, new_title, new_thumbnail, new_short_description, new_game_url, new_genre, new_platform, new_publisher, new_developer, new_release_date):
        return jsonify({"mensaje": "Producto modificado"}), 200
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 403


#--------------------------------------------------------------------
@app.route("/crud/<int:id>", methods=["DELETE"])
def eliminar_juego(id):
    # Busco el producto guardado
    producto = producto = catalogo.consultar_juego(id)
    if producto: # Si existe el producto...
        imagen_vieja = producto["thumbnail"]
        # Armo la ruta a la imagen
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        # Y si existe la borro.
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

    # Luego, elimina el producto del catálogo
    if catalogo.eliminar_producto(id):
        return jsonify({"mensaje": "Producto eliminado"}), 200
    else:
        return jsonify({"mensaje": "Error al eliminar el producto"}), 500
    

#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
