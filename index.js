const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { writeFile, readFile } = require("node:fs/promises");
const app = express();

// app.use(bodyParser.json());
app.use(express.json());

//Midware use static

app.use(express.static("public"));

// Función para obtener las canciones

const getCanciones = async () => {
  const fsResponse = await readFile("./canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);
  return canciones;
};

app.get("/canciones", async (req, res) => {
  const canciones = await getCanciones();
  res.json(canciones);
});

app.get("/canciones/:id", async (req, res) => {
  const id = req.params.id;
  const canciones = await getCanciones();
  const cancion = canciones.find((cancion) => cancion.id === id);

  if (!cancion) {
    res.status(404).json({ message: "Canción not found." });
  }
  res.json(cancion);
});

// Para agregar al repertorio.

app.post("/canciones", async (req, res) => {
  const nuevaCancion = req.body;
  console.log("Back:" + nuevaCancion);
  let canciones = await getCanciones();
  canciones.push(nuevaCancion);
  await writeFile("canciones.json", JSON.stringify(canciones));
  res.status(201).json(nuevaCancion);
});

//Para editar una canción. FALTA

app.put("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  try {
    let canciones = await getCanciones();
    const index = canciones.findIndex((c) => c.id == id);
    if (index === -1) {
      res.status(404).json({ message: "Canción not found." });
      return;
    }
    canciones[index] = cancion;
    await writeFile("./canciones.json", JSON.stringify(canciones));
    res.json(canciones);
  } catch (error) {
    console.error("Error al editar la canción:", error);
    res.status(500).json({ message: "Error al editar la canción." });
  }
});

//Para eliminar una canción.

app.delete("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let canciones = await getCanciones();
    const index = canciones.findIndex((c) => c.id == id);
    if (index === -1) {
      res.status(404).json({ message: "Canción not found." });
      return;
    }
    canciones.splice(index, 1);
    await writeFile("./canciones.json", JSON.stringify(canciones));
    res.json(canciones);
  } catch (error) {
    console.error("Error al eliminar la canción:", error);
    res.status(500).json({ message: "Error al eliminar la canción." });
  }
});

//Midware Listen

app.listen(4000, console.log("Servidor arriba"));
