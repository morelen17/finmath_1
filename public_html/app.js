/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var N, S0, B0, a, b, r, K, p_star, Cn, step;
var B_array = {}, S_array = {}, Gamma_array = {}, Beta_array = {};
var submited = false;

function init() {
    //K = S0 + B0;
    p_star = (r-a)/(b-a);
    B_array[0] = B0;
    for (var i = 1; i <= N; i++) {
        B_array[i] = calcB(i);
    }
    S_array[0] = S0;
    Cn = calcC(S0, N);
    step = 1;
    Gamma_array[step] = calcGamma(S_array[step-1], step);
    Beta_array[step] = calcBeta(S_array[step-1], step);
    
    if (Gamma_array[step] === 0.0 && Beta_array[step] === 0.0) {
        var text = '<p>Цена акции: ' + S_array[step-1] + '<br/>';
        console.log('Цена акции: ' + S_array[step-1]);
        var temp = Gamma_array[step]*S_array[step-1];
        text += 'Итоговый капитал: '+ temp + '<br/>';
        console.log('Итоговый капитал: ' + temp);
        S_array[step] = calcS(S_array[step-1], true);
        temp = S_array[step] - K;
        text += 'Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0) + '<br/>';
        console.log('Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0));
        temp = Math.abs(Beta_array[step-1]*B_array[step-1]);
        text += 'Должен вернуть в банк: ' + temp + '</p>';
        console.log('Должен вернуть в банк: ' + temp);
        $('#text').append(text);
        
        $('#increase').attr('disabled', true);
        $('#decrease').attr('disabled', true);
    }
}

function reset() {
    submited = false;
    N = 0, S0 = 0, B0 = 0, a = 0, b = 0, r = 0, K = 0, p_star = 0, Cn = 0, step = 0;
    B_array = {}, S_array = {}, Gamma_array = {}, Beta_array = {};
}

function calcS(prevS, state) {
    if (!state) {
        return (1+a)*prevS;
    }
    else if (state) {
        return (1+b)*prevS;
    }
}

function calcB(n) {
    return Math.pow((1+r), n)*B0;
}

function calcC(x, n) {
    return Math.pow(1+r, -N)*calcF(x, n);
}

function calcF(x, n) {
    var F = 0.0;
    for (var i = 0; i <= n; i++) {
        F = F + bin(n, i)*Math.pow(p_star, i)*Math.pow(1-p_star, n-i)*Math.max(x*Math.pow(1+a, n)*Math.pow((1+b)/(1+a), i)-K, 0);
    }
    return F;
}

function calcGamma(x, n) {
    return Math.pow(1+r, -N+n)*(calcF(x*(1+b), N-n) - calcF(x*(1+a), N-n)) / (x*(b-a));
}

function calcBeta(x, n) {
    return calcF(x, N-n+1)/calcB(N) - Math.pow(1+r, -N+n)*(calcF(x*(1+b), N-n) - calcF(x*(1+a), N-n)) / (calcB(n-1)*(b-a));
}

function calcProfit(gamma, beta, s, b) {
    return gamma * s + beta * b;
}

function bin(n, k) {
    if ((typeof n !== 'number') || (typeof k !== 'number'))   
        return false;   
    var coeff = 1;  
    for (var x = n-k+1; x <= n; x++) coeff *= x;  
    for (x = 1; x <= k; x++) coeff /= x;  
    return coeff;  
}

function calculation() {
    init();
    /*var n = 1;
    var C = calcC(S0, N);
    console.log(C);
    
    var gamma1 = calcGamma(S0, n);
    console.log(gamma1);
    var beta1 = calcBeta(S0, n);
    console.log(beta1);
    
    var Bj = B0, Sj = S0, gamma, beta;
    for (n = 2; n <= N; n++) {
        Bj = calcB(n-1);
        console.log('B'+n+' '+Bj);
        Sj = calcNextS(Sj, (states.substr(n-2,1) === '+' ? true : false));
        console.log('S'+n+' '+Sj);
        gamma = calcGamma(Sj, n);
        console.log('gamma'+n+' '+gamma);
        beta = calcBeta(Sj, n);
        console.log('beta'+n+' '+beta);
    }
    
    var Bn = calcB(n-1);
    console.log('B'+n+' '+Bn);
    var Sn = calcNextS(Sj, (states.substr(-1,1) === '+' ? true : false));
    console.log('S'+n+' '+Sn);
    
    var profit = calcProfit(gamma, beta, Sn, Bn);
    console.log('profit '+profit);*/
}

$(function() {
    
    $('#form').submit(function(e) {
        reset();
        submited = true;
        $('#submit').attr('disabled', true);
        $('#increase').attr('disabled', false);
        $('#decrease').attr('disabled', false);
        
        N = +$('#val-N').val();
        S0 = +$('#val-S0').val();
        B0 = +$('#val-B0').val();
        a = +$('#val-a').val();
        b = +$('#val-b').val();
        r = +$('#val-r').val();
        K = +$('#val-K').val();
        if (!(-1 < a && a < r && r < b)) {
            e.preventDefault();
            reset();
            submited = false;
            $('#submit').attr('disabled', false);
            $('#increase').attr('disabled', true);
            $('#decrease').attr('disabled', true);
            return false;
        }
        init();
        var text = '<p>Рациональная стоимость опциона: '+Cn+'<br/>'
            +'p*: '+p_star+'<br/>'
            +'Gamma('+step+'): '+Gamma_array[step]+'<br/>'
            +'Beta('+step+'): '+Beta_array[step]+'</p>';
        $('#text').append(text);
        console.log('Рациональная стоимость опциона: '+Cn);
        console.log('p*: '+p_star);
        console.log('Gamma('+step+'): '+Gamma_array[step]);
        console.log('Beta('+step+'): '+Beta_array[step]);

        return false;
    });
    
    $('#reset').click(function () {
        reset();
        $('#submit').attr('disabled', false);
        $('#increase').attr('disabled', true);
        $('#decrease').attr('disabled', true);
        $('#text').html('');
    });
    
    $('#increase').click(function() {
        if (submited) {
            console.log('increase');
            if (N === 1 || step === N) {
                if (Gamma_array[step] !== 0.0 && Beta_array[step] !== 0.0) {
                    S_array[step] = calcS(S_array[step-1], true);
                    var text = '<p>Цена акции: ' + S_array[step] + '</br>';
                    console.log('Цена акции: ' + S_array[step]);
                    var temp = Gamma_array[step]*S_array[step];
                    text += 'Итоговый капитал: '+ temp + '</br>';
                    console.log('Итоговый капитал: '+ temp);
                    temp = S_array[step] - K;
                    text += 'Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0) + '</br>';
                    console.log('Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0));
                    temp = Math.abs(Beta_array[step]*B_array[step]);
                    text += 'Должен вернуть в банк: ' + temp + '</p>';
                    console.log('Должен вернуть в банк: ' + temp);
                    $('#text').append(text);
                    
                    $('#increase').attr('disabled', true);
                    $('#decrease').attr('disabled', true);
                }
            }
            else if (step < N) {
                S_array[step] = calcS(S_array[step-1], true);
                var text = '<p>Цена акции повысилась: ' + S_array[step] + '<br/>';
                console.log('Цена акции повысилась: ' + S_array[step]);
                step++;
                //console.log(step);
                Gamma_array[step] = calcGamma(S_array[step-1], step);
                Beta_array[step] = calcBeta(S_array[step-1], step);
                text += 'Gamma('+step+'): '+Gamma_array[step] + '<br/>'
                        + 'Beta('+step+'): '+Beta_array[step] + '</p>';
                console.log('Gamma('+step+'): '+Gamma_array[step]);
                console.log('Beta('+step+'): '+Beta_array[step]);
                $('#text').append(text);
                
                if (Gamma_array[step] === 0.0 && Beta_array[step] === 0.0) {
                    var text = '<p>Цена акции: '+S_array[step-1] + '<br/>';
                    console.log('Цена акции: '+S_array[step-1]);
                    var temp = Gamma_array[step]*S_array[step-1];
                    text += 'Итоговый капитал: '+ temp + '<br/>';
                    console.log('Итоговый капитал: '+ temp);
                    temp = S_array[step] - K;
                    text += 'Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0) + '<br/>';
                    console.log('Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0));
                    temp = Math.abs(Beta_array[step-1]*B_array[step-1]);
                    text += 'Должен вернуть в банк: ' + temp + '</p>';
                    console.log('Должен вернуть в банк: ' + temp);
                    $('#text').append(text);
                    
                    $('#increase').attr('disabled', true);
                    $('#decrease').attr('disabled', true);
                }
            }
        }
    });
    
    $('#decrease').click(function() {
        if (submited) {
            console.log('decrease');
            if (N === 1 || step === N) {
                if (Gamma_array[step] !== 0.0 && Beta_array[step] !== 0.0) {
                    S_array[step] = calcS(S_array[step-1], false);
                    var text = '<p>Цена акции: ' + S_array[step] + '</br>';
                    console.log('Цена акции: ' + S_array[step]);
                    var temp = Gamma_array[step]*S_array[step];
                    text += 'Итоговый капитал: '+ temp + '</br>';
                    console.log('Итоговый капитал: '+ temp);
                    temp = S_array[step] - K;
                    text += 'Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0) + '</br>';
                    console.log('Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0));
                    temp = Math.abs(Beta_array[step]*B_array[step]);
                    text += 'Должен вернуть в банк: ' + temp + '</p>';
                    console.log('Должен вернуть в банк: ' + temp);
                    $('#text').append(text);
                    
                    $('#increase').attr('disabled', true);
                    $('#decrease').attr('disabled', true);
                }
            }
            else if (step < N) {
                S_array[step] = calcS(S_array[step-1], false);
                var text = '<p>Цена акции понизилась: ' + S_array[step] + '<br/>';
                console.log('Цена акции понизилась: ' + S_array[step]);
                step++;
                //console.log(step);
                Gamma_array[step] = calcGamma(S_array[step-1], step);
                Beta_array[step] = calcBeta(S_array[step-1], step);
                text += 'Gamma('+step+'): '+Gamma_array[step] + '<br/>'
                        + 'Beta('+step+'): '+Beta_array[step] + '</p>';
                console.log('Gamma('+step+'): '+Gamma_array[step]);
                console.log('Beta('+step+'): '+Beta_array[step]);
                $('#text').append(text);
                
                if (Gamma_array[step] === 0.0 && Beta_array[step] === 0.0) {
                    var text = '<p>Цена акции: '+S_array[step-1] + '<br/>';
                    console.log('Цена акции: '+S_array[step-1]);
                    var temp = Gamma_array[step-1]*S_array[step-1];
                    text += 'Итоговый капитал: '+ temp + '<br/>';
                    console.log('Итоговый капитал: '+ temp);
                    temp = S_array[step] - K;
                    text += 'Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0) + '<br/>';
                    console.log('Должен выплатить покупателю опциона: ' + (temp > 0 ? temp : 0));
                    temp = Math.abs(Beta_array[step-1]*B_array[step-1]);
                    text += 'Должен вернуть в банк: ' + temp + '</p>';
                    console.log('Должен вернуть в банк: ' + temp);
                    $('#text').append(text);
                    
                    $('#increase').attr('disabled', true);
                    $('#decrease').attr('disabled', true);
                }
            }
        }
    });
    
});