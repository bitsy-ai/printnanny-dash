use anyhow::Result;
use figment::providers::{Env, Format, Serialized, Toml};
use figment::value::{Dict, Map};
use figment::{Figment, Metadata, Profile, Provider};
use log::error;
use serde::{Deserialize, Serialize};

pub const DEFAULT_PRINTNANNY_DASH_CONFIG_PATH: &str = "/etc/printnanny/printnanny-dash.toml";

#[derive(Debug, Clone, Eq, PartialEq, Deserialize, Serialize)]
pub struct PrintNannyDashConfig {
    pub host: String,
    pub port: u16,
    pub workers: usize,
}

impl Default for PrintNannyDashConfig {
    fn default() -> Self {
        let host = "127.0.0.1".into();
        let port = 8585;
        let workers = 2;
        PrintNannyDashConfig {
            host,
            port,
            workers,
        }
    }
}

impl PrintNannyDashConfig {
    // See example: https://docs.rs/figment/latest/figment/index.html#extracting-and-profiles
    // Note the `nested` option on both `file` providers. This makes each
    // top-level dictionary act as a profile
    pub fn new() -> Result<Self> {
        let figment = Self::figment()?;
        let result = figment.extract()?;
        Ok(result)
    }

    pub fn figment() -> Result<Figment> {
        let result = Figment::from(Self { ..Self::default() });
        let toml_provider = Toml::file(Env::var_or(
            "PRINTNANNY_DASH_CONFIG",
            DEFAULT_PRINTNANNY_DASH_CONFIG_PATH,
        ));

        let result = result
            .merge(toml_provider)
            .merge(Env::prefixed("PRINTNANNY_DASH").split("__"));
        Ok(result)
    }

    /// Extract a `Config` from `provider`, panicking if extraction fails.
    ///
    /// # Panics
    ///
    /// If extraction fails, prints an error message indicating the failure and
    /// panics. For a version that doesn't panic, use [`Config::try_from()`].
    ///
    /// # Example
    pub fn from<T: Provider>(provider: T) -> Self {
        Self::try_from(provider).unwrap_or_else(|e| {
            error!("{:?}", e);
            panic!("aborting due to configuration error(s)")
        })
    }

    /// Attempts to extract a `Config` from `provider`, returning the result.
    ///
    /// # Example
    pub fn try_from<T: Provider>(provider: T) -> figment::error::Result<Self> {
        let figment = Figment::from(provider);
        let config = figment.extract::<Self>()?;
        Ok(config)
    }
}

impl Provider for PrintNannyDashConfig {
    fn metadata(&self) -> Metadata {
        Metadata::named("PrintNannyDashConfig")
    }

    fn data(&self) -> figment::error::Result<Map<Profile, Dict>> {
        let map: Map<Profile, Dict> = Serialized::defaults(self).data()?;
        Ok(map)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_file_not_found() {
        figment::Jail::expect_with(|jail| {
            jail.set_env(
                "PRINTNANNY_DASH_CONFIG",
                DEFAULT_PRINTNANNY_DASH_CONFIG_PATH,
            );
            let result = PrintNannyDashConfig::figment();
            assert!(result.is_ok());
            Ok(())
        });
    }
}
