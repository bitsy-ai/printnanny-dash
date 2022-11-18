use actix_web::{get, web, Responder};
use log::error;
use serde::Serialize;
use std::fs;

#[derive(Serialize)]
struct ConfigFile {
    filename: String,
    path: String,
    content: String,
    syntax: String,
}

#[get("/printnanny/api/pi/configs")]
pub async fn get_config_data() -> impl Responder {
    const FILES: &[(&'static str, &'static str, &'static str)] = &[
        ("PrintNannyConfig.toml", "missing", "toml"),
        (
            "octoprint config",
            "/home/printnanny/.octoprint/config.yaml",
            "yaml",
        ),
    ];

    let mut files: Vec<ConfigFile> = Vec::new();

    for file in FILES {
        files.push(ConfigFile {
            filename: file.0.to_string(),
            path: file.1.to_string(),
            syntax: file.2.to_string(),
            content: fs::read_to_string(file.1).unwrap_or_else(|err| {
                error!("could not read file {:?}: {:?}", file.1, err);
                let mut placeholder = String::from("could not read file ");
                placeholder.push_str(file.1);
                placeholder
            }),
        });
    }
    web::Json(files)
}
