/* =============================================================
   CLIENT PORTAL — LOGIN CONTROLLER
   =============================================================
   Squad Lead : Fatima Nadeem
   Team       : BD CRM Client Portal Frontend Squad
   Company    : DevLogix Technologies
   File       : js/login.js
   Task       : Connect client authentication workflow
   ============================================================= */

(function () {
  'use strict';

  /* --- DOM References --- */
  var form = document.getElementById('loginForm');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var emailError = document.getElementById('emailError');
  var passwordError = document.getElementById('passwordError');
  var submitBtn = document.getElementById('submitBtn');
  var togglePassword = document.getElementById('togglePassword');
  var formMessage = document.getElementById('formMessage');
  var alertIcon = document.getElementById('alertIcon');
  var alertText = document.getElementById('alertText');

  var DASHBOARD_PAGE = 'dashboard.html';

  /* --- If already logged in, redirect to dashboard --- */
  if (typeof AuthGuard !== 'undefined' && AuthGuard.isAuthenticated()) {
    window.location.href = DASHBOARD_PAGE;
    return;
  }

  /* --- Password Toggle --- */
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      var isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      this.textContent = isPassword ? 'Hide' : 'Show';
      this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  /* --- Form Validation --- */
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function clearErrors() {
    if (emailInput) emailInput.classList.remove('input-error');
    if (passwordInput) passwordInput.classList.remove('input-error');
    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';
  }

  function showFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
  }

  /* --- Show Alert Message --- */
  function showAlert(type, message) {
    if (!formMessage || !alertIcon || !alertText) return;
    formMessage.className = 'form-alert visible ' + type;
    alertIcon.textContent = type === 'error' ? '⚠' : '✓';
    alertText.textContent = message;
  }

  function hideAlert() {
    if (!formMessage) return;
    formMessage.className = 'form-alert';
    formMessage.classList.remove('visible');
  }

  /* --- Set Button Loading State --- */
  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
    }
  }

  /* --- Form Submit Handler --- */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      clearErrors();
      hideAlert();

      var email = emailInput ? emailInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value : '';

      /* Client-side validation */
      var isValid = true;

      if (!email) {
        showFieldError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(email)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!password) {
        showFieldError(passwordInput, passwordError, 'Password is required.');
        isValid = false;
      } else if (password.length < 6) {
        showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters.');
        isValid = false;
      }

      if (!isValid) return;

      /* --- Call Mock API --- */
      setLoading(true);

      if (typeof MockAPI === 'undefined') {
        setLoading(false);
        showAlert('error', 'API module not loaded.');
        return;
      }

      MockAPI.login(email, password)
        .then(function (response) {
          if (response.success) {
            /* Save session */
            if (typeof AuthGuard !== 'undefined') {
              AuthGuard.saveSession(response.token, response.user);
            }

            /* Show success message */
            showAlert('success', response.message);

            /* Redirect to dashboard */
            setTimeout(function () {
              window.location.href = DASHBOARD_PAGE;
            }, 600);
          } else {
            /* Show error */
            setLoading(false);
            showAlert('error', response.message);

            /* Shake the form */
            form.style.animation = 'none';
            form.offsetHeight; /* force reflow */
            form.style.animation = 'shake 0.4s ease';
          }
        })
        .catch(function (error) {
          setLoading(false);
          showAlert('error', 'Something went wrong. Please try again.');
          console.error('Login API Error:', error);
        });
    });
  }

  /* --- Clear errors on input --- */
  if (emailInput) {
    emailInput.addEventListener('input', function () {
      emailInput.classList.remove('input-error');
      if (emailError) emailError.textContent = '';
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      passwordInput.classList.remove('input-error');
      if (passwordError) passwordError.textContent = '';
    });
  }

})();
