const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentoSchema = new Schema({
  id_documento: Number,
  id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  titulo: String,
  descripcion: String,
  categoria: [String],
  ruta_archivo: String,
  fecha_creacion: Date,
  estado: String,
  comentario_admin: String,
  comentario_editor: String,
  editado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  fecha_edicion: Date,
  aprobado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  fecha_aprobacion: Date,
  historial_ediciones: [Schema.Types.Mixed],
  versiones: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Documento', DocumentoSchema);
