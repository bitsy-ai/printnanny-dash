# Auto-Generated by cargo-bitbake 0.3.16
#
inherit cargo

# If this is git based prefer versioned ones if they exist
# DEFAULT_PREFERENCE = "-1"

# how to get printnanny-dash could be as easy as but default to a git checkout:
# SRC_URI += "crate://crates.io/printnanny-dash/0.1.0"
SRC_URI += "git://git@github.com/bitsy-ai/printnanny-dash.git;protocol=ssh;nobranch=1;branch=bitbake-recipe"
SRCREV = "d926e3df4271755802c83efb8a24d4f31f4c81ca"
S = "${WORKDIR}/git"
CARGO_SRC_DIR = ""
PV:append = ".AUTOINC+d926e3df42"

# please note if you have entries that do not begin with crate://
# you must change them to how that package can be fetched
SRC_URI += " \
    crate://crates.io/actix-codec/0.5.0 \
    crate://crates.io/actix-http/3.2.2 \
    crate://crates.io/actix-macros/0.2.3 \
    crate://crates.io/actix-router/0.5.1 \
    crate://crates.io/actix-rt/2.7.0 \
    crate://crates.io/actix-server/2.1.1 \
    crate://crates.io/actix-service/2.0.2 \
    crate://crates.io/actix-utils/3.0.0 \
    crate://crates.io/actix-web-codegen/4.1.0 \
    crate://crates.io/actix-web-static-files/4.0.0 \
    crate://crates.io/actix-web/4.2.1 \
    crate://crates.io/actix/0.13.0 \
    crate://crates.io/actix_derive/0.6.0 \
    crate://crates.io/adler/1.0.2 \
    crate://crates.io/ahash/0.7.6 \
    crate://crates.io/aho-corasick/0.7.19 \
    crate://crates.io/alloc-no-stdlib/2.0.4 \
    crate://crates.io/alloc-stdlib/0.2.2 \
    crate://crates.io/atty/0.2.14 \
    crate://crates.io/autocfg/1.1.0 \
    crate://crates.io/base64/0.13.0 \
    crate://crates.io/bitflags/1.3.2 \
    crate://crates.io/block-buffer/0.10.3 \
    crate://crates.io/brotli-decompressor/2.3.2 \
    crate://crates.io/brotli/3.3.4 \
    crate://crates.io/bytes/1.2.1 \
    crate://crates.io/bytestring/1.1.0 \
    crate://crates.io/cc/1.0.73 \
    crate://crates.io/cfg-if/1.0.0 \
    crate://crates.io/change-detection/1.2.0 \
    crate://crates.io/convert_case/0.4.0 \
    crate://crates.io/cookie/0.16.1 \
    crate://crates.io/cpufeatures/0.2.5 \
    crate://crates.io/crc32fast/1.3.2 \
    crate://crates.io/crossbeam-channel/0.5.6 \
    crate://crates.io/crossbeam-utils/0.8.12 \
    crate://crates.io/crypto-common/0.1.6 \
    crate://crates.io/derive_more/0.99.17 \
    crate://crates.io/digest/0.10.5 \
    crate://crates.io/encoding_rs/0.8.31 \
    crate://crates.io/env_logger/0.9.1 \
    crate://crates.io/flate2/1.0.24 \
    crate://crates.io/fnv/1.0.7 \
    crate://crates.io/form_urlencoded/1.1.0 \
    crate://crates.io/futures-core/0.3.24 \
    crate://crates.io/futures-sink/0.3.24 \
    crate://crates.io/futures-task/0.3.24 \
    crate://crates.io/futures-util/0.3.24 \
    crate://crates.io/generic-array/0.14.6 \
    crate://crates.io/getrandom/0.2.7 \
    crate://crates.io/glob/0.3.0 \
    crate://crates.io/h2/0.3.14 \
    crate://crates.io/hashbrown/0.12.3 \
    crate://crates.io/hermit-abi/0.1.19 \
    crate://crates.io/http/0.2.8 \
    crate://crates.io/httparse/1.8.0 \
    crate://crates.io/httpdate/1.0.2 \
    crate://crates.io/humantime/2.1.0 \
    crate://crates.io/idna/0.3.0 \
    crate://crates.io/indexmap/1.9.1 \
    crate://crates.io/itoa/1.0.4 \
    crate://crates.io/jobserver/0.1.25 \
    crate://crates.io/language-tags/0.3.2 \
    crate://crates.io/libc/0.2.135 \
    crate://crates.io/local-channel/0.1.3 \
    crate://crates.io/local-waker/0.1.3 \
    crate://crates.io/lock_api/0.4.9 \
    crate://crates.io/log/0.4.17 \
    crate://crates.io/memchr/2.5.0 \
    crate://crates.io/mime/0.3.16 \
    crate://crates.io/mime_guess/2.0.4 \
    crate://crates.io/miniz_oxide/0.5.4 \
    crate://crates.io/mio/0.8.4 \
    crate://crates.io/num_cpus/1.13.1 \
    crate://crates.io/num_threads/0.1.6 \
    crate://crates.io/once_cell/1.15.0 \
    crate://crates.io/parking_lot/0.12.1 \
    crate://crates.io/parking_lot_core/0.9.3 \
    crate://crates.io/paste/1.0.9 \
    crate://crates.io/path-matchers/1.0.2 \
    crate://crates.io/path-slash/0.1.5 \
    crate://crates.io/percent-encoding/2.2.0 \
    crate://crates.io/pin-project-lite/0.2.9 \
    crate://crates.io/pin-utils/0.1.0 \
    crate://crates.io/ppv-lite86/0.2.16 \
    crate://crates.io/proc-macro2/1.0.46 \
    crate://crates.io/quote/1.0.21 \
    crate://crates.io/rand/0.8.5 \
    crate://crates.io/rand_chacha/0.3.1 \
    crate://crates.io/rand_core/0.6.4 \
    crate://crates.io/redox_syscall/0.2.16 \
    crate://crates.io/regex-syntax/0.6.27 \
    crate://crates.io/regex/1.6.0 \
    crate://crates.io/rustc_version/0.4.0 \
    crate://crates.io/ryu/1.0.11 \
    crate://crates.io/scopeguard/1.1.0 \
    crate://crates.io/semver/1.0.14 \
    crate://crates.io/serde/1.0.145 \
    crate://crates.io/serde_json/1.0.86 \
    crate://crates.io/serde_urlencoded/0.7.1 \
    crate://crates.io/sha1/0.10.5 \
    crate://crates.io/signal-hook-registry/1.4.0 \
    crate://crates.io/slab/0.4.7 \
    crate://crates.io/smallvec/1.10.0 \
    crate://crates.io/socket2/0.4.7 \
    crate://crates.io/static-files/0.2.3 \
    crate://crates.io/syn/1.0.102 \
    crate://crates.io/termcolor/1.1.3 \
    crate://crates.io/time-macros/0.2.4 \
    crate://crates.io/time/0.3.15 \
    crate://crates.io/tinyvec/1.6.0 \
    crate://crates.io/tinyvec_macros/0.1.0 \
    crate://crates.io/tokio-util/0.7.4 \
    crate://crates.io/tokio/1.21.2 \
    crate://crates.io/tracing-core/0.1.30 \
    crate://crates.io/tracing/0.1.37 \
    crate://crates.io/typenum/1.15.0 \
    crate://crates.io/unicase/2.6.0 \
    crate://crates.io/unicode-bidi/0.3.8 \
    crate://crates.io/unicode-ident/1.0.5 \
    crate://crates.io/unicode-normalization/0.1.22 \
    crate://crates.io/url/2.3.1 \
    crate://crates.io/version_check/0.9.4 \
    crate://crates.io/wasi/0.11.0+wasi-snapshot-preview1 \
    crate://crates.io/winapi-i686-pc-windows-gnu/0.4.0 \
    crate://crates.io/winapi-util/0.1.5 \
    crate://crates.io/winapi-x86_64-pc-windows-gnu/0.4.0 \
    crate://crates.io/winapi/0.3.9 \
    crate://crates.io/windows-sys/0.36.1 \
    crate://crates.io/windows_aarch64_msvc/0.36.1 \
    crate://crates.io/windows_i686_gnu/0.36.1 \
    crate://crates.io/windows_i686_msvc/0.36.1 \
    crate://crates.io/windows_x86_64_gnu/0.36.1 \
    crate://crates.io/windows_x86_64_msvc/0.36.1 \
    crate://crates.io/zstd-safe/5.0.2+zstd.1.5.2 \
    crate://crates.io/zstd-sys/2.0.1+zstd.1.5.2 \
    crate://crates.io/zstd/0.11.2+zstd.1.5.2 \
"



# FIXME: update generateme with the real MD5 of the license file
LIC_FILES_CHKSUM = " \
    file://LICENSE;md5=579cfef54f8a556e96900d454125e4d1 \
"

SUMMARY = "PrintNanny OS Dashboard"
HOMEPAGE = "https://github.com/bitsy-ai/printnanny-dash"
LICENSE = "LICENSE"

# includes this file if it exists but does not fail
# this is useful for anything you may want to override from
# what cargo-bitbake generates.
include printnanny-dash-${PV}.inc
include printnanny-dash.inc
