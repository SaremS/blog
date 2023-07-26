pub fn usize_root(u: usize) -> usize {
    let u_f64: f64 = u as f64;
    let u_f64_root: f64 = u_f64.sqrt();
    let u_root: usize = u_f64_root as usize;

    return u_root;
}

pub fn calculate_portfolio_mean(means: &[f64], weights: &[f64]) -> f64 {
    let n_means = means.len();
    let n_weights = weights.len();

    assert!(n_means == n_weights);
    
    let mut result: f64 = 0.0;

    for i in 0..n_means {
        result += means[i]*weights[i];
    }

    return result;
}

pub fn calculate_portfolio_variance(cov_mat: &[f64], weights: &[f64]) -> f64 {
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
