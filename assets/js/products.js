/**
 * Catálogo de productos de Unicorn't Store
 * Compartido entre index.html y product.html
 *
 * Campo `image`: ruta base sin extensión.
 * En el código se construyen los tamaños:
 *   Detalle  → image + ".webp"          (800×800)
 *   Card     → image + "-card.webp"     (480×480)
 *   Miniatura → image + "-thumb.webp"   (150×150)
 */

const products = [

  // ── PM ────────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Polera 'I Can Explain It To You'",
    category: "Polera",
    subcategory: "pm",
    price: 13990,
    description:
      "Frase favorita de todo Project Manager ante una estimación imposible. Si llevas esta polera en una reunión de planificación, todos sabrán quién eres.",
    image: "assets/img/pm/i-can-explain-it-to-you",
  },

  // ── Cloud ─────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: "Polera 'Cloud Architect'",
    category: "Polera",
    subcategory: "cloud",
    price: 14990,
    description:
      "Para quienes diseñan arquitecturas en nubes que a veces se van. Diagramas, flechas y más flechas. Todo bajo control... en teoría.",
    image: "assets/img/cloud/cloud-arquitect",
  },

  // ── DevOps ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: "Polera 'Breaking Prod'",
    category: "Polera",
    subcategory: "devops",
    price: 13990,
    description:
      "Basada en Breaking Bad, pero el producto que rompes es producción. Ideal para quien deployó un cambio de 2 líneas y tumbó todo el sistema.",
    image: "assets/img/devops/breaking-prod",
  },
  {
    id: 4,
    name: "Polera 'CI/CD or Die Trying'",
    category: "Polera",
    subcategory: "devops",
    price: 13990,
    description:
      "Cuando tu pipeline de integración continua es tu razón de vivir. Si el build falla, la vida falla. 100% cultura DevOps.",
    image: "assets/img/devops/cicd-or-die-trying",
  },
  {
    id: 5,
    name: "Polera 'DevOps Acronym'",
    category: "Polera",
    subcategory: "devops",
    price: 12990,
    description:
      "¿Qué significa DevOps realmente? Esta polera lo explica en detalle. Cada letra tiene su propia historia, probablemente más dramática que la anterior.",
    image: "assets/img/devops/devops-acronym",
  },
  {
    id: 6,
    name: "Polera 'I Broke Prod Again'",
    category: "Polera",
    subcategory: "devops",
    price: 13990,
    description:
      "No es la primera vez. Tampoco será la última. Lleva con orgullo la insignia del desarrollador que hizo deploy el viernes a las 5 PM.",
    image: "assets/img/devops/i-broke-prod-again",
  },
  {
    id: 7,
    name: "Polera 'It Works In My Container'",
    category: "Polera",
    subcategory: "devops",
    price: 13990,
    description:
      "La evolución del clásico 'funciona en mi máquina'. Ahora con Docker. El contenedor funciona, el problema está en todos los demás.",
    image: "assets/img/devops/it-works-in-my-container",
  },
  {
    id: 8,
    name: "Polera 'No Deploy on Fridays'",
    category: "Polera",
    subcategory: "devops",
    price: 14990,
    description:
      "La regla de oro del desarrollo de software. Quien deployó en viernes y pasó un buen fin de semana, que tire la primera piedra. (Spoiler: nadie.)",
    image: "assets/img/devops/no-deploy-fridays",
  },

  // ── Enigma ────────────────────────────────────────────────────────────────
  {
    id: 9,
    name: "Polera 'Enigma Blueprint'",
    category: "Polera",
    subcategory: "enigma",
    price: 15990,
    description:
      "Plano técnico de la mítica máquina Enigma. El artefacto que cambió el curso de la Segunda Guerra Mundial y que Alan Turing logró descifrar. Historia pura.",
    image: "assets/img/enigma/enigma-blue-print",
  },
  {
    id: 10,
    name: "Polera 'Enigma Machine'",
    category: "Polera",
    subcategory: "enigma",
    price: 15990,
    description:
      "Ilustración detallada del dispositivo de cifrado más famoso de la historia. Para quienes aman la criptografía, la historia y las máquinas complejas.",
    image: "assets/img/enigma/enigma-machine",
  },

  // ── General ───────────────────────────────────────────────────────────────
  {
    id: 11,
    name: "Polera 'Don Ramón: La Venganza'",
    category: "Polera",
    subcategory: "general",
    price: 12990,
    description:
      "El meme latinoamericano más noble de internet. Don Ramón en su máxima expresión. Para quienes crecieron con El Chavo y conocen el verdadero significado del clásico.",
    image: "assets/img/general/don-ramon-venganza",
  },
  {
    id: 12,
    name: "Polera 'Don Ramón: La Venganza II'",
    category: "Polera",
    subcategory: "general",
    price: 12990,
    description:
      "Porque una edición no era suficiente. La secuela que nadie pidió pero todos necesitaban. Diseño alternativo del meme que nos une como región.",
    image: "assets/img/general/don-ramon-venganza-2",
  },
  {
    id: 13,
    name: "Polera 'No Lloren Por Mí'",
    category: "Polera",
    subcategory: "general",
    price: 12990,
    description:
      "Para el momento en que cierras el IDE por última vez en el día. O cuando el código que escribiste funciona a la primera. Ambas situaciones merecen esta polera.",
    image: "assets/img/general/no-lloren-por-mi",
  },
  {
    id: 14,
    name: "Polera 'Stonks'",
    category: "Polera",
    subcategory: "general",
    price: 12990,
    description:
      "El meme financiero por excelencia. Cuando tus acciones van 'stonks' pero no sabes por qué. Perfecta para reuniones de economía amateur y grupos de WhatsApp.",
    image: "assets/img/general/stonks",
  },
  {
    id: 15,
    name: "Polera 'This Is Fine'",
    category: "Polera",
    subcategory: "general",
    price: 12990,
    description:
      "El perrito más tranquilo del mundo mientras todo arde a su alrededor. El meme que resume perfectamente el día a día en tecnología. Todo está bien. Todo está bien.",
    image: "assets/img/general/this-is-fine",
  },

  // ── IT Crowd ──────────────────────────────────────────────────────────────
  {
    id: 16,
    name: "Polera '0118 999 881 999 119 725 3'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 14990,
    description:
      "El nuevo número de emergencias de IT Crowd. En caso de incendio en la oficina, llame primero a este número, luego evacuarse. Solo los verdaderos fans lo reconocen.",
    image: "assets/img/it-crowd/0118-999-881-999-118-725-3",
  },
  {
    id: 17,
    name: "Polera 'RTFM'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 12990,
    description:
      "Read The F***ing Manual. El consejo más honesto que puede dar un técnico. Antes de abrir un ticket, antes de mandar un correo, antes de preguntar.",
    image: "assets/img/it-crowd/rtfm",
  },
  {
    id: 18,
    name: "Polera 'Choose Your Weapon'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Vim vs Emacs. nano para los no iniciados. La guerra de editores que ha durado décadas y no tiene fin. ¿Cuál es tu arma de elección?",
    image: "assets/img/it-crowd/choose-your-weapon",
  },
  {
    id: 19,
    name: "Polera 'I Don't Work Here'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Para cuando te preguntan por el WiFi en el supermercado porque llevas una polera de colores similares al uniforme. La polera perfecta para salir sin ser identificado.",
    image: "assets/img/it-crowd/i-dont-work-here",
  },
  {
    id: 20,
    name: "Polera 'I Hope This Email Finds You Well'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "La frase con la que comienza el 87% de todos los correos corporativos de la historia de la humanidad. Lleva contigo la esencia del email culture.",
    image: "assets/img/it-crowd/i-hope-this-email-finds-you-well",
  },
  {
    id: 21,
    name: "Polera 'I Read Your Email'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "IT puede ver todo. Absolutamente todo. Esta polera es un recordatorio amistoso (y levemente intimidante) de que el equipo técnico sabe más de lo que crees.",
    image: "assets/img/it-crowd/i-read-your-email",
  },
  {
    id: 22,
    name: "Polera 'I See Dumb People'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Para el técnico que atiende soporte nivel 1 y escucha las preguntas más inverosímiles. Versión IT Crowd del clásico de El Sexto Sentido.",
    image: "assets/img/it-crowd/i-see-dumb-people",
  },
  {
    id: 23,
    name: "Polera 'Type Google Into Google'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 12990,
    description:
      "Si escribes Google en Google puedes romper internet. El consejo de IT Crowd que ningún técnico olvidará jamás. Wear it wisely.",
    image: "assets/img/it-crowd/type-google-into-google",
  },
  {
    id: 24,
    name: "Polera 'Meh'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 11990,
    description:
      "La respuesta universal del técnico ante prácticamente cualquier situación. Reunión de kickoff, nueva metodología, otro reorg. Meh. Solo meh.",
    image: "assets/img/it-crowd/meh",
  },
  {
    id: 25,
    name: "Polera 'Moss: Keep Calm'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Moss recomendando mantener la calma y apagar el fuego con el resto del fuego. La lógica IT Crowd aplicada a situaciones de emergencia cotidiana.",
    image: "assets/img/it-crowd/moss-keep-calm",
  },
  {
    id: 26,
    name: "Polera '¿Lo Apagaste y lo Volviste a Encender?'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 14990,
    description:
      "La pregunta que soluciona el 80% de los problemas técnicos. Moss lo dijo primero, el mundo lo aprendió después. El diagnóstico más poderoso del universo IT.",
    image: "assets/img/it-crowd/moss-turn-it-off",
  },
  {
    id: 27,
    name: "Polera 'Music I Like'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 12990,
    description:
      "Referencia directa al estilo musical único de Moss en IT Crowd. Para quienes tienen gustos musicales difíciles de explicar en reuniones sociales.",
    image: "assets/img/it-crowd/music-i-like",
  },
  {
    id: 28,
    name: "Polera 'Pixel Pirate Flag'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Bandera pirata en pixel art de 8 bits. Para los digitales rebeldes, los que navegan sin VPN por aguas desconocidas. RGB o muerte.",
    image: "assets/img/it-crowd/pixel-pirate-flag",
  },
  {
    id: 29,
    name: "Polera 'Roy: People, What a Bunch of Bastards'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 14990,
    description:
      "La frase que Roy Trenneman dijo en IT Crowd y que todo técnico de soporte ha pensado al menos una vez. La cita definitiva del introvertido en entorno corporativo.",
    image: "assets/img/it-crowd/roy-people",
  },
  {
    id: 30,
    name: "Polera 'The Cake Is a Lie'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 12990,
    description:
      "El mensaje más famoso de Portal y toda la cultura gamer. Una promesa de recompensa que nunca llega. Como el bonus de fin de año o el deploy sin bugs.",
    image: "assets/img/it-crowd/the-cake-is-a-lie",
  },
  {
    id: 31,
    name: "Polera 'The Sun Is Trying to Kill Me'",
    category: "Polera",
    subcategory: "it-crowd",
    price: 13990,
    description:
      "Moss de IT Crowd expresando su relación con el exterior de manera perfectamente precisa. Para developers que prefieren la luz del monitor a la del sol.",
    image: "assets/img/it-crowd/the-sun-is-trying-to-kill-me",
  },

  // ── Linux ─────────────────────────────────────────────────────────────────
  {
    id: 32,
    name: "Polera 'sudo rm -rf /'",
    category: "Polera",
    subcategory: "linux",
    price: 14990,
    description:
      "El comando más peligroso y temido de la línea de comandos. Solo con fines educativos. No ejecutar en sistemas de producción. Ni en los de desarrollo. Ni en nada.",
    image: "assets/img/linux/sudo-rm-rf",
  },

  // ── Personajes ────────────────────────────────────────────────────────────
  {
    id: 33,
    name: "Polera 'AC/DC: Tesla vs Edison'",
    category: "Polera",
    subcategory: "personajes",
    price: 15990,
    description:
      "La guerra de corrientes más épica de la historia, en formato de portada de disco de rock. Tesla con corriente alterna vs Edison con continua. ¿De qué lado estás?",
    image: "assets/img/personajes/acdc-tesla-edison",
  },
  {
    id: 34,
    name: "Polera 'Alan Turing'",
    category: "Polera",
    subcategory: "personajes",
    price: 15990,
    description:
      "Homenaje al padre de la computación moderna y la inteligencia artificial. Matemático, criptógrafo, héroe de guerra. El hombre que descifró Enigma y definió nuestra era.",
    image: "assets/img/personajes/alan-turing",
  },
  {
    id: 35,
    name: "Polera 'Chuck Norris Doesn't Code'",
    category: "Polera",
    subcategory: "personajes",
    price: 13990,
    description:
      "Chuck Norris no necesita compilar. Sus programas se ejecutan antes de escribirse. Para quienes conocen todos los Chuck Norris facts del mundo del desarrollo.",
    image: "assets/img/personajes/chuck-norris-doesnt-code",
  },
  {
    id: 36,
    name: "Polera 'Nikola Tesla'",
    category: "Polera",
    subcategory: "personajes",
    price: 14990,
    description:
      "El genio incomprendido de la corriente alterna. Inventor del motor de inducción, la bobina Tesla y el sueño de la electricidad gratuita para todos. Un verdadero nerd ahead of his time.",
    image: "assets/img/personajes/tesla",
  },
  {
    id: 37,
    name: "Polera 'Chuck Norris Facts'",
    category: "Polera",
    subcategory: "personajes",
    price: 13990,
    description:
      "Todo lo que necesitas saber sobre Chuck Norris en una polera. Cuando Chuck Norris hace un pull request, el código se aprueba solo. Los tests pasan por miedo.",
    image: "assets/img/personajes/chuck-norris-facts",
  },
  {
    id: 38,
    name: "Polera 'Turing Test'",
    category: "Polera",
    subcategory: "personajes",
    price: 14990,
    description:
      "¿Puedes distinguir a una máquina de un humano? La pregunta que Alan Turing planteó en 1950 y que ChatGPT definitivamente ya resolvió, ¿o no?",
    image: "assets/img/personajes/turing-test",
  },

  // ── Programador ───────────────────────────────────────────────────────────
  {
    id: 39,
    name: "Polera 'C: You Have No Class'",
    category: "Polera",
    subcategory: "programador",
    price: 13990,
    description:
      "El clásico chiste de programación orientada a objetos. C es poderoso, C es veloz, C no tiene clases. Y eso lo hace único. Para los puristas de la gestión manual de memoria.",
    image: "assets/img/programador/c-you-have-no-class",
  },
  {
    id: 40,
    name: "Polera 'CSS Is Awesome'",
    category: "Polera",
    subcategory: "programador",
    price: 12990,
    description:
      "El meme de CSS más famoso del mundo: la caja que dice 'CSS is awesome' pero el texto se desborda del contenedor. El overflow del universo.",
    image: "assets/img/programador/css",
  },
  {
    id: 41,
    name: "Polera 'CTM Compilará Todo Mañana'",
    category: "Polera",
    subcategory: "programador",
    price: 13990,
    description:
      "El chiste más local de nuestra colección. Para el desarrollador chileno que siempre tiene una solución para mañana. Versión criolla del procrastination coding.",
    image: "assets/img/programador/ctm-compilara-todo-manana",
  },
  {
    id: 42,
    name: "Polera 'False: It's Funny Because It's True'",
    category: "Polera",
    subcategory: "programador",
    price: 12990,
    description:
      "Para los amantes de la lógica booleana y el humor de programador. '2 + 2 = 5 is true for large values of 2'. La ironía computacional en su máxima expresión.",
    image: "assets/img/programador/false-its-funny",
  },
  {
    id: 43,
    name: "Polera 'I Don't Always Test My Code'",
    category: "Polera",
    subcategory: "programador",
    price: 13990,
    description:
      "Basada en el meme de 'The Most Interesting Man in the World'. I don't always test my code, but when I do, I do it in production. La verdad más incómoda del desarrollo.",
    image: "assets/img/programador/i-dont-always-test-my-code",
  },
  {
    id: 44,
    name: "Polera 'I'm Just Here for the Pizza'",
    category: "Polera",
    subcategory: "programador",
    price: 12990,
    description:
      "La motivación más honesta para asistir a cualquier evento tech, meetup, hackathon o standup. Pizza > todo lo demás. La verdad que nadie dice en voz alta.",
    image: "assets/img/programador/im-just-here-for-the-pizza",
  },
  {
    id: 45,
    name: "Polera 'Coffee + Problem = Programmer'",
    category: "Polera",
    subcategory: "programador",
    price: 12990,
    description:
      "La ecuación más precisa de la ciencia computacional. A programmer is just a machine that turns coffee into code. Diseño clásico para la ecuación fundamental.",
    image: "assets/img/programador/problem-coffee-programmer",
  },
  {
    id: 46,
    name: "Polera 'Programming Is 10% Writing Code'",
    category: "Polera",
    subcategory: "programador",
    price: 13990,
    description:
      "Y 90% entendiendo por qué no funciona. La estadística más precisa de la carrera. Debugging, Stack Overflow, y preguntas existenciales incluidos en el porcentaje.",
    image: "assets/img/programador/programming-is-10-percent",
  },
  {
    id: 47,
    name: "Polera 'This Meeting Could Have Been an Email'",
    category: "Polera",
    subcategory: "programador",
    price: 14990,
    description:
      "La frase que uno piensa en el 73% de todas las reuniones de la historia corporativa. Para quienes valoran el deep work sobre las sinergias cross-funcionales de stakeholders.",
    image: "assets/img/programador/this-meeting",
  },

  // ── QA ────────────────────────────────────────────────────────────────────
  {
    id: 48,
    name: "Polera 'Quality Assurance'",
    category: "Polera",
    subcategory: "qa",
    price: 13990,
    description:
      "Para los guardianes del software. Los que encuentran los bugs antes que los usuarios (y cuando no es así, los que más se acuerdan). Diseño clásico para el QA Engineer.",
    image: "assets/img/qa/quality-assurance",
  },
  {
    id: 49,
    name: "Polera 'Quality Assurance Vol. 2'",
    category: "Polera",
    subcategory: "qa",
    price: 13990,
    description:
      "Edición especial para los QA más comprometidos. Porque un solo diseño no captura toda la pasión por encontrar ese bug imposible de reproducir en cualquier otro ambiente.",
    image: "assets/img/qa/quality-assurance-2",
  },
];

