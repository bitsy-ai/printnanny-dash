use actix_web::{get, web, Responder};
use log::error;
use serde::Serialize;
use std::fs;
use std::process::Command;

#[derive(Serialize)]
struct VersionData {
    issue: String,
    os_release: String,
    printnanny_version: String,
}

#[get("/printnanny/api/pi/version")]
pub async fn get_version_data() -> impl Responder {
    let issue_content = fs::read_to_string("/etc/issue")
        .map(|data| data.trim().to_string())
        .unwrap_or_else(|err| {
            error!("could not open /etc/issue: {:?}", err);
            "could not load /etc/issue".to_string()
        });

    let os_release_content = fs::read_to_string("/etc/os-release")
        .map(|data| data.trim().to_string())
        .unwrap_or_else(|err| {
            error!("could not open /etc/os-release: {:?}", err);
            "could not load /etc/os-release".to_string()
        });

    let printnanny_version_output = Command::new("printnanny")
        .args(["--version"])
        .output()
        .map(|output| String::from_utf8(output.stdout))
        .unwrap_or_else(|err| {
            error!("could not invoke printnanny --version: {:?}", err);
            Ok("could not invoke printnanny --version".to_string())
        })
        .unwrap_or_else(|err| {
            error!(
                "bytes returned by printnanny --version were not UTF-8: {:?}",
                err
            );
            "could not decode printnanny version output as UTF-8".to_string()
        });

    web::Json(VersionData {
        issue: issue_content,
        os_release: os_release_content,
        printnanny_version: printnanny_version_output,
    })
}
