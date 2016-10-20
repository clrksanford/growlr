var lock = new Auth0Lock('vcBcOaVmDWBXwgF8wsBctGBzsX7lGUhE', 'rattlesnakemilk.auth0.com', {
  auth: {
    params: {
      scope: 'openid email'
    }
  }
});

lock.on('authenticated',function (authResult) {
  //console.log(authResult);
  localStorage.setItem('idToken',authResult.idToken)
  loadGrowls();
  showProfile();
});


$(document).ready(function () {
  console.log('growler');

  $('#btn-login').on('click',function () {
    lock.show();
  })

  $('#btn-logout').on('click', function (e) {
    e.preventDefault();
    logout()
  })

  if (isLoggedIn()) {
    loadGrowls();
    showProfile()
}


});

function showProfile() {
  console.log('showprofile');
  $('#btn-login').hide()
  $('#app-info').show()
  lock.getProfile(localStorage.getItem('idToken'),function (error,profile) {
    if (error) {
      logout()
    } else {
      console.log('profile',profile);
      $('#username').text(profile.nickname)
      $('#profilepic').attr('src',profile.picture)
  }
})
}

function isLoggedIn() {
  if (localStorage.getItem('idToken')) {
  return isJwtValid();
  } else {
  return false;
  }
}

function isJwtValid() {
  var token = localStorage.getItem('idToken')
  if (!token) {
    return false;
  }
  var encodedPayload = token.split('.')[1]
  console.log('encodedPayload', encodedPayload);
  var decodedPayload = JSON.parse(atob(encodedPayload))
  console.log('decodedPayload', decodedPayload);
  var exp = decodedPayload.exp;
  console.log('exp', exp);
  var expirationDate = new Date(exp * 1000);
  console.log('expirationDate', expirationDate);
  return new Date() <= expirationDate
}


function logout() {
  console.log('logout');
  localStorage.removeItem('idToken')
  window.location.href='/';
}

function loadGrowls() {
  console.log('growls');

  $.ajax({
  url: 'http://localhost:3000/'
    })
  .done(function (data) {
    console.log(data);
    data.forEach(function (datum) {
      loadGrowl(datum)
    })
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });
}

function loadGrowl(data) {
  console.log(data);
  var li = $('<li />')
  li.text(data.content)

  $('#user-growls').append(li)
  $('#spostGrowl').val('')
  $
}
