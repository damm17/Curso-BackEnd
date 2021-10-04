export const errorHandler = (err, req, res, next) => {
	if (!err) return res.status(409).json({ message: "conflict" });

	return res.status(500).json({
		error: -1,
		descripcion: `No posee permisos para relizar un ${err.method} en la ruta ${err.route}.`,
	});
};
