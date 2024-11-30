function validate_email(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }


function decodeJwtResponse (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
}

var google_data = new Object();

var is_google_auth = false;

  
function login() {

    // Simple definition for user in future projects

    var default_input_css = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400";

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    var email_error_text = document.getElementById("email_error");
    var password_error_text = document.getElementById("password_error");

    // Input status reset

    email.className, password.className = default_input_css;

    email_error_text.style.display, password_error_text.style.display = "none";
 
    // Javascript validation (re-checked on server side)
 
    var error = false;
 
    if (email.value.length <= 0) {
 
        error = true;
        email.className = error_input_css;
        email_error_text.style.display = "block";
 
    }
 
    if (password.value.length < 6) {

        error = true;
        password.className = error_input_css;
        password_error_text.style.display = "block";

    } 

    // Next step

    if (error == false) {

        server_login(email.value, password.value);

    }

}


function username_chosen() {

    var default_input_css = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400";

    var username = document.getElementById("username_social");
    var username_error_text = document.getElementById("username_social_error");

    var error = false;

    if (username.value.length <= 0) {

        error = true;
        username.className = error_input_css;
        username_error_text.style.display = "block";

    }

    else {

        username.className = default_input_css;
        username_error_text.style.display = "none";

    }

     // Next step

     if (error == false) {

        // Make a special server signup with Google Data Validation
        server_signup(name.value, email.value, username.value, password.value);

    }


}

function signup() {

    // Simple definition for user in future projects

    var default_input_css = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400";

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    var name_error_text = document.getElementById("name_error");
    var email_error_text = document.getElementById("email_error");
    var username_error_text = document.getElementById("username_error");
    var password_error_text = document.getElementById("password_error");


    // Javascript validation (re-checked on server side)

    var error = false;

    if (name.value.length <= 0) {

        error = true;
        name.className = error_input_css;
        name_error_text.style.display = "block";

    }

    else {

        name.className = default_input_css;
        name_error_text.style.display = "none";

    }

    if (validate_email(email.value) == false) {

        error = true;
        email.className = error_input_css;
        email_error_text.style.display = "block";

    }

    else {

        email.className = default_input_css;
        email_error_text.style.display = "none";

    }

    if (username.value.length <= 0) {

        error = true;
        username.className = error_input_css;
        username_error_text.style.display = "block";

    }

    else {

        username.className = default_input_css;
        username_error_text.style.display = "none";

    }

    if (password.value.length < 6) {

        error = true;
        password.className = error_input_css;
        password_error_text.style.display = "block";

    }  
    
    else {

        password.className = default_input_css;
        password_error_text.style.display = "none";

    }


    // Next step

    if (error == false) {

        server_signup(name.value, email.value, username.value, password.value);

    }

}


function server_signup(name, email, username, password) {
    const xhr = new XMLHttpRequest();
xhr.open("POST", "https://timefactories.com/cgi-bin/connectapp/auth.cgi/signup");
xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
const body = JSON.stringify({
  "name": name,
  "email": email,
  "username": username,
  "password": password
});
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var response = JSON.parse(xhr.responseText);

    if (response.status == "success") {

        document.getElementById("section_register").style.display = "none";
        document.getElementById("section_email").style.display = "block";

    }

    else {

        var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400";

        if (response.status == "username taken") {

            var username = document.getElementById("username");
            var username_error_text = document.getElementById("username_error");
            username.className = error_input_css;
            username_error_text.style.display = "block";

        }

        else if (response.status == "email taken") {

            document.getElementById("email_error").innerHTML = "This email is alredy in use";

            var email = document.getElementById("email");
            var email_error_text = document.getElementById("email_error");
            email.className = error_input_css;
            email_error_text.style.display = "block";
            
        }

        else if (response.status == "email invalid") {

            document.getElementById("email_error").innerHTML = "This email looks incorrect";

            var email = document.getElementById("email");
            var email_error_text = document.getElementById("email_error");
            email.className = error_input_css;
            email_error_text.style.display = "block";

        }

        else if (response.status == "data invalid") {

            show_error_page();

        }

        else if (response.status == "database error") {

            show_error_page();

        }

        else {

            show_error_page();

        }

    }

  } else {

    show_error_page();

  }
};

xhr.send(body);

}



function server_login(username, password) {
    const xhr = new XMLHttpRequest();
xhr.open("POST", "https://timefactories.com/cgi-bin/connectapp/auth.cgi/signin");
xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
const body = JSON.stringify({
  "username": username,
  "password": password
});
xhr.onload = () => {

  if (xhr.readyState == 4 && xhr.status == 200) {
    
    var response = JSON.parse(xhr.responseText);

    if (response.status == "success") {

        // Pass token for localstorage

        // Avoid back button possible
        window.location.replace("../index.html");

    }

    else {

        // If we tried with Google
        if (is_google_auth) {

            is_google_auth = false;

            // What if user has account with default, and tries to login with Google?
            // He should be logged in the same account! But emails can be changed...
            // For demo purposes, block access!
            
            // If we are creating an account, follow. If we are login in, get out!

            // Start by showing the username button!
            document.getElementById("section_loader").style.display = "none";
            document.getElementById("section_username").style.display = "block";

        }

        else {

            var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400";

            document.getElementById("password_error").innerHTML = "The login details are incorrect";

            var email = document.getElementById("email");
            email.className = error_input_css;

            var password = document.getElementById("password");
            var password_error_text = document.getElementById("password_error");
            password.className = error_input_css;
            password_error_text.style.display = "block";

        }
        
    }

  } else {
   
    show_error_page();

  }

};
xhr.send(body);
}


// This function displays an error page (used in many cases)

function show_error_page() {

    // WIP
    alert("Something went wrong");

}