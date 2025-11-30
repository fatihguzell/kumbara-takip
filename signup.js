// ====================================
// SIGNUP PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;

    if (!termsAccepted) {
      alert('Kullanıcı sözleşmesini kabul etmelisiniz.');
      return;
    }

    if (password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor.');
      return;
    }

    // Demo amaçlı localStorage'a kaydedelim
    const user = { fullName, email, username };
    localStorage.setItem('registeredUser', JSON.stringify(user));
    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    window.location.href = 'login.html';
  });
});
