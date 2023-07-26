mod utils;
mod portfolio_optimizer;

use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;
use std::panic;

use crate::portfolio_optimizer::{optimize_portfolio, Portfolio};

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn optimize(means: &[f64], covs: &[f64]) -> JsValue {
    wasm_stderr_hook();

    let result_vec: Vec<Portfolio> = optimize_portfolio(means, covs);
    return serde_wasm_bindgen::to_value(&result_vec).unwrap();
}

fn wasm_stderr_hook() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
