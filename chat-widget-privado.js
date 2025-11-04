/* CHAT WIDGET WEBHOOK - IAutomatiq */
/* Versión: 2.3 - SÓLO TEXTO */
/* Cambios: Eliminada toda la lógica del calendario */
/* ====================================== */

(function() {
  'use strict';

  /* ====================================== */
  /* CONFIGURACIÓN DEL CHAT */
  /* ====================================== */
  const CONFIG = {
    webhookUrl: 'https://n8n-stack-n8n.bnilvd.easypanel.host/webhook/chat-legal-profesional',
    errorMessage: 'Lo siento, hubo un problema. Por favor intenta de nuevo.',
    tooltipDelay: 1000,
    autoOpen: false,
    autoOpenDelay: 2000,
    maxMessageLength: 500,
    requestTimeout: 120000,
    chatTitle: 'Asistente Legal (Privado)',
    welcomeMessage: 'Soy tu Asistente Profesional. En que puedo ayudarte?',
    tooltipMessage: 'Hola 👋 ¿Necesitas ayuda?',
    inputPlaceholder: 'Escribe tu consulta aquí...',
    botAvatar: 'animated_logo',
    userAvatar: 'https://www.svgrepo.com/show/532363/user-alt-1.svg',
    buttonIcon: 'https://www.svgrepo.com/show/339963/chat-bot.svg',
    headerAvatar: 'animated_logo',
    colors: {
      buttonBackground: '#3848a5ff',
      buttonIcon: '#d5f05cff',
      tooltipBackground: '#ffffff',
      tooltipText: '#5b59a6',
      headerGradientStart: '#773EE2',
      headerGradientEnd: '#008BDE',
      botMessageBackground: '#5700faff',
      botMessageText: '#FFF',
      userMessageBackground: '#00FF6B',
      userMessageText: '#6C757D',
      inputBackground: '#ffffff',
      inputText: '#1e1e1f',
      inputBorder: '#e0e0e0',
      inputBorderFocus: '#011066ff',
      sendButtonBackground: '#773EE2',
      sendButtonHover: '#008BDE',
      scrollbarThumb: '#888',
      scrollbarThumbHover: '#555',
      promptBorder: '#e0e0e0',
      promptBorderHover: '#a8f958',
    },
    sizes: {
      buttonSize: 80,
      buttonBottom: 30,
      buttonLeft: 130,
      chatWidth: 400,
      chatHeight: 650,
      chatBottom: 110,
      chatLeft: 30,
    },
    theme: {
      baseFontSize: '14px',
      titleFontSize: '16px',
      titleFontWeight: '600',
      promptFontSize: '13px',
      mainBorderRadius: '16px',
      messageBubbleBotRadius: '15px 15px 15px 4px',
      messageBubbleUserRadius: '15px 4px 15px 15px',
      promptBorderRadius: '8px',
      inputBorderRadius: '20px',
      borderWidth: '2px',
      boxShadowButton: '0 4px 12px rgba(0, 0, 0, 0.15)',
      boxShadowButtonHover: '0 6px 16px rgba(0, 0, 0, 0.2)',
      boxShadowWindow: '0 5px 40px rgba(0, 0, 0, 0.16)',
      headerPadding: '16px',
      messagesAreaPadding: '15px',
      messageBubblePadding: '12px 16px',
      inputAreaPadding: '15px',
      inputPadding: '10px 15px',
      promptPadding: '10px 15px',
      messagesGap: '10px',
      messagePartsGap: '10px',
      inputAreaGap: '8px',
      promptsGap: '8px',
      messageMaxWidth: '80%',
      headerAvatarSize: '40px',
      messageAvatarSize: '32px',
      sendButtonSize: '40px',
      closeButtonSize: '30px',
      scrollbarWidth: '6px',
      typingDotSize: '8px',
      typingIndicatorMinWidth: '80px',
      typingSpeed: 4,
      transitionDuration: '0.2s',
    },
    metadata: {
      source: 'website-privado',
      version: '2.3',
      widget: 'estudio-legal-privado',
      systemPrompt: ''
    }
  };

  const styles = `
    #iautomatiq-chat-widget-privado * { margin: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #iautomatiq-tooltip-privado { position: fixed; bottom: ${CONFIG.sizes.buttonBottom + 10}px; left: ${CONFIG.sizes.buttonLeft + CONFIG.sizes.buttonSize + 20}px; background-color: ${CONFIG.colors.tooltipBackground}; color: ${CONFIG.colors.tooltipText}; padding: 10px 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); font-size: ${CONFIG.theme.baseFontSize}; white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 9997; }
    #iautomatiq-tooltip-privado.show { opacity: 1; visibility: visible; }
    #iautomatiq-tooltip-privado::after { content: ''; position: absolute; left: -8px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-right: 8px solid ${CONFIG.colors.tooltipBackground}; border-top: 8px solid transparent; border-bottom: 8px solid transparent; }
    #iautomatiq-chat-button-privado { position: fixed; bottom: ${CONFIG.sizes.buttonBottom}px; left: ${CONFIG.sizes.buttonLeft}px; width: ${CONFIG.sizes.buttonSize}px; height: ${CONFIG.sizes.buttonSize}px; background-color: ${CONFIG.colors.buttonBackground}; border-radius: 50%; border: none; cursor: pointer; box-shadow: ${CONFIG.theme.boxShadowButton}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 9998; }
    #iautomatiq-chat-button-privado:hover { transform: scale(1.15); box-shadow: ${CONFIG.theme.boxShadowButtonHover}; }
    #iautomatiq-chat-button-privado img { width: ${CONFIG.sizes.buttonSize * 0.6}px; height: ${CONFIG.sizes.buttonSize * 0.6}px; filter: brightness(0.2); }
    #iautomatiq-chat-window-privado { position: fixed; bottom: ${CONFIG.sizes.chatBottom}px; left: ${CONFIG.sizes.chatLeft}px; width: ${CONFIG.sizes.chatWidth}px; height: ${CONFIG.sizes.chatHeight}px; background-color: #ffffff; border-radius: ${CONFIG.theme.mainBorderRadius}; box-shadow: ${CONFIG.theme.boxShadowWindow}; display: none; flex-direction: column; overflow: hidden; z-index: 9999; animation: slideUp 0.3s ease; }
    #iautomatiq-chat-window-privado.open { display: flex; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .iautomatiq-chat-header-privado { background: linear-gradient(135deg, ${CONFIG.colors.headerGradientStart} 0%, ${CONFIG.colors.headerGradientEnd} 100%); color: white; padding: ${CONFIG.theme.headerPadding}; display: flex; align-items: center; justify-content: space-between; }
    .iautomatiq-header-content-privado { display: flex; align-items: center; gap: 12px; }
    .iautomatiq-chat-avatar-privado { width: ${CONFIG.theme.headerAvatarSize}; height: ${CONFIG.theme.headerAvatarSize}; border-radius: 50%; background-color: white; padding: 5px; display: flex; align-items: center; justify-content: center; }
    .iautomatiq-chat-title-privado { font-size: ${CONFIG.theme.titleFontSize}; font-weight: ${CONFIG.theme.titleFontWeight}; }
    .iautomatiq-chat-close-privado { background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: ${CONFIG.theme.closeButtonSize}; height: ${CONFIG.theme.closeButtonSize}; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background-color ${CONFIG.theme.transitionDuration}; }
    .iautomatiq-chat-close-privado:hover { background-color: rgba(255, 255, 255, 0.1); }
    .iautomatiq-chat-messages-privado { flex: 1; overflow-y: auto; padding: ${CONFIG.theme.messagesAreaPadding}; background-color: #f8f9fa; display: flex; flex-direction: column; gap: ${CONFIG.theme.messagesGap}; }
    .iautomatiq-chat-messages-privado::-webkit-scrollbar { width: ${CONFIG.theme.scrollbarWidth}; }
    .iautomatiq-chat-messages-privado::-webkit-scrollbar-track { background: #f1f1f1; }
    .iautomatiq-chat-messages-privado::-webkit-scrollbar-thumb { background: ${CONFIG.colors.scrollbarThumb}; border-radius: 3px; }
    .iautomatiq-chat-messages-privado::-webkit-scrollbar-thumb:hover { background: ${CONFIG.colors.scrollbarThumbHover}; }
    .iautomatiq-message-privado { display: flex; gap: ${CONFIG.theme.messagePartsGap}; max-width: ${CONFIG.theme.messageMaxWidth}; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .iautomatiq-message-privado.bot { align-self: flex-start; }
    .iautomatiq-message-privado.bot .iautomatiq-message-bubble-privado { background-color: ${CONFIG.colors.botMessageBackground}; color: ${CONFIG.colors.botMessageText}; border-radius: ${CONFIG.theme.messageBubbleBotRadius}; }
    .iautomatiq-message-privado.user { align-self: flex-end; flex-direction: row-reverse; }
    .iautomatiq-message-privado.user .iautomatiq-message-bubble-privado { background-color: ${CONFIG.colors.userMessageBackground}; color: ${CONFIG.colors.userMessageText}; border-radius: ${CONFIG.theme.messageBubbleUserRadius}; }
    .iautomatiq-message-avatar-privado { width: ${CONFIG.theme.messageAvatarSize}; height: ${CONFIG.theme.messageAvatarSize}; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .iautomatiq-message-avatar-privado img { width: 100%; height: 100%; }
    .iautomatiq-message-bubble-privado { padding: ${CONFIG.theme.messageBubblePadding}; font-size: ${CONFIG.theme.baseFontSize}; line-height: 1.4; word-wrap: break-word; white-space: pre-wrap; }
    .iautomatiq-chat-input-area-privado { padding: ${CONFIG.theme.inputAreaPadding}; background-color: white; border-top: ${CONFIG.theme.borderWidth} solid ${CONFIG.colors.inputBorder}; display: flex; gap: ${CONFIG.theme.inputAreaGap}; align-items: center; }
    .iautomatiq-chat-input-privado { flex: 1; border: ${CONFIG.theme.borderWidth} solid ${CONFIG.colors.inputBorder}; border-radius: ${CONFIG.theme.inputBorderRadius}; padding: ${CONFIG.theme.inputPadding}; font-size: ${CONFIG.theme.baseFontSize}; outline: none; transition: border-color ${CONFIG.theme.transitionDuration}; color: ${CONFIG.colors.inputText}; background-color: ${CONFIG.colors.inputBackground}; }
    .iautomatiq-chat-input-privado:focus { border-color: ${CONFIG.colors.inputBorderFocus}; }
    .iautomatiq-chat-input-privado::placeholder { color: #999; }
    .iautomatiq-chat-send-button-privado { width: ${CONFIG.theme.sendButtonSize}; height: ${CONFIG.theme.sendButtonSize}; border-radius: 50%; border: none; background-color: ${CONFIG.colors.sendButtonBackground}; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all ${CONFIG.theme.transitionDuration}; flex-shrink: 0; }
    .iautomatiq-chat-send-button-privado:hover { background-color: ${CONFIG.colors.sendButtonHover}; transform: scale(1.05); }
    .iautomatiq-chat-send-button-privado:disabled { background-color: #ccc; cursor: not-allowed; }
    .iautomatiq-typing-indicator-privado { display: flex; align-items: center; justify-content: center; gap: ${CONFIG.theme.typingDotSize}; padding: ${CONFIG.theme.messageBubblePadding}; background-color: ${CONFIG.colors.botMessageBackground}; border-radius: ${CONFIG.theme.messageBubbleBotRadius}; width: fit-content; min-width: ${CONFIG.theme.typingIndicatorMinWidth}; }
    .iautomatiq-typing-dot-privado { width: ${CONFIG.theme.typingDotSize}; height: ${CONFIG.theme.typingDotSize}; border-radius: 50%; background-color: white; animation: typing 1.4s infinite; }
    .iautomatiq-typing-dot-privado:nth-child(2) { animation-delay: 0.2s; }
    .iautomatiq-typing-dot-privado:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
    .cw-logo-icon-privado { width: 45px; height: 45px; position: relative; display: flex; align-items: center; justify-content: center; }
    .cw-logo-square1-privado { width: 28px; height: 28px; background: linear-gradient(135deg, ${CONFIG.colors.headerGradientStart}, ${CONFIG.colors.userMessageBackground}); position: absolute; top: 0; left: 0; border-radius: 4px; animation: rotate3d 4s ease-in-out infinite; }
    .cw-logo-square2-privado { width: 20px; height: 20px; background: linear-gradient(135deg, ${CONFIG.colors.headerGradientEnd}, ${CONFIG.colors.userMessageBackground}); position: absolute; bottom: 0; right: 0; border-radius: 3px; animation: rotate3d 4s ease-in-out infinite reverse; }
    @keyframes rotate3d { 0% { transform: rotateX(0deg) rotateY(0deg); } 50% { transform: rotateX(180deg) rotateY(180deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }
    @media (max-width: 480px) {
      #iautomatiq-chat-window-privado { width: calc(100% - 20px); height: calc(100% - 120px); left: 10px; bottom: 90px; }
      #iautomatiq-tooltip-privado { left: ${CONFIG.sizes.buttonLeft + CONFIG.sizes.buttonSize + 10}px; font-size: 12px; }
    }
  `;

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'iautomatiq-chat-widget-privado';
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    container.innerHTML = `
      <div id="iautomatiq-tooltip-privado">${CONFIG.tooltipMessage}</div>
      <button id="iautomatiq-chat-button-privado" aria-label="Abrir chat"><img src="${CONFIG.buttonIcon}" alt="Chat"></button>
      <div id="iautomatiq-chat-window-privado">
        <div class="iautomatiq-chat-header-privado">
          <div class="iautomatiq-header-content-privado">
            <div id="header-avatar-container-privado"></div>
            <div class="iautomatiq-chat-title-privado">${CONFIG.chatTitle}</div>
          </div>
          <button class="iautomatiq-chat-close-privado" id="iautomatiq-chat-close-privado" aria-label="Cerrar chat">&times;</button>
        </div>
        <div class="iautomatiq-chat-messages-privado" id="iautomatiq-chat-messages-privado">
          <div class="iautomatiq-message-privado bot">
            <div class="iautomatiq-message-avatar-privado"></div>
            <div class="iautomatiq-message-bubble-privado">${CONFIG.welcomeMessage}</div>
          </div>
        </div>
        <!-- Starter prompts removed for privado widget (no prompts configured) -->
        <div class="iautomatiq-starter-prompts-privado" style="display:none"></div>
        <div class="iautomatiq-chat-input-area-privado">
          <input type="text" class="iautomatiq-chat-input-privado" id="iautomatiq-chat-input-privado" placeholder="${CONFIG.inputPlaceholder}" maxlength="${CONFIG.maxMessageLength}" autocomplete="off">
          <button class="iautomatiq-chat-send-button-privado" id="iautomatiq-chat-send-privado" aria-label="Enviar mensaje">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }

  function createAvatar(source, size, isHeader = false) {
    const avatarContainer = document.createElement('div');
    avatarContainer.className = isHeader ? 'iautomatiq-chat-avatar-privado' : 'iautomatiq-message-avatar-privado';
    if (source === 'animated_logo') {
      const scale = parseInt(size) / 45;
      avatarContainer.style.padding = '0';
      avatarContainer.style.background = 'none';
      avatarContainer.innerHTML = `<div class="cw-logo-icon-privado" style="transform: scale(${scale});"><div class="cw-logo-square1-privado"></div><div class="cw-logo-square2-privado"></div></div>`;
    } else {
      avatarContainer.innerHTML = `<img src="${source}" alt="Avatar">`;
    }
    return avatarContainer;
  }

  let isOpen = false;
  let conversationHistory = [];
  let isTypingIndicatorActive = false;

  function getSessionId() {
    const INACTIVITY_LIMIT = 30 * 60 * 1000;
    let sessionId = localStorage.getItem('iautomatiq_sessionId_privado');
    let lastActivity = localStorage.getItem('iautomatiq_lastActivity_privado');
    
    const now = Date.now();
    
    if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > INACTIVITY_LIMIT) {
      sessionId = `session_privado_${now}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('iautomatiq_sessionId_privado', sessionId);
    }
    
    localStorage.setItem('iautomatiq_lastActivity_privado', now.toString());
    return sessionId;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('iautomatiq-typing-indicator-privado');
    if (indicator) indicator.remove();
    isTypingIndicatorActive = false;
  }

function addMessage(text, sender) {
    const chatMessages = document.getElementById('iautomatiq-chat-messages-privado');
    
    sender = sender || 'bot';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `iautomatiq-message-privado ${sender}`;
    const source = sender === 'bot' ? CONFIG.botAvatar : CONFIG.userAvatar;
    const avatar = createAvatar(source, CONFIG.theme.messageAvatarSize);
    const bubble = document.createElement('div');
    bubble.className = 'iautomatiq-message-bubble-privado';
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    if (sender === 'user') {
      bubble.textContent = text;
    } else {
      let i = 0;
      bubble.textContent = "";
      function type() {
        if (i < text.length) {
          bubble.textContent += text.charAt(i);
          i++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          setTimeout(type, CONFIG.theme.typingSpeed);
        }
      }
      type();
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
    conversationHistory.push({ text, sender, timestamp: Date.now() });
  }

  function initChat() {
    createWidget();
    const chatButton = document.getElementById('iautomatiq-chat-button-privado');
    const chatWindow = document.getElementById('iautomatiq-chat-window-privado');
    const chatClose = document.getElementById('iautomatiq-chat-close-privado');
    const chatInput = document.getElementById('iautomatiq-chat-input-privado');
    const chatSend = document.getElementById('iautomatiq-chat-send-privado');
    const chatMessages = document.getElementById('iautomatiq-chat-messages-privado');
    const chatTooltip = document.getElementById('iautomatiq-tooltip-privado');

    document.getElementById('header-avatar-container-privado').appendChild(createAvatar(CONFIG.headerAvatar, CONFIG.theme.headerAvatarSize, true));
    chatMessages.querySelector('.iautomatiq-message-avatar-privado').appendChild(createAvatar(CONFIG.botAvatar, CONFIG.theme.messageAvatarSize).firstChild);

    function toggleChat() {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      chatTooltip.classList.remove('show');
      if (isOpen) {
        chatWindow.style.display = 'flex';
        chatInput.focus();
      } else {
        chatWindow.style.display = 'none';
      }
    }

    function showTypingIndicator() {
      if (isTypingIndicatorActive) return;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'iautomatiq-message-privado bot';
      typingDiv.id = 'iautomatiq-typing-indicator-privado';
      const avatar = createAvatar(CONFIG.botAvatar, CONFIG.theme.messageAvatarSize);
      const indicator = document.createElement('div');
      indicator.className = 'iautomatiq-typing-indicator-privado';
      indicator.innerHTML = '<div class="iautomatiq-typing-dot-privado"></div><div class="iautomatiq-typing-dot-privado"></div><div class="iautomatiq-typing-dot-privado"></div>';
      typingDiv.appendChild(avatar);
      typingDiv.appendChild(indicator);
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      isTypingIndicatorActive = true;
    }

    function handleUserMessage(message) {
      if (!message.trim()) return;
      addMessage(message, 'user');
      chatInput.value = '';
      chatSend.disabled = true;
      showTypingIndicator();
      sendMessageToServer(message);
    }

    async function sendMessageToServer(message) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

      try {
        const payload = {
          chatInput: message,
          sessionId: getSessionId(),
          action: 'sendMessage',
          ...CONFIG.metadata
        };

        const response = await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        
        if (data && data.error) throw new Error(data.message || 'Error en el servidor');
        
        const botResponse = (data.output || data.message || data.response || '').trim();
        if (!botResponse) throw new Error('Respuesta vacía del servidor');
        
        hideTypingIndicator();
        addMessage(botResponse, 'bot');
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error en chat-widget-privado:', error);
        hideTypingIndicator();
        addMessage(CONFIG.errorMessage, 'bot');
      } finally {
        chatSend.disabled = false;
        chatInput.focus();
      }
    }

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', () => handleUserMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage(chatInput.value);
      }
    });
    chatInput.addEventListener('input', () => { chatSend.disabled = !chatInput.value.trim(); });
    chatButton.addEventListener('mouseenter', () => {
      if (!isOpen) setTimeout(() => { if (!isOpen) chatTooltip.classList.add('show'); }, CONFIG.tooltipDelay);
    });
    chatButton.addEventListener('mouseleave', () => chatTooltip.classList.remove('show'));

    if (CONFIG.autoOpen) setTimeout(toggleChat, CONFIG.autoOpenDelay);
    chatSend.disabled = true;
    console.log('✅ Chat Widget Privado v2.3 - SÓLO TEXTO cargado');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

})();