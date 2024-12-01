
localStorage.setItem("lifeline_session_token", "dSJWHgJlU4YP9W21CC3VhhU7c/OpIA==*ZxbnAGTsLoTDHmVvD1y8/g==*5k60igPGJYZhabB8dHpAKw==*a5jmMBbc1azuNLnmaosCug==");

var user = {

  id: 1,
  name: "Markus Urban",
  username: "markus",
  email: "m@m.de",
  image: "default.png",
  description: "Un estudiant de IA"

};


var user_id = 1;

// Get user interests

// Global variable that stores user interests in JSON
var user_interests;

get_user_interests(user_id, "interests");

// Example for development (2 interests)
/*user_interests = [
  {
      "id": 1,
      "image": "0a73d03509154c56939038b5f5fe1ff2.png",
      "interest_name": "Anime"
  },
  {
      "id": 2,
      "image": "6b88c7a0b31745f8b9128235c745af7c.png",
      "interest_name": "Badminton"
  }
]*/

  // Create list of alredy joined ID'S from previously collected JSON

 
  var joined_interests_id = [];

   /*
  for (var interest in user_interests) {
    joined_interests_id.push(user_interests[interest]["id"]);
  }*/



/* CREATE PAGE */

function show_image_preview_create(event) {

  try {
    document.getElementById("visible_image_upload_zone").style.display = "none";
    var src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("visible_image_preview").src = src;
    document.getElementById("visible_image_preview").style.display = "block";
  }
  
  catch (error) {

    document.getElementById("visible_image_preview").style.display = "none";
    document.getElementById("visible_image_upload_zone").style.display = "block";

  }

}

// Upload image
async function upload_cover_image(group_type) {

  var image_id;

  if (group_type == "group") {

    image_id = "dropzone-file";
  }

  else if (group_type == "interest") {

    image_id = "dropzone-file-2";
  }

  else if (group_type = "profile") {

    image_id = "dropzone-file-3";

  }

  let formData = new FormData();           
  formData.append("file", document.getElementById(image_id).files[0]);
  var response = await fetch('/cgi-bin/lifeline/main.cgi/upload', {
    method: "POST", 
    body: formData
  });    
  const data = await response.json();
  handle_upload(data, group_type);
}


function handle_upload(data, group_type) {

  if (data.status == "success") {

    if (group_type == "group") {

      const data_json = {
        group_name: group_name,
        description: group_description,
        creator_id: user_id,
        image: data.filename,
        settings: ""
      };

      group_image = data.filename;

      create_group_fetch(data_json);

    }

    // Interest
    else if (group_type == "interest") {

      const data_json = {
        interest_name: interest_name,
        creator_id: user_id,
        image: data.filename
      };

      create_interest_fetch(data_json);

    }

    else if (group_type == "profile") {

      const data_json = {
        id: user.id,
        name: user.name,
        description: user.description,
        image: data.filename
      };

      edit_profile_fetch(data_json);

    }

  }

  else {

    show_error_alert();

  }

}


function load_edit_group() {

  document.getElementById("group_save_button").innerHTML = "Save changes";

  document.getElementById("create_event_name").value = group_name;
  document.getElementById("create_group_description").value = group_description;

  if (group_image) {

    document.getElementById("visible_image_preview").src = group_image;
    document.getElementById("visible_image_preview").style.display = "block";
    document.getElementById("visible_image_upload_zone").style.display = "none";

  }

}



var group_name, group_description, group_image;
var group_action = "create";

function create_group() {

  var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 mt-4 dark:bg-red-100 dark:border-red-400";

  var name = document.getElementById("create_event_name");
  
  var name_error_text = document.getElementById("create_event_name_error");

  // Input status reset

  name.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  name_error_text.style.display = "none";

  // Javascript validation (re-checked on server side)

  var error = false;

      if (name.value.length <= 0) {
 
        error = true;
        name.className = error_input_css;
        name_error_text.style.display = "block";
 
    }

    // Next step

    if (error == false) {

      // Save data
      group_name = name.value;
      group_description = document.getElementById("create_group_description").value.trim();

      // Check if there's an image to upload

      if (document.getElementById("dropzone-file").value != "") {

        upload_cover_image("group");

      }

      else {

        if (group_action == "create") {

          const data = {
            group_name: group_name,
            description: group_description,
            creator_id: user_id,
            image: "default.png",
            settings: ""
          };
  
          create_group_fetch(data);  

        }

        else if (group_action == "edit") {

          console.log("Make editing publish -- Also on new image");

        }

        
      }

    }

}



function create_group_fetch(data_sent) {

  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_sent)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error creating the group');
      }
      return response.json();
    })
    .then(data => {
      
      console.log('Group created successfully - ', data);

      console.log(data["group_id"]);

      // Join the created group
      join_group(user_id, data["share_code"]);

      // Variable global del share code
      share_code = data["share_code"];

      // Mostrar pàgina del grup i opció de compartir
      open_group(data["group_id"], group_name, group_image, group_description);
    
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


/*

ANNOUNCEMENT
============

Handling the join_group with the share_code (instead of just the group ud) makes it all go slower,
though more secure. It may be reconsidered before production if it's worth it!

*/

function join_group(user_id, share_code) {

  const data = {
    group_code: share_code,
    user_id: user_id
  };
  
  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/joingroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se ha añadido al grupo.');
    }
    return response.json();
  })
  .then(data => {
    console.log('Añadido al grupo exitosamente', data);
   
  })
  .catch(error => {
    console.error('Error:', error);
  });

}



function open_group(group_id, name, image, description) {

  document.getElementById("screen_main").style.display = "none";

  create_demo_users();

  document.getElementById("group_name").innerHTML = name;

  // Only show if there is one!
  if (description.trim().length > 0) {

    document.getElementById("group_description").innerHTML = description;
    document.getElementById("description_container").style.display = "block";

  }
  

  document.getElementById("group_image").src = image;

  //opened_group_id = group_id;

  document.getElementById("screen_group").style.display = "block";

}



function get_group_participants(group_id) {
  
  const data = {
    group_id: group_id
  };
  
  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/getgroupmembers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se han obtenido usuarios.');
    }
    return response.json();
  })
  .then(data => {
    
    var number_of_participants = data.length;

    if (number_of_participants == 1) {
      // Show welcome banner inside group
      //document.getElementById("new_group_welcome_banner").style.display = "block";
    }

    // Set number of participants
    document.getElementById("participants-tab").innerHTML = "Participants (" + number_of_participants + ")";
    create_participants_cards_group(data);
   
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}



function addRow(participant) {
  var table = document.getElementById("group_members_table");
  var row = table.insertRow(); // Insert a new row
  row.className = "bg-white"; // Add class to the row

  var cell = row.insertCell(); // Insert a cell in the row
  cell.innerHTML = `
    <div style="display:flex;" onclick="open_profile('${participant[0]}', '${decodeURIComponent(participant[1])}', '${participant[2]}', '${participant[3]}', '${participant[4]}');" scope="row" class="flex items-center px-1 py-4 text-gray-900 whitespace-nowrap dark:text-white">
      <img class="w-10 h-10 rounded-full" src="${participant[2]}" alt="Profile picture">
      <div class="pl-3">
        <div class="text-base font-semibold">${decodeURIComponent(participant[1])}</div>
        <div class="font-normal text-gray-500">@${participant[4]}</div>
      </div>
    </div>
  `;
}



function create_participants_cards_group(data) {

  for (var i in data) {

    participant = data[i];

    addRow(participant);

  }
 
}



// Load group cards

// Make one fetch based on user ID 
// and another function to load the cards and hide the skeleton

function load_groups(user_id) {

  const data = {
    user_id: user_id
  };
  
  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/getusergroups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se han obtenido grupos.');
    }
    return response.json();
  })
  .then(data => {
    
    var number_of_groups = data.length;

    if (number_of_groups == 0) {
      // Show banner to create new group
      //document.getElementById("new_group_welcome_banner").style.display = "block";
    }

    create_group_cards(data);
   
  })
  .catch(error => {
    console.error('Error:', error);
  });


}


// Función para escapar comillas simples en una cadena
function escapeSingleQuotes(str) {
  return str.replace(/'/g, "\\'");
}


// INTERESTS
// =========

function show_image_preview(event, page) {

  console.log("Image preview changed");


  try {
    var src = URL.createObjectURL(event.target.files[0]);
    document.getElementById(page + "_image_preview").src = src;
  }
  
  catch (error) {

    console.log("No image available");

  }

}

var interest_name;

function create_interest() {

  var error_input_css = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 mt-4 dark:bg-red-100 dark:border-red-400";
  var error_input_css_padding = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400 pl-10";

  
  
  var name = document.getElementById("interest_name_input");
  
  var name_error_text = document.getElementById("create_interest_name_error");

  // Input status reset

  name.className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  name_error_text.style.display = "none";

  // Javascript validation (re-checked on server side)

  var error = false;

      if (name.value.length <= 0) {
 
        error = true;
        name.className = error_input_css;
        name_error_text.style.display = "block";
 
    }

    // Next step

    if (error == false) {

      // Save data
      interest_name = name.value;

      // Check if there's an image to upload

      if (document.getElementById("dropzone-file-2").value != "") {

        upload_cover_image("interest");

      }

      else {

        const data = {
          interest_name: interest_name,
          creator_id: user_id,
          image: "default.png"
        };

        create_interest_fetch(data);
        
      }

    }

}




function create_interest_fetch(data_sent) {

  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_sent)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error creating the interest');
      }
      return response.json();
    }) 
    .then(data => {
      
      console.log('Interest created successfully - ', data);

      console.log(data["interest_id"]);

      // Join the created group
      join_interest(user_id, data["interest_id"]);

      // Mostrar notificació si ha sortit bé
      // ...

      console.log("Sembla que tot ha anat bé");
      
    
    })
    .catch(error => {
      console.error('Error:', error);
    });

}



function get_user_interests(given_user_id, page) {

  const data_sent = {
    user_id: given_user_id
  }

  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/getuserinterests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data_sent)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error getting user interests');
    }
    return response.json();
  }) 
  .then(data => {
    
    console.log('Interests collected successfully - ', data);

    if (page == "interests") {

      user_interests = data;

      // Convert to ID and store
      for (var interest in user_interests) {
        joined_interests_id.push(user_interests[interest]["id"]);
      }

    }

    else if (page == "profile_diff") {

      get_common_interests(data);

    }

    else if (page == "profile_own") {

      create_common_interest_cards(data, "profile_interests_list");

    }
    
  })
  .catch(error => {
    console.error('Error:', error);
  });

}


// Creates a JSON list of common interests to show 
// on the profile page tab - common interestss

function get_common_interests(user_2_interests) {

  const common_interests = [];
  
  user_interests.forEach(interest1 => {
    user_2_interests.forEach(interest2 => {
      if (interest1.id === interest2.id) {
        common_interests.push(interest1);
      }
    });
  });

  // Delete the interest cards that were on the profile
  // WIP ...

  // Call function to display the common interests
  create_common_interest_cards(common_interests, "profile_common_interests_list");
  
  // Display user_2 interests in profile tab
  create_common_interest_cards(user_2_interests, "profile_interests_list");
  

}



// See the list of interests
// in batches of 10, from the given interest ID

function load_interests(base_id, query=""){

  var url = 'https://timefactories.com/cgi-bin/connectapp/main.cgi/showinterests?base_id=' + base_id

  if (query) {

    url = url + "&query=" + encodeURI(query);

  }

  // Make a GET request using fetch
  fetch(url)
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
  })
  .then(data => {

    // Load the interest cards
    console.log(data);

    // Delete interest cards (for update) when it's a search
    if (query) {
      delete_interest_cards();
    }

    if (query && data.length == 0) {

      // When no interests found

      // Show an empty search state (WIP)
      document.getElementById("interests_empty_screen").style.display = "block";
    }

    else {

      document.getElementById("interests_empty_screen").style.display = "none";
      create_interest_cards(data);

    }
    
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });


}


function create_interest_cards(data) {

  var button_join_template = `
  <button id="join_button_interest_id_replace" onclick="join_interest(${user_id}, interest_id_replace);" type="button" class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Join</button>`;

  var button_unjoin_template = `
  <button id="join_button_interest_id_replace" onclick="join_interest(${user_id}, interest_id_replace);" type="button" class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" style="background-color: rgb(243, 244, 246); color: rgb(26, 86, 219);">Joined</button>`;

  // Create the cards for the interests, set as joined when it's the case!
  for (var i in data) {

    interest = data[i];

    var button_template = button_join_template;

    // Check if alredy joined, and change button style
    if (joined_interests_id.includes(interest["id"])) {
      button_template = button_unjoin_template;
    }

    // Set the onclick id
    button_template = button_template.replaceAll("interest_id_replace", interest["id"]);

    var template = `<li class="interest_card py-3 sm:py-4">
    <div class="flex items-center">
        <div class="flex-shrink-0">
            <img class="w-10 h-10 rounded-full" src="https://timefactories.com/lifeline/useruploads/${interest["image"]}" alt="Interest">
        </div>
        <div class="flex-1 min-w-0 ms-4 ml-3">
            <p class="text-base font-medium text-gray-900 truncate dark:text-white">
            ${decodeURIComponent(interest["interest_name"])}
            </p>
            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Created today
            </p>
        </div>
        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          ${button_template}
        </div>
    </div>
</li>`;


    let frag = document.createRange().createContextualFragment(template);
    document.getElementById("interest_page_container").appendChild(frag);

  }
 
}





function create_common_interest_cards(data, location) {

  if (data.length > 0) {
    document.getElementById("profile_common_empty_screen").style.display = "none";
  }

  // Create the cards for the interests, set as joined when it's the case!
  for (var i in data) {

    interest = data[i];

    var template = `<li class="interest_card py-3 sm:py-4">
    <div class="flex items-center">
        <div class="flex-shrink-0">
            <img class="w-10 h-10 rounded-full" src="https://timefactories.com/lifeline/useruploads/${interest["image"]}" alt="Interest">
        </div>
        <div class="flex-1 min-w-0 ms-4 ml-3">
            <p class="text-base font-medium text-gray-900 truncate dark:text-white">
            ${decodeURIComponent(interest["interest_name"])}
            </p>
            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Created today
            </p>
        </div>
    </div>
</li>`;

    let frag = document.createRange().createContextualFragment(template);
    document.getElementById(location).appendChild(frag);

  }
 
}







// USER PROFILE


// Open user profile
function open_profile(id, name, image, description, username) {

  // Replaced with the "Hide All" function
  document.getElementById("screen_main").style.display = "none";
  document.getElementById("screen_group").style.display = "none";
  
  // Set the interests to a default interest list
  // ...

  // Set the common to a variation of the interests that the one selected
  // ...

  document.getElementById("profile_image").src = image;
  document.getElementById("profile_name").innerHTML = name;
  document.getElementById("profile_username").innerHTML = "@" + username;

  if (description.length > 1) {

    document.getElementById("profile_description").innerHTML = description;
    document.getElementById("profile_description_container").style.display = "block";

  }

  if (id != user_id) {

    document.getElementById("profile_common_tab").style.display = "block";

    // Get common interests
    get_user_interests(id, "profile_diff");

  }

  else {

    get_user_interests(id, "profile_own");
    // ...

    // Hide the "In common" tab (make it second)

    document.getElementById("profile_common_tab").style.display = "none";
  }


  document.getElementById("screen_profile").style.display = "block";

}





// Profile edit page

// Get user data -> We need user profiles -> We need backend & Flask!

/* GROUP SHARE */

const share_btn = document.getElementById("share_group_button");

// Share must be triggered by "user activation"
share_btn.addEventListener("click", async () => {
  try {
    const shareData = {
      title: "Join my group on Connect",
      text: "Click the link to join my group on Connect",
      url: "https://timefactories.com/lauzhack/"
    };
    await navigator.share(shareData);
    console.log("Shared successfully");
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});




/* INTEREST SEARCH */

function open_interest_search() {

  document.getElementById('interest_search_form').style.display='block';
  document.getElementById('interest_search_input').focus();
  
}

// We only want to autocomplete when we add more characters
var previous_length = 0;

document.getElementById('interest_search_input').addEventListener('input', function() {
  
  var inputValue = this.value.trim(); // Trim whitespace
  var current_length = inputValue.length;

  // Start search when user has inputed at least 2 characters
  if (inputValue.length > 1 && current_length > previous_length) {
    load_interests(0, inputValue);
  }

  // Set default interests when there is no search!
  else if (inputValue.length == 0){
    delete_interest_cards();
    load_interests(0);
  }

  previous_length = current_length;

});



// Delete all interest cards
function delete_interest_cards() {

  document.querySelectorAll('.interest_card').forEach(function(element) {
    element.remove();
});


}

function join_interest(user_id, interest_id) {

  // If it is joined, call unjoin
  if (joined_interests_id.includes(interest_id)) {

    unjoin_interest(user_id, interest_id);

  }

  else {

  join_interest_animation(interest_id, "join");

  const data = {
    interest_id: interest_id,
    user_id: user_id
  };
  
  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/joininterest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se ha añadido al interés');
    }
    return response.json();
  })
  .then(data => {

    // Update local interest list
    joined_interests_id.push(interest_id);

    console.log('Añadido al interés exitosamente', data);
   
  })
  .catch(error => {
    console.error('Error:', error);
  });

  }

}



// Un-join interest
function unjoin_interest(user_id, interest_id) {

  join_interest_animation(interest_id, "unjoin");

  const data = {
    interest_id: interest_id,
    user_id: user_id
  };
  
  fetch('https://timefactories.com/cgi-bin/connectapp/main.cgi/unjoininterest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se ha añadido al interés');
    }
    return response.json();
  })
  .then(data => {

    // Delete locally
    joined_interests_id = joined_interests_id.filter(function(e) { return e !== interest_id })
    
    console.log('Eliminado interés exitosamente', data);
   
  })
  .catch(error => {
    console.error('Error:', error);
  });

}



function join_interest_animation(interest_id, action) {

  if (action == "unjoin") {

    // Un-join animation (for later)
    document.getElementById("join_button_" + interest_id.toString()).style.backgroundColor = "white";
    document.getElementById("join_button_" + interest_id.toString()).innerHTML = "Join";
    document.getElementById("join_button_" + interest_id.toString()).style.color = "#111827";

  }

  else {

    // Join animation
    document.getElementById("join_button_" + interest_id.toString()).style.backgroundColor = "#F3F4F6";
    document.getElementById("join_button_" + interest_id.toString()).innerHTML = "Joined";
    document.getElementById("join_button_" + interest_id.toString()).style.color = "#1A56DB";

  }


}




// Join Create

function start_group_create() {

  // Hide the group page and 
}


function search_interest() {

  document.getElementById("screen_profile").style.display = "none";
  document.getElementById("screen_interests").style.display = "block";
  load_interests(0, query="");

}



var discover_open = false;

// Group Discover 
function discover_groups() {

  discover_open = true;

  document.getElementById("groups_empty_screen").style.display = "none";
  document.getElementById("group_skeleton_loaders").style.display = "block";

  setTimeout(function() {
    document.getElementById("group_skeleton_loaders").style.display = "none";
    document.getElementById("group_container").style.display = "block";
  }, 1000);
  
}



var demo_users = [
  [1, "Markus Urban", "https://api.dicebear.com/6.x/initials/svg?seed=Markus", "UPC Student", "markusurban"],
  [0, "Joan", "https://api.dicebear.com/6.x/initials/svg?seed=Joan", "UPC Student", "joan"],
  [0, "Mariona", "https://api.dicebear.com/6.x/initials/svg?seed=Mariona", "UPC Student", "mariona"],
  [0, "Martina", "https://api.dicebear.com/6.x/initials/svg?seed=Martina", "UPC Student", "martina"]
];


function create_demo_users() {

  for (let i = 0; i < demo_users.length; i++) {
    addRow(demo_users[i]);
  }
  
}


var random_recommended_users = ["John Doe", "Hans Urban", "Laura Casanovas"];

function add_recommendations() {

  for (let i = 0; i < random_recommended_users.length; i++) {

    var name = random_recommended_users[i];
    var username = name.split(' ').join('').toLowerCase();

    var recommended_user_template = `
      <div class="mb-6 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-end px-4 pt-4">
          <br>
        </div>
        <div class="flex flex-col items-center pb-10">
            <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="https://api.dicebear.com/6.x/initials/svg?seed=${name}" alt="Profile image"/>
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">${name}</h5>
            <span style="margin-bottom: 15px;" class="text-sm text-gray-500 dark:text-gray-400">This is a demo user</span>
            <div class="flex mt-4 md:mt-6">
                <!-- id, name, image, description, username -->
                <a href="#" onclick="open_profile(101, '${name}', 'https://api.dicebear.com/6.x/initials/svg?seed=${name}', 'This is a demo user', '${username}');" style="margin-right: 5px;" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View profile</a>
                <a href="#" style="margin-left: 5px;" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
            </div>
        </div>
      </div>
    `;


    let frag = document.createRange().createContextualFragment(recommended_user_template);
    document.getElementById("common_users").appendChild(frag);

  }


}





// BOTTOM BAR
// My eyes want to close but my head says: pip install energy

function bottom_bar(page) {

  if (page == "home") {

    if (discover_open) {
      // If alredy joined a group, show recommended users
      document.getElementById("screen_profile").style.display = "none";
      document.getElementById("group_container").style.display = "none";
      document.getElementById("screen_interests").style.display = "none";
      add_recommendations();
      document.getElementById("home_alert_text").innerHTML = "<span class='font-medium'>Hooray!</span> We found some connections ☀️";
      document.getElementById("common_users").style.display = "block";
      document.getElementById("screen_main").style.display = "block";
    }

  }


}