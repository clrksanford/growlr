var lock = new Auth0Lock('vcBcOaVmDWBXwgF8wsBctGBzsX7lGUhE', 'rattlesnakemilk.auth0.com', {
  auth: {
    params: {
      scope: 'openid email'
    }
  }
});

lock.on('authenticated',function (authResult) {
  //console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  loadGrowls();
  showProfile();

  lock.getProfile(localStorage.getItem('idToken'),function (error,profile) {
    if (error) {
      logout();
    } else {
      // console.log('profile',profile);
      localStorage.setItem('username', profile.nickname);
      localStorage.setItem('profilePic', profile.picture);
      localStorage.setItem('userId', profile.user_id);
    }
  });
});

$(document).ready(function () {

  $('#btn-login').on('click',function () {
    lock.show();
  });

  $('#btn-logout').on('click', function (e) {
    e.preventDefault();
    logout();
  });

  $('#growler').on('submit', function (e) {
    e.preventDefault();
    postGrowl();
  });

  $(document).on('click', 'li', function (e) {
    e.preventDefault();
    var nearestGrowl = $(this);
    deleteGrowl(nearestGrowl);
  })

  if (isLoggedIn()) {
    loadGrowls();
    showProfile();
  }
});

function showProfile() {
  console.log('showprofile');
  $('#btn-login').hide();
  $('#app-info').show();
}

function isLoggedIn() {
  if (localStorage.getItem('idToken')) {
    return isJwtValid();
  } else {
    return false;
  }
}

function isJwtValid() {
  var token = localStorage.getItem('idToken');
  if (!token) {
    return false;
  }
  var encodedPayload = token.split('.')[1];
  // console.log('encodedPayload', encodedPayload);
  var decodedPayload = JSON.parse(atob(encodedPayload));
  // console.log('decodedPayload', decodedPayload);
  var exp = decodedPayload.exp;
  // console.log('exp', exp);
  var expirationDate = new Date(exp * 1000);
  // console.log('expirationDate', expirationDate);
  return new Date() <= expirationDate;
}


function logout() {
  console.log('logout');
  localStorage.removeItem('idToken')
  window.location.href='/';
}

function loadGrowls() {
  console.log('growls');

  $.ajax({
  url: 'http://localhost:3000/',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
  }
    })
  .done(function (data) {
    // console.log(data);
    data.forEach(function (datum) {
      loadGrowl(datum)
    })
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });
}

function loadGrowl(data) {
  // console.log(data);

  var li = $('<li />')
  li.text(data.content)
  li.data('id',data._id)
  li.data('userId', data.userId);

  var deleteLink = $('<a />')
  deleteLink.text('delete')
  deleteLink.addClass('delete-link');
  deleteLink.attr('href','#')

  li.append(deleteLink)

  var nickName = $('<h4 />')
  nickName.text(data.username)
  li.append(nickName)

  var profilePicture = $('<img />')
  profilePicture.attr('src',data.profilePic)
  li.append(profilePicture)

  $('#user-growls').append(li)
  $('#spostGrowl').val('')
  $
}

function postGrowl() {

  var data = {
    content: $('#postGrowl').val(),
    date: new Date(),
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    profilePic: localStorage.getItem('profilePic')
  };

  $.ajax({
   method: 'POST',
   url: 'http://localhost:3000/',
   data: data,
   headers: {
     'Authorization': 'Bearer ' + localStorage.getItem('idToken')
   }
  })
   .done(function (data) {

   })
   .fail(function (jqXHR, textStatus, errorThrown) {
     console.log(errorThrown);
   });
}

function deleteGrowl(growl) {

  // Check to make sure userId in local storage is the same as userId of post
  if(growl.data().userId !== localStorage.getItem('userId')) {
    alert('You do not have access to delete that Growl!');
    return;
  }

  $.ajax({
    method: 'DELETE',
    url: 'http://localhost:3000/' + growl.data().id,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  })
    .done(function (response) {
      console.log(response);
      growl.remove();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    })
}
