function validate_email(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }


function username_chosen() {

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var username = document.getElementById("username");
    var password = document.getElementById("password");

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


// The signup has been replaced by a data pass for demo purposes
function server_signup(name, email, username, password) {
   
    // Open the main app page and pass the values
    
}


// This function displays an error page (used in many cases)

function show_error_page() {

    // WIP
    alert("Something went wrong");

}