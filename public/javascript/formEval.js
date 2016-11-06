/**
 * Created by Matthías on 6.11.2016.
 */

module.exports = function(req, res, next) {

    var evalError =
    {
        value: '',
        type: ''
    };

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var first_name = req.param('first_name');
    var last_name = req.param('last_name');
    var username = req.param('username');
    var password = req.param('password');
    var passwordAgain = req.param('passwordAgain');
    var email = req.param('email');
    var phone = req.param('phone');

    var user =
    {
        name: name,
        username: username,
        password: password,
        passwordAgain: passwordAgain,
        email: email,
        phone: phone
    };

    if(name==''||username==''||password==''||passwordAgain==''||email==''||phone=='')
    {
        evalError.value = 'Fylla þarf í alla reiti';
        evalError.type = 'all';
        console.log(user.name);
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    if(name.length<=2)
    {
        evalError.type='name';
        evalError.value='Nafn of stutt';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    if(username.length<=4)
    {
        evalError.type='username';
        evalError.value='Notandanafn þarf að vera minnst 5 stafir';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    if(password.length<8)
    {
        evalError.type='password';
        evalError.value='Lykilorð verður að vera a.m.k. 8 stafir';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    if((password)!==(passwordAgain))
    {
        evalError.type='passwordAgain';
        evalError.value='Lykilorðin passa ekki';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }

    //Email
    if(email.indexOf('@')==-1 || email.indexOf('.')==-1)
    {
        evalError.type='email';
        evalError.value='Netfang ekki löglegt';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }

    var split = email.split("@");
    console.log(split);
    var split2 = split[1].split(".");
    console.log(split2);
    if(split[0]<=1 || split[1]<=1 || split2[0]<2 || split2[1]<2)
    {
        evalError.type='email';
        evalError.value='Netfang ekki löglegt';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }

    //Phone
    console.log(phone);
    if(phone.length<7)
    {
        evalError.type='phone';
        evalError.value='Símanúmer of stutt';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    if(!isNumeric(phone))
    {
        evalError.type='phone';
        evalError.value='Ólöglegt símanúmer';
        return res.view('signUp', {evalError:evalError}, {user:user});
    }
    next();

};
