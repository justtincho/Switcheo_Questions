var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++){
        sum += i;
    }
    return sum;
};

//checking solution
console.log(sum_to_n_a(5));

var sum_to_n_b = function(n) {
    let sum = 0;
    let i = 1;
    while (i <= n){
        sum += i;
        i++;
    }
    return sum;
};

//checking solution
console.log(sum_to_n_b(5));

var sum_to_n_c = function(n) {
    if (n === 0){
        return 0;
    }
    return n + sum_to_n_c(n-1);
};

//checking solutions
console.log(sum_to_n_c(5));