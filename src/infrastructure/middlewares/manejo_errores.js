import debug from "debug";

const aviso = debug("app:error");

const error_404 = (req, res, next) => {
    aviso("404 - No Encontrado");
    return res.status(404).render("error_404");
}

const error_500 = (err, req, res, next) => {
    aviso(err.stack);
    return res.status(500).render("error_500");
}

export default {
    error_404,
    error_500
}
