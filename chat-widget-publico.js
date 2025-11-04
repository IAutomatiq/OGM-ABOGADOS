/* CHAT WIDGET WEBHOOK - IAutomatiq */
/* Versión: 2.2 - CON CALENDARIO */
/* Cambios: Integración iframe calendario */
/* ====================================== */

(function() {
  'use strict';

  /* ====================================== */
  /* CONFIGURACIÓN DEL CHAT */
  /* ====================================== */
  const CONFIG = {
    webhookUrl: 'https://n8n-stack-n8n.bnilvd.easypanel.host/webhook/chat-legal',
    calendarUrl: './calendario-booking.html', // URL del calendario
    errorMessage: 'Lo siento, hubo un problema. Por favor intenta de nuevo.',
    tooltipDelay: 1000,
    autoOpen: false,
    autoOpenDelay: 2000,
    maxMessageLength: 500,
    requestTimeout: 120000,
    chatTitle: 'Estudio Legal Mendoza',
    welcomeMessage: 'Soy tu asistente de OGM Abogados. Te puedo dar una primera orientación general. ¿En qué puedo ayudarte hoy?',
    tooltipMessage: 'Hola 👋 ¿Cómo podemos ayudarte?',
    inputPlaceholder: 'Escribe tu consulta aquí...',
    starterPrompts: [
      '¿Qué servicios ofrecen?',
      'Necesito ayuda con un divorcio',
      'Me despidieron, ¿qué hago?',
      'Quiero agendar una consulta'
    ],
    botAvatar: 'animated_logo',
    userAvatar: 'https://www.svgrepo.com/show/532363/user-alt-1.svg',
    buttonIcon: 'https://www.svgrepo.com/show/339963/chat-bot.svg',
    headerAvatar: 'animated_logo',
    colors: {
      buttonBackground: '#a8f958',
      buttonIcon: '#373434',
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
      buttonRight: 130,
      chatWidth: 400,
      chatHeight: 650,
      chatBottom: 110,
      chatRight: 30,
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
      chunkDelay: 1000,
      hoverScaleEffect: '1.5',
      transitionDuration: '0.2s',
    },
    metadata: {
      source: 'website',
      version: '2.2',
      widget: 'estudio-legal',
      systemPrompt: ''
    }
  };

  const styles = `
    #iautomatiq-chat-widget * { margin: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; }
    #iautomatiq-tooltip { position: fixed; bottom: ${CONFIG.sizes.buttonBottom + 10}px; right: ${CONFIG.sizes.buttonRight + CONFIG.sizes.buttonSize + 20}px; background-color: ${CONFIG.colors.tooltipBackground}; color: ${CONFIG.colors.tooltipText}; padding: 10px 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); font-size: ${CONFIG.theme.baseFontSize}; white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 9997; }
    #iautomatiq-tooltip.show { opacity: 1; visibility: visible; }
    #iautomatiq-tooltip::after { content: ''; position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 8px solid ${CONFIG.colors.tooltipBackground}; border-top: 8px solid transparent; border-bottom: 8px solid transparent; }
    #iautomatiq-chat-button { position: fixed; bottom: ${CONFIG.sizes.buttonBottom}px; right: ${CONFIG.sizes.buttonRight}px; width: ${CONFIG.sizes.buttonSize}px; height: ${CONFIG.sizes.buttonSize}px; background-color: ${CONFIG.colors.buttonBackground}; border-radius: 50%; border: none; cursor: pointer; box-shadow: ${CONFIG.theme.boxShadowButton}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 9998; }
    #iautomatiq-chat-button:hover { transform: scale(1.15); box-shadow: ${CONFIG.theme.boxShadowButtonHover}; }
    #iautomatiq-chat-button img { width: ${CONFIG.sizes.buttonSize * 0.6}px; height: ${CONFIG.sizes.buttonSize * 0.6}px; filter: brightness(0.2); }
    #iautomatiq-chat-window { position: fixed; bottom: ${CONFIG.sizes.chatBottom}px; right: ${CONFIG.sizes.chatRight}px; width: ${CONFIG.sizes.chatWidth}px; height: ${CONFIG.sizes.chatHeight}px; background-color: #ffffff; border-radius: ${CONFIG.theme.mainBorderRadius}; box-shadow: ${CONFIG.theme.boxShadowWindow}; display: none; flex-direction: column; overflow: hidden; z-index: 9999; animation: slideUp 0.3s ease; }
    #iautomatiq-chat-window.open { display: flex; }
    #iautomatiq-calendar-iframe { 
      position: fixed; 
      bottom: ${CONFIG.sizes.chatBottom}px;
      right: ${CONFIG.sizes.chatRight}px;
      width: ${CONFIG.sizes.chatWidth}px;
      height: ${CONFIG.sizes.chatHeight}px;
      border: none;
      border-radius: ${CONFIG.theme.mainBorderRadius};
      box-shadow: ${CONFIG.theme.boxShadowWindow};
      background: var(--color-background, #f8f9fa);
      display: none; 
      z-index: 10000; 
      animation: slideUp 0.3s ease; 
    }
    #iautomatiq-calendar-iframe.open { 
      display: block; 
    }
    @keyframes slideUp { 
      from { opacity: 0; transform: translateY(20px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    .iautomatiq-chat-header { background: linear-gradient(135deg, ${CONFIG.colors.headerGradientStart} 0%, ${CONFIG.colors.headerGradientEnd} 100%); color: white; padding: ${CONFIG.theme.headerPadding}; display: flex; align-items: center; justify-content: space-between; }
    .iautomatiq-header-content { display: flex; align-items: center; gap: 12px; }
    .iautomatiq-chat-avatar { width: ${CONFIG.theme.headerAvatarSize}; height: ${CONFIG.theme.headerAvatarSize}; border-radius: 50%; background-color: white; padding: 5px; display: flex; align-items: center; justify-content: center; }
    .iautomatiq-chat-title { font-size: ${CONFIG.theme.titleFontSize}; font-weight: ${CONFIG.theme.titleFontWeight}; }
    .iautomatiq-chat-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: ${CONFIG.theme.closeButtonSize}; height: ${CONFIG.theme.closeButtonSize}; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background-color ${CONFIG.theme.transitionDuration}; }
    .iautomatiq-chat-close:hover { background-color: rgba(255, 255, 255, 0.1); }
    .iautomatiq-chat-messages { flex: 1; overflow-y: auto; padding: ${CONFIG.theme.messagesAreaPadding}; background-color: #f8f9fa; display: flex; flex-direction: column; gap: ${CONFIG.theme.messagesGap}; }
    .iautomatiq-chat-messages::-webkit-scrollbar { width: ${CONFIG.theme.scrollbarWidth}; }
    .iautomatiq-chat-messages::-webkit-scrollbar-track { background: #f1f1f1; }
    .iautomatiq-chat-messages::-webkit-scrollbar-thumb { background: ${CONFIG.colors.scrollbarThumb}; border-radius: 3px; }
    .iautomatiq-chat-messages::-webkit-scrollbar-thumb:hover { background: ${CONFIG.colors.scrollbarThumbHover}; }
    .iautomatiq-message { display: flex; gap: ${CONFIG.theme.messagePartsGap}; max-width: ${CONFIG.theme.messageMaxWidth}; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .iautomatiq-message.bot { align-self: flex-start; }
    .iautomatiq-message.bot .iautomatiq-message-bubble { background-color: ${CONFIG.colors.botMessageBackground}; color: ${CONFIG.colors.botMessageText}; border-radius: ${CONFIG.theme.messageBubbleBotRadius}; }
    .iautomatiq-message.user { align-self: flex-end; flex-direction: row-reverse; }
    .iautomatiq-message.user .iautomatiq-message-bubble { background-color: ${CONFIG.colors.userMessageBackground}; color: ${CONFIG.colors.userMessageText}; border-radius: ${CONFIG.theme.messageBubbleUserRadius}; }
    .iautomatiq-message-avatar { width: ${CONFIG.theme.messageAvatarSize}; height: ${CONFIG.theme.messageAvatarSize}; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .iautomatiq-message-avatar img { width: 100%; height: 100%; }
    .iautomatiq-message-bubble { padding: ${CONFIG.theme.messageBubblePadding}; font-size: ${CONFIG.theme.baseFontSize}; line-height: 1.4; word-wrap: break-word; white-space: pre-wrap; }
    .iautomatiq-starter-prompts { display: flex; flex-direction: column; gap: ${CONFIG.theme.promptsGap}; padding: ${CONFIG.theme.promptPadding}; background-color: #f8f9fa; }
    .iautomatiq-starter-prompt { background-color: white; border: ${CONFIG.theme.borderWidth} solid ${CONFIG.colors.promptBorder}; border-radius: ${CONFIG.theme.promptBorderRadius}; padding: ${CONFIG.theme.promptPadding}; font-size: ${CONFIG.theme.promptFontSize}; color: #333; cursor: pointer; transition: all ${CONFIG.theme.transitionDuration}; text-align: left; }
    .iautomatiq-starter-prompt:hover { background-color: #f0f0f0; border-color: ${CONFIG.colors.promptBorderHover}; transform: translateX(4px); }
    .iautomatiq-chat-input-area { padding: ${CONFIG.theme.inputAreaPadding}; background-color: white; border-top: ${CONFIG.theme.borderWidth} solid ${CONFIG.colors.inputBorder}; display: flex; gap: ${CONFIG.theme.inputAreaGap}; align-items: center; }
    .iautomatiq-chat-input { flex: 1; border: ${CONFIG.theme.borderWidth} solid ${CONFIG.colors.inputBorder}; border-radius: ${CONFIG.theme.inputBorderRadius}; padding: ${CONFIG.theme.inputPadding}; font-size: ${CONFIG.theme.baseFontSize}; outline: none; transition: border-color ${CONFIG.theme.transitionDuration}; color: ${CONFIG.colors.inputText}; background-color: ${CONFIG.colors.inputBackground}; }
    .iautomatiq-chat-input:focus { border-color: ${CONFIG.colors.inputBorderFocus}; }
    .iautomatiq-chat-input::placeholder { color: #999; }
    .iautomatiq-chat-send-button { width: ${CONFIG.theme.sendButtonSize}; height: ${CONFIG.theme.sendButtonSize}; border-radius: 50%; border: none; background-color: ${CONFIG.colors.sendButtonBackground}; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all ${CONFIG.theme.transitionDuration}; flex-shrink: 0; }
    .iautomatiq-chat-send-button:hover { background-color: ${CONFIG.colors.sendButtonHover}; transform: scale(1.05); }
    .iautomatiq-chat-send-button:disabled { background-color: #ccc; cursor: not-allowed; }
    .iautomatiq-typing-indicator { display: flex; align-items: center; justify-content: center; gap: ${CONFIG.theme.typingDotSize}; padding: ${CONFIG.theme.messageBubblePadding}; background-color: ${CONFIG.colors.botMessageBackground}; border-radius: ${CONFIG.theme.messageBubbleBotRadius}; width: fit-content; min-width: ${CONFIG.theme.typingIndicatorMinWidth}; }
    .iautomatiq-typing-dot { width: ${CONFIG.theme.typingDotSize}; height: ${CONFIG.theme.typingDotSize}; border-radius: 50%; background-color: white; animation: typing 1.4s infinite; }
    .iautomatiq-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .iautomatiq-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
    .cw-logo-icon { width: 45px; height: 45px; position: relative; display: flex; align-items: center; justify-content: center; }
    .cw-logo-square1 { width: 28px; height: 28px; background: linear-gradient(135deg, ${CONFIG.colors.headerGradientStart}, ${CONFIG.colors.userMessageBackground}); position: absolute; top: 0; left: 0; border-radius: 4px; animation: rotate3d 4s ease-in-out infinite; }
    .cw-logo-square2 { width: 20px; height: 20px; background: linear-gradient(135deg, ${CONFIG.colors.headerGradientEnd}, ${CONFIG.colors.userMessageBackground}); position: absolute; bottom: 0; right: 0; border-radius: 3px; animation: rotate3d 4s ease-in-out infinite reverse; }
    @keyframes rotate3d { 0% { transform: rotateX(0deg) rotateY(0deg); } 50% { transform: rotateX(180deg) rotateY(180deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }
    @media (max-width: 480px) {
      #iautomatiq-chat-window { width: calc(100% - 20px); height: calc(100% - 120px); right: 10px; bottom: 90px; }
      #iautomatiq-calendar-iframe { width: calc(100% - 20px); height: calc(100% - 120px); right: 10px; bottom: 90px; }
      #iautomatiq-tooltip { right: ${CONFIG.sizes.buttonRight + CONFIG.sizes.buttonSize + 10}px; font-size: 12px; }
    }
  `;

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'iautomatiq-chat-widget';
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    container.innerHTML = `
      <div id=\"iautomatiq-tooltip\">${CONFIG.tooltipMessage}</div>
      <button id=\"iautomatiq-chat-button\" aria-label=\"Abrir chat\"><img src=\"${CONFIG.buttonIcon}\" alt=\"Chat\"></button>
      <div id=\"iautomatiq-chat-window\">
        <div class=\"iautomatiq-chat-header\">
          <div class=\"iautomatiq-header-content\">
            <div id=\"header-avatar-container\"></div>
            <div class=\"iautomatiq-chat-title\">${CONFIG.chatTitle}</div>
          </div>
          <button class=\"iautomatiq-chat-close\" id=\"iautomatiq-chat-close\" aria-label=\"Cerrar chat\">&times;</button>
        </div>
        <div class=\"iautomatiq-chat-messages\" id=\"iautomatiq-chat-messages\">
          <div class=\"iautomatiq-message bot\">
            <div class=\"iautomatiq-message-avatar\"></div>
            <div class=\"iautomatiq-message-bubble\">${CONFIG.welcomeMessage}</div>
          </div>
        </div>
        <div class=\"iautomatiq-starter-prompts\">
          ${CONFIG.starterPrompts.map(prompt => `<div class=\"iautomatiq-starter-prompt\" data-prompt=\"${prompt}\">${prompt}</div>`).join('')}
        </div>
        <div class=\"iautomatiq-chat-input-area\">
          <input type=\"text\" class=\"iautomatiq-chat-input\" id=\"iautomatiq-chat-input\" placeholder=\"${CONFIG.inputPlaceholder}\" maxlength=\"${CONFIG.maxMessageLength}\" autocomplete=\"off\">
          <button class=\"iautomatiq-chat-send-button\" id=\"iautomatiq-chat-send\" aria-label=\"Enviar mensaje\">➤</button>
        </div>
      </div>
      <iframe id=\"iautomatiq-calendar-iframe\"></iframe>
    `;
    document.body.appendChild(container);
  }

  function createAvatar(source, size, isHeader = false) {
    const avatarContainer = document.createElement('div');
    avatarContainer.className = isHeader ? 'iautomatiq-chat-avatar' : 'iautomatiq-message-avatar';
    if (source === 'animated_logo') {
      const scale = parseInt(size) / 45;
      avatarContainer.style.padding = '0';
      avatarContainer.style.background = 'none';
      avatarContainer.innerHTML = `<div class=\"cw-logo-icon\" style=\"transform: scale(${scale});\"><div class=\"cw-logo-square1\"></div><div class=\"cw-logo-square2\"></div></div>`;
    } else {
      avatarContainer.innerHTML = `<img src=\"${source}\" alt=\"Avatar\">`;
    }
    return avatarContainer;
  }

  // Variables globales
  let isOpen = false;
  let conversationHistory = [];
  let isTypingIndicatorActive = false;
  let calendarIframe = null;

  // Funciones globales
  function getSessionId() {
    const INACTIVITY_LIMIT = 30 * 60 * 1000;
    let sessionId = localStorage.getItem('iautomatiq_sessionId');
    let lastActivity = localStorage.getItem('iautomatiq_lastActivity');
    
    const now = Date.now();
    
    if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > INACTIVITY_LIMIT) {
      sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('iautomatiq_sessionId', sessionId);
    }
    
    localStorage.setItem('iautomatiq_lastActivity', now.toString());
    return sessionId;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('iautomatiq-typing-indicator');
    if (indicator) indicator.remove();
    isTypingIndicatorActive = false;
  }

  function addMessage(text, sender, callback) {
    const chatMessages = document.getElementById('iautomatiq-chat-messages');
    const starterPrompts = document.querySelector('.iautomatiq-starter-prompts');
    
    sender = sender || 'bot';
    if (conversationHistory.length > 0) starterPrompts.style.display = 'none';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `iautomatiq-message ${sender}`;
    const source = sender === 'bot' ? CONFIG.botAvatar : CONFIG.userAvatar;
    const avatar = createAvatar(source, CONFIG.theme.messageAvatarSize);
    const bubble = document.createElement('div');
    bubble.className = 'iautomatiq-message-bubble';
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    if (sender === 'user') {
      bubble.textContent = text;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (callback) callback();
    } else {
      let i = 0;
      bubble.textContent = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
      function type() {
        if (i < text.length) {
          bubble.textContent += text.charAt(i);
          i++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          setTimeout(type, CONFIG.theme.typingSpeed);
        } else {
          if (callback) callback();
        }
      }
      type();
    }
    conversationHistory.push({ text, sender, timestamp: Date.now() });
  }

  /* ====================================== */
  /* FUNCIONES DE CALENDARIO */
  /* ====================================== */
  function openCalendarIframe(clientData) {
    const iframe = document.getElementById('iautomatiq-calendar-iframe');
    const chatWindow = document.getElementById('iautomatiq-chat-window');
    
    // Ocultar chat
    chatWindow.classList.remove('open');
    
    // Construir URL con parámetros
    const params = new URLSearchParams({
      name: clientData.name || '',
      email: clientData.email || '',
      phone: clientData.phone || ''
    });
    
    iframe.src = `${CONFIG.calendarUrl}?${params.toString()}`;
    iframe.classList.add('open');
    calendarIframe = iframe;
    
    console.log('📅 Calendario abierto con datos:', clientData);
  }

  function closeCalendarIframe() {
    console.log('🔄 Iniciando cierre de calendario...');
    
    const iframe = document.getElementById('iautomatiq-calendar-iframe');
    const chatWindow = document.getElementById('iautomatiq-chat-window');
    
    if (!iframe || !chatWindow) {
      console.error('❌ No se encontraron elementos necesarios:', {
        iframe: !!iframe,
        chatWindow: !!chatWindow
      });
      return;
    }
    
    console.log('📊 Estado antes del cierre:', {
      iframeDisplay: iframe.style.display,
      iframeClasses: iframe.className,
      chatWindowDisplay: chatWindow.style.display,
      chatWindowClasses: chatWindow.className
    });
    
    // Remover clase open del iframe
    iframe.classList.remove('open');
    
    // Esperar a que termine la animación de cierre
    setTimeout(() => {
      iframe.src = '';
      calendarIframe = null;
      
      // Forzar visibilidad del chat
      chatWindow.style.display = 'flex';
      chatWindow.classList.add('open');
      
      // Forzar repaint
      void chatWindow.offsetWidth;
      
      console.log('📊 Estado después del cierre:', {
        iframeDisplay: iframe.style.display,
        iframeClasses: iframe.className,
        chatWindowDisplay: chatWindow.style.display,
        chatWindowClasses: chatWindow.className
      });
      
      // Verificar el contenedor de mensajes
      const chatMessages = document.getElementById('iautomatiq-chat-messages');
      if (chatMessages) {
        console.log('✅ Contenedor de mensajes presente y listo');
      } else {
        console.warn('⚠️ No se encontró el contenedor de mensajes');
      }
    }, 300); // 300ms es la duración de la animación slideUp
  }

  function setLoadingCursor(loading) {
    document.body.style.cursor = loading ? 'wait' : 'default';
    const chatWindow = document.getElementById('iautomatiq-chat-window');
    const calendarIframe = document.getElementById('iautomatiq-calendar-iframe');
    if (chatWindow) {
      chatWindow.style.cursor = loading ? 'wait' : 'default';
      chatWindow.classList.toggle('loading', loading);
    }
    if (calendarIframe) {
      calendarIframe.style.cursor = loading ? 'wait' : 'default';
      try {
        // Intentar sincronizar el estado de carga con el iframe
        calendarIframe.contentWindow.document.body.classList.toggle('loading', loading);
      } catch (e) {
        // Ignorar errores de acceso al iframe por seguridad
      }
    }
  }

  function handleCalendarMessage(event) {
    console.log('🎯 Recibido evento postMessage:', event);
    
    // Validar que el mensaje existe
    if (!event.data) {
      console.error('❌ Evento sin datos');
      return;
    }
    
    const message = event.data;
    console.log('📩 Contenido del mensaje:', message);
    
    // Activar cursor de carga
    setLoadingCursor(true);

    const chatWindow = document.getElementById('iautomatiq-chat-window');
    const chatMessages = document.getElementById('iautomatiq-chat-messages');
    
    console.log('🔍 Estado del chat:', {
      chatWindowExists: !!chatWindow,
      chatMessagesExists: !!chatMessages,
      chatWindowDisplay: chatWindow?.style.display,
      chatWindowClasses: chatWindow?.className
    });
    
    if (message.action === 'booking_confirmed') {
      console.log('✨ Procesando confirmación de cita...');
      const bookingData = message.data;
      const t0 = Date.now();

      // Preparar mensaje de confirmación según tipo de reunión (mostrarlo de forma optimista)
      const meetingType = bookingData.clientData?.meetingType === 'presencial' ? 'presencial en el estudio' : 'virtual por videollamada';
      // const confirmationMessage = `✅ ¡Perfecto! Tu cita ${meetingType} está confirmada para el ${bookingData.date} a las ${bookingData.display}. Te enviaremos un email con ${bookingData.clientData?.meetingType === 'presencial' ? 'la dirección del estudio' : 'el link de la videollamada'}.`;
      const confirmationMessage = `✅ ¡Perfecto! Dame unos segundos...'}.`;

      // Asegurar que el chat esté visible y mostrar el mensaje inmediatamente (optimistic UI)
      if (chatWindow && !chatWindow.classList.contains('open')) {
        console.log('🔄 Forzando visibilidad del chat (optimistic)...');
        chatWindow.style.display = 'flex';
        chatWindow.classList.add('open');
      }

      hideTypingIndicator();
      if (chatMessages) {
        console.log('✅ Mostrando mensaje de confirmación inmediatamente (optimistic):', confirmationMessage);
        addMessage(confirmationMessage, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        console.warn('⚠️ Contenedor de mensajes no encontrado al intentar mostrar mensaje optimista');
      }

      // Iniciar cierre del calendario (no bloquear la UI)
      closeCalendarIframe();

      // Notificar a n8n en background y medir duración
      notifyBookingToN8n(bookingData)
        .then(() => {
          const dt = Date.now() - t0;
          console.log(`✅ Notificación a n8n exitosa (took ${dt}ms)`);
        })
        .catch(error => {
          console.error('❌ Error notificando booking:', error);
          // Notificar al usuario si la notificación falla
          addMessage('⚠️ La cita fue confirmada localmente, pero hubo un problema notificando al sistema. Por favor contactá al estudio si no recibís el email.', 'bot');
        })
        .finally(() => {
          // Restaurar cursor normal cuando termine la notificación
          setLoadingCursor(false);
        });

    } else if (message.action === 'cancel_booking') {
      console.log('🚫 Procesando cancelación...');
      closeCalendarIframe();
      
      // Esperar a que el chat esté visible
      setTimeout(() => {
        hideTypingIndicator();
        addMessage('Está bien, si querés agendar más adelante avisame.', 'bot');
        // Restaurar cursor normal
        setLoadingCursor(false);
      }, 500);
    } else if (message.action === 'close_calendar') {
      console.log('🚫 Cerrando calendario sin mensaje...');
      closeCalendarIframe();
      hideTypingIndicator();
      // Restaurar cursor normal
      setLoadingCursor(false);
    }
}

  async function notifyBookingToN8n(bookingData) {
    try {
      console.log('📤 Enviando datos de la cita a n8n:', bookingData);
      
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          action: 'bookingConfirmed',
          // Datos de la cita
          appointmentDate: bookingData.date,
          appointmentTime: bookingData.time,
          appointmentDisplay: bookingData.display,
          // Datos del evento de Google Calendar si existen
          eventId: bookingData.eventId,
          eventLink: bookingData.eventLink,
          // Datos del cliente
          clientName: bookingData.clientData?.name,
          clientEmail: bookingData.clientData?.email,
          clientPhone: bookingData.clientData?.phone,
          meetingType: bookingData.clientData?.meetingType,
          // Metadatos adicionales
          ...CONFIG.metadata
        })
      });

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const raw = await response.text();
      let data = {};
      if (contentType.includes('application/json')) {
        try { data = raw && raw.trim() ? JSON.parse(raw) : {}; } catch (e) { console.warn('⚠️ No se pudo parsear JSON de n8n:', e); data = { raw }; }
      } else {
        data = raw && raw.trim() ? { message: raw } : {};
      }

      if (!response.ok) {
        console.error('❌ n8n respondió con error HTTP:', response.status, data);
        // Mostrar posible mensaje de error desde n8n
        if (data && (data.message || data.error)) {
          try { addMessage(data.message || data.error, 'bot'); } catch (e) { /* ignore */ }
        }
        throw new Error(`n8n HTTP ${response.status}`);
      }

      console.log('✅ Booking notificado a n8n exitosamente', data);

      // Si n8n devuelve un mensaje para mostrar al usuario, mostrarlo
      const serverMsg = data.output || data.message || data.botMessage || data.response;
      if (serverMsg && serverMsg.toString().trim().length > 0) {
        try {
          const chatWindow = document.getElementById('iautomatiq-chat-window');
          if (chatWindow && !chatWindow.classList.contains('open')) {
            chatWindow.style.display = 'flex';
            chatWindow.classList.add('open');
          }
          addMessage(serverMsg.toString(), 'bot');
        } catch (e) {
          console.warn('⚠️ No se pudo agregar el mensaje de n8n al chat:', e);
        }
      }
    } catch (error) {
      console.error('❌ Error notificando booking:', error);
      throw error; // Re-lanzar el error para manejarlo en handleCalendarMessage
    }
  }

  function initChat() {
    createWidget();
    const chatButton = document.getElementById('iautomatiq-chat-button');
    const chatWindow = document.getElementById('iautomatiq-chat-window');
    const chatClose = document.getElementById('iautomatiq-chat-close');
    const chatInput = document.getElementById('iautomatiq-chat-input');
    const chatSend = document.getElementById('iautomatiq-chat-send');
    const chatMessages = document.getElementById('iautomatiq-chat-messages');
    const chatTooltip = document.getElementById('iautomatiq-tooltip');
    const starterPrompts = document.querySelector('.iautomatiq-starter-prompts');

    document.getElementById('header-avatar-container').appendChild(createAvatar(CONFIG.headerAvatar, CONFIG.theme.headerAvatarSize, true));
    chatMessages.querySelector('.iautomatiq-message-avatar').appendChild(createAvatar(CONFIG.botAvatar, CONFIG.theme.messageAvatarSize).firstChild);

    // Escuchar mensajes del calendario
    window.addEventListener('message', handleCalendarMessage);

    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        chatWindow.style.display = 'flex';
        // Forzar un reflow antes de añadir la clase
        void chatWindow.offsetWidth;
        chatWindow.classList.add('open');
        chatInput.focus();
      } else {
        chatWindow.classList.remove('open');
        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
          if (!isOpen) { // Verificar que aún esté cerrado
            chatWindow.style.display = 'none';
          }
        }, 300); // 300ms coincide con la duración de la animación slideUp
      }
      chatTooltip.classList.remove('show');
    }

    function showTypingIndicator() {
      if (isTypingIndicatorActive) return;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'iautomatiq-message bot';
      typingDiv.id = 'iautomatiq-typing-indicator';
      const avatar = createAvatar(CONFIG.botAvatar, CONFIG.theme.messageAvatarSize);
      const indicator = document.createElement('div');
      indicator.className = 'iautomatiq-typing-indicator';
      indicator.innerHTML = '<div class=\"iautomatiq-typing-dot\"></div><div class=\"iautomatiq-typing-dot\"></div><div class=\"iautomatiq-typing-dot\"></div>';
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
      
      if (!isTypingIndicatorActive) {
        showTypingIndicator();
      } else {
        const indicator = document.getElementById('iautomatiq-typing-indicator');
        if (indicator) {
          chatMessages.appendChild(indicator);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }
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

        console.log('📤 Enviando mensaje:', payload);

        const response = await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain; q=0.8'
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        console.log('📥 Respuesta:', response.status);

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        let data;
        if (contentType.includes('application/json')) {
          const raw = await response.text();
          data = raw && raw.trim().length ? JSON.parse(raw) : {};
        } else {
          const text = await response.text();
          data = text && text.trim().length ? { output: text } : {};
        }
        
        console.log('✅ Datos recibidos:', data);
        
        if (data.status === 'queued' || data.message === 'Processing batched request') {
          console.log('⏸️  Respuesta intermedia ignorada - esperando respuesta final');
          return;
        }
        
        // **DETECTAR SEÑAL DE CALENDARIO**
        if (data.showCalendar && data.clientData) {
          console.log('📅 Señal de calendario detectada');
          openCalendarIframe(data.clientData);
          return;
        }
        
        if (data && data.error) throw new Error(data.message || 'Error en el servidor');
        
        const botResponse = (data.output || data.message || data.response || '').trim();
        if (!botResponse || botResponse.length === 0) throw new Error('Respuesta vacía del servidor');
        
        hideTypingIndicator();
        addMessage(botResponse, 'bot');
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Error:', error);
        hideTypingIndicator();
        
        let errorMsg = CONFIG.errorMessage;
        if (error.name === 'AbortError') {
          errorMsg = 'La respuesta está tardando demasiado. Por favor, intenta de nuevo.';
        } else if (!navigator.onLine) {
          errorMsg = 'Parece que no tenés conexión a internet. Revisá tu conexión.';
        } else if (error.message.includes('HTTP')) {
          errorMsg = 'Hubo un problema con el servidor. Por favor, intenta de nuevo en unos minutos.';
        } else if (error instanceof SyntaxError) {
          errorMsg = 'Hubo un problema al procesar la respuesta. Por favor, intenta de nuevo.';
        }
        
        addMessage(errorMsg, 'bot');
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
    starterPrompts.addEventListener('click', (e) => {
      if (e.target && e.target.matches('.iautomatiq-starter-prompt')) {
        const message = e.target.getAttribute('data-prompt');
        addMessage(message, 'user');
        showTypingIndicator(); // Mostrar indicador de carga
        sendMessageToServer(message);
      }
    });
    chatButton.addEventListener('mouseenter', () => {
      if (!isOpen) setTimeout(() => { if (!isOpen) chatTooltip.classList.add('show'); }, CONFIG.tooltipDelay);
    });
    chatButton.addEventListener('mouseleave', () => chatTooltip.classList.remove('show'));

    if (CONFIG.autoOpen) setTimeout(toggleChat, CONFIG.autoOpenDelay);
    chatSend.disabled = true;
    console.log('✅ Chat Widget v2.2 - CON CALENDARIO cargado correctamente');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

})();