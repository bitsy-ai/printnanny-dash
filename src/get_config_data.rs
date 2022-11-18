use actix_web::{get, web, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct ConfigFile {
    filename: String,
    path: String,
    content: String,
    syntax: String,
}

const files: &[ConfigFile] = &[ConfigFile {
    filename: "PrintNannyConfig.toml".to_string(),
    path: "unknown".to_string(),
    content: String::new(),
    syntax: "toml".to_string(),
}];

#[get("/printnanny/api/pi/configs")]
pub async fn get_config_data() -> impl Responder {
    web::Json(files)
}
