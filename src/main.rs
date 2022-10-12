use actix_web::{App, HttpServer};
use actix_web_static_files::ResourceFiles;
use anyhow::Result;

use printnanny_dash::config;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

#[actix_web::main]
async fn main() -> Result<()> {
    let config = config::PrintNannyDashConfig::new()?;
    HttpServer::new(move || {
        let generated = generate();
        App::new().service(ResourceFiles::new("/", generated))
    })
    .bind(config.server_addreess())?
    .run()
    .await?;
    Ok(())
}
