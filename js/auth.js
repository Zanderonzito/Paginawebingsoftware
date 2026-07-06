/* ============================================================
   MUJER COBRA — auth.js
   Autenticación Supabase para el storefront
   Cargar DESPUÉS de supabase-config.js y main.js
   ============================================================ */

(function () {
  'use strict';

  let _currentUser = null;

  /* ── CSS del botón de auth en el nav ── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-auth-btn {
      background: none;
      border: 1px solid rgba(201,122,75,0.4);
      color: #e09065;
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 6px 14px;
      cursor: pointer;
      font-family: inherit;
      transition: border-color 0.3s, color 0.3s;
      white-space: nowrap;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-auth-btn:hover { border-color: #c97a4b; color: #f3ece1; }
  `;
  document.head.appendChild(style);

  /* ── Estado público ── */
  function getUsuarioActual() { return _currentUser; }
  window.getUsuarioActual = getUsuarioActual;

  /* ── Inicialización ── */
  async function initAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    _currentUser = session?.user || null;
    actualizarNavAuth();

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      _currentUser = session?.user || null;
      actualizarNavAuth();
      if (typeof renderCart === 'function') renderCart();
    });
  }

  function actualizarNavAuth() {
    const btn = document.getElementById('nav-auth-btn');
    if (!btn) return;
    const isEn = window.MC?.lang === 'en';
    if (_currentUser) {
      const label = _currentUser.email.split('@')[0];
      btn.textContent = label;
      btn.title = isEn ? 'Sign out' : 'Cerrar sesión';
      btn.onclick = cerrarSesion;
    } else {
      btn.textContent = isEn ? 'Sign in' : 'Iniciar sesión';
      btn.title = '';
      btn.onclick = () => mostrarModalAuth('login');
    }
  }

  /* ── Modal de autenticación ── */
  function mostrarModalAuth(modo) {
    document.getElementById('auth-modal')?.remove();
    const isEn = window.MC?.lang === 'en';
    const esLogin = modo !== 'registro';

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = `
      <div style="background:#0b2a2b;border:1px solid rgba(201,122,75,0.3);padding:40px;max-width:420px;width:100%;position:relative;box-sizing:border-box;">
        <button onclick="document.getElementById('auth-modal').remove()"
          style="position:absolute;top:16px;right:16px;background:none;border:none;color:#e09065;font-size:1.5rem;cursor:pointer;line-height:1;">✕</button>
        <h2 style="font-family:var(--font-display,serif);color:#f3ece1;margin:0 0 8px;font-size:1.6rem;font-weight:300;">
          ${esLogin ? (isEn ? 'Sign In' : 'Iniciar sesión') : (isEn ? 'Create account' : 'Crear cuenta')}
        </h2>
        <p style="color:rgba(245,237,224,0.45);font-size:0.82rem;margin:0 0 24px;">
          ${esLogin
            ? (isEn ? 'Access your orders and purchases.' : 'Accede a tus pedidos y compras.')
            : (isEn ? 'Create your account to shop.' : 'Crea tu cuenta para comprar.')}
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input id="auth-email" type="email" placeholder="${isEn ? 'Email' : 'Correo electrónico'}" autocomplete="email"
            style="background:#103b3c;border:1px solid rgba(201,122,75,0.3);color:#f3ece1;padding:12px 16px;font-size:0.9rem;width:100%;box-sizing:border-box;outline:none;">
          <input id="auth-pass" type="password" placeholder="${isEn ? 'Password' : 'Contraseña'}" autocomplete="current-password"
            style="background:#103b3c;border:1px solid rgba(201,122,75,0.3);color:#f3ece1;padding:12px 16px;font-size:0.9rem;width:100%;box-sizing:border-box;outline:none;">
        </div>
        <p id="auth-error" style="color:#e09065;font-size:0.8rem;margin:10px 0 0;display:none;"></p>
        <button id="auth-submit-btn"
          style="margin-top:20px;width:100%;background:#c97a4b;color:#0b2a2b;border:none;padding:14px;font-size:0.82rem;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;font-weight:bold;">
          ${esLogin ? (isEn ? 'SIGN IN' : 'INGRESAR') : (isEn ? 'CREATE ACCOUNT' : 'CREAR CUENTA')}
        </button>
        <p style="text-align:center;margin:16px 0 0;font-size:0.8rem;color:rgba(245,237,224,0.45);">
          ${esLogin
            ? `${isEn ? "Don't have an account?" : '¿No tienes cuenta?'} <a href="#" id="auth-switch" style="color:#e09065;">${isEn ? 'Create one' : 'Crear una'}</a>`
            : `${isEn ? 'Already have an account?' : '¿Ya tienes cuenta?'} <a href="#" id="auth-switch" style="color:#e09065;">${isEn ? 'Sign in' : 'Iniciar sesión'}</a>`}
        </p>
      </div>`;
    document.body.appendChild(modal);

    const emailEl = document.getElementById('auth-email');
    const passEl  = document.getElementById('auth-pass');
    const errEl   = document.getElementById('auth-error');
    const btn     = document.getElementById('auth-submit-btn');
    const sw      = document.getElementById('auth-switch');

    const submit = esLogin
      ? () => loginConEmail(emailEl, passEl, errEl, btn, isEn)
      : () => registrarConEmail(emailEl, passEl, errEl, btn, isEn);

    btn.addEventListener('click', submit);
    passEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    sw.addEventListener('click', e => { e.preventDefault(); mostrarModalAuth(esLogin ? 'registro' : 'login'); });

    emailEl.focus();
  }
  window.mostrarModalAuth = mostrarModalAuth;

  async function loginConEmail(emailEl, passEl, errEl, btn, isEn) {
    const email = emailEl.value.trim();
    const pass  = passEl.value;
    if (!email || !pass) { mostrarError(errEl, isEn ? 'Fill in all fields.' : 'Completa todos los campos.'); return; }
    btn.disabled = true;
    btn.textContent = isEn ? 'Signing in…' : 'Ingresando…';
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
    if (error) {
      btn.disabled = false;
      btn.textContent = isEn ? 'SIGN IN' : 'INGRESAR';
      mostrarError(errEl, isEn ? 'Incorrect email or password.' : 'Correo o contraseña incorrectos.');
      return;
    }
    document.getElementById('auth-modal')?.remove();
    if (window.MC) window.MC.showToast(isEn ? 'Welcome!' : '¡Bienvenido/a!', '✓');
  }

  async function registrarConEmail(emailEl, passEl, errEl, btn, isEn) {
    const email = emailEl.value.trim();
    const pass  = passEl.value;
    if (!email || !pass) { mostrarError(errEl, isEn ? 'Fill in all fields.' : 'Completa todos los campos.'); return; }
    if (pass.length < 6) { mostrarError(errEl, isEn ? 'Password must be at least 6 characters.' : 'La contraseña debe tener mínimo 6 caracteres.'); return; }
    btn.disabled = true;
    btn.textContent = isEn ? 'Creating…' : 'Creando…';
    const { error } = await supabaseClient.auth.signUp({ email, password: pass });
    if (error) {
      btn.disabled = false;
      btn.textContent = isEn ? 'CREATE ACCOUNT' : 'CREAR CUENTA';
      mostrarError(errEl, error.message);
      return;
    }
    document.getElementById('auth-modal')?.remove();
    if (window.MC) window.MC.showToast(isEn ? 'Account created! Check your email to confirm.' : 'Cuenta creada. Revisa tu correo para confirmar.', '✉');
  }

  async function cerrarSesion() {
    await supabaseClient.auth.signOut();
    const isEn = window.MC?.lang === 'en';
    if (window.MC) window.MC.showToast(isEn ? 'Session closed.' : 'Sesión cerrada.', '✓');
  }
  window.cerrarSesion = cerrarSesion;

  function mostrarError(errEl, msg) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', initAuth);
})();
