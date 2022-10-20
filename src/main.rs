use actix_web::{App, HttpServer};
use actix_web_static_files::ResourceFiles;
use anyhow::Result;
use git_version::git_version;
use log::warn;

use printnanny_dash::config;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));
const GIT_VERSION: &str = git_version!();

#[actix_web::main]
async fn main() -> Result<()> {
    env_logger::init();

    let config = config::PrintNannyDashConfig::new()?;
    warn!("Starting server on {}:{}", &config.host, &config.port);
    warn!("Version: {}", GIT_VERSION);
    HttpServer::new(move || {
        let generated = generate();
        App::new().service(ResourceFiles::new("/*", generated).resolve_not_found_to_root())
    })
    .workers(config.workers)
    .bind((config.host, config.port))?
    .run()
    .await?;
    Ok(())
}
