use actix_web::{get, web, Responder};
use log::error;
use serde::Serialize;
use std::fs::File;
use std::io::Read;

#[derive(Serialize)]
struct ConfigFile<'a> {
    filename: &'a str,
    path: &'a str,
    content: &'a mut String,
    syntax: &'a str,
}

#[get("/printnanny/api/pi/configs")]
pub async fn get_config_data() -> impl Responder {
    const FILES: &mut [ConfigFile] = &mut [
        ConfigFile {
            filename: "PrintNannyConfig.toml",
            path: "unknown",
            content: &mut String::new(),
            syntax: "toml",
        },
        ConfigFile {
            filename: "config.yaml",
            path: "/home/printnanny/.octoprint/config.yaml",
            content: &mut String::new(),
            syntax: "yaml",
        },
    ];

    for file in FILES.iter_mut() {
        let result = File::open(file.path).map(|mut f| f.read_to_string(&mut file.content));
        if result.is_err() {
            error!("could not open {:?}: {:?}", file.path, result.err());
            file.content.clear();
            file.content.push_str("could not open ");
            file.content.push_str(file.path);
        }
    }

    web::Json(FILES)
}
