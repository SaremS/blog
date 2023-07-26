mod utils;

use wasm_bindgen::prelude::*;
use totsu::prelude::*;
use totsu::*;

use totsu_core::solver::SolverParam;
use num_traits::Float;
use num_traits::{Num, Pow};

use serde::{Serialize};

use iter_num_tools::log_space;

extern crate console_error_panic_hook;
use std::panic;

//as in the totsu examples
type La = FloatGeneric<f64>;
type AMatBuild = MatBuild<La>;
type AProbQP = ProbQP<La>;
type ASolver = Solver<La>;

#[derive(Serialize)]
pub struct Portfolio {
    pub weights: Vec<f64>,
    pub mean: f64,
    pub stddev: f64
}


#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn optimize(means: &[f64], covs: &[f64]) -> JsValue {
    wasm_stderr_hook();

    let mut result_vec:Vec<Portfolio> = Vec::new();
    let gamma_logspace = log_space(10.0.pow(-1.0)..10.0.pow(4.0), 50);

    for gamma in gamma_logspace {

        let q_vec = build_q_vec(means);
        
        let (G_mat, h_vec, A_mat, b_vec) = build_remainder_mats(means);
        
        let P_mat = build_P_mat(covs, gamma);

        let solver = ASolver::new().par(|p| {
            p.eps_acc = 1e-6;
            set_par_by_env(p);
        });
        let mut quadratic_program = AProbQP::new(
            P_mat,
            q_vec.clone(),
            G_mat.clone(),
            h_vec.clone(),
            A_mat.clone(),
            b_vec.clone(),
            1e-6);
        let rslt = solver.solve(quadratic_program.problem());

        match rslt {
            Ok(tuple) => {
                let w = tuple.0;
                let n = means.len();
                let (weights, _) = w.split_at(n);
                let pf_mean = calculate_portfolio_mean(means, weights);
                let pf_var = calculate_portfolio_variance(covs, weights);

                let portfolio = Portfolio{
                    weights: weights.to_vec(),
                    mean: pf_mean,
                    stddev: pf_var.sqrt()
                };

                result_vec.push(portfolio);
            },
            Err(_) => panic!("Error")
        }
    }

    return serde_wasm_bindgen::to_value(&result_vec).unwrap();
}


fn wasm_stderr_hook() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

fn build_q_vec(input: &[f64]) -> AMatBuild {
    let n: usize = input.len();

    let mut q_vec = AMatBuild::new(MatType::General(n, 1));
    for i in 0..n {
        q_vec[(i, 0)] = -input[i];
    }

    return q_vec;
}

fn build_P_mat(input: &[f64], gamma: f64) -> AMatBuild {
    let n = usize_root(input.len());
    
    let mut c = 0;
    let mut P_mat = AMatBuild::new(MatType::SymPack(n)); 

    for i in 0..n {
        for j in 0..n {
            P_mat[(i,j)] = gamma*input[c];
            c += 1;
        }
    }
    return P_mat;
}

fn build_remainder_mats(input: &[f64]) -> (AMatBuild, AMatBuild, AMatBuild, AMatBuild) {
    let n: usize = input.len();

    let mut G_mat = AMatBuild::new(MatType::General(n, n)); 
    let mut h_vec = AMatBuild::new(MatType::General(n, 1));
    for i in 0..n {
        G_mat[(i,i)] = -1.0;
        h_vec[(i,0)] = 0.0;
    }


    let mut A_mat = AMatBuild::new(MatType::General(1, n)); 
    for i in 0..n {
        A_mat[(0, i)] = 1.0;
    }

    let mut b_vec = AMatBuild::new(MatType::General(1, 1)); 
    b_vec[(0,0)] = 1.0;

    return (G_mat, h_vec, A_mat, b_vec);
}

fn usize_root(u: usize) -> usize {
    let u_f64: f64 = u as f64;
    let u_f64_root: f64 = u_f64.sqrt();
    let u_root: usize = u_f64_root as usize;

    return u_root;
}


fn num_by_env<N: Num + std::fmt::Display>(e: &str) -> Option<N>
{
    if let Some(v) = std::env::var(e).ok()
                     .and_then(|s| {N::from_str_radix(&s, 10).ok()}) {
        Some(v)
    }
    else {
        None
    }
}

fn set_par_by_env<F: Float + std::fmt::Display>(p: &mut SolverParam<F>)
{
    p.max_iter = num_by_env("MAX_ITER").or(p.max_iter);
    p.eps_acc = num_by_env("EPS_ACC").unwrap_or(p.eps_acc);
    p.eps_inf = num_by_env("EPS_INF").unwrap_or(p.eps_inf);
    p.eps_zero = num_by_env("EPS_ZERO").unwrap_or(p.eps_zero);
    p.log_period = num_by_env("LOG_PERIOD").unwrap_or(p.log_period);
}


fn calculate_portfolio_mean(means: &[f64], weights: &[f64]) -> f64 {
    let n_means = means.len();
    let n_weights = weights.len();

    assert!(n_means == n_weights);
    
    let mut result: f64 = 0.0;

    for i in 0..n_means {
        result += means[i]*weights[i];
    }

    return result;
}


fn calculate_portfolio_variance(cov_mat: &[f64], weights: &[f64]) -> f64 {
    let n_covs = usize_root(cov_mat.len());
    let n_weights = weights.len();

    assert!(n_covs == n_weights);

    let mut result: f64 = 0.0;

    let mut c: usize = 0;

    for i in 0..n_weights {
        for j in 0..n_weights {
            result += weights[i]*weights[j]*cov_mat[c];
            c += 1;
        }
    }

    return result
}
