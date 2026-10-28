/**
 * legalPoliciesData.js
 * Comprehensive CMS-driven configuration and content for Sutra México's official legal policies.
 * Covers Términos y Condiciones, Política de Reembolsos, Aviso de Privacidad y Política de Envíos Nacionales sin límite de ciudades.
 */

export const LEGAL_POLICIES_CONFIG = {
  terms: {
    key: 'terms',
    collection: 'Temrinosycondiciones',
    path: '/terminos-y-condiciones',
    aliasPaths: ['/terminos', '/legal/terminos'],
    label: 'Términos y Condiciones',
    tag: 'CONDICIONES DE SERVICIO & VENTA',
    metaTitle: 'Términos y Condiciones de Uso y Compra | Sutra México',
    metaDesc: 'Consulta los Términos y Condiciones generales de uso, compra, suscripciones y seguridad de velas de arena y rituales en Sutra México.',
    lastUpdated: '2026-10-28',
  },
  refund: {
    key: 'refund',
    collection: 'PoliticadeReembolsos',
    path: '/politica-de-reembolso',
    aliasPaths: ['/politica-de-reembolsos', '/reembolsos', '/devoluciones', '/legal/reembolsos'],
    label: 'Política de Reembolsos',
    tag: 'GARANTÍA DE PAZ & DEVOLUCIONES',
    metaTitle: 'Política de Reembolsos y Devoluciones | Sutra México',
    metaDesc: 'Conoce nuestra garantía de satisfacción, reemplazo inmediato por daño en paquetería y proceso de reembolsos en Sutra México.',
    lastUpdated: '2026-10-28',
  },
  privacy: {
    key: 'privacy',
    collection: 'AvisodePrivacidad',
    path: '/politica-de-privacidad',
    aliasPaths: ['/aviso-de-privacidad', '/privacidad', '/legal/privacidad'],
    label: 'Aviso de Privacidad',
    tag: 'PROTECCIÓN DE DATOS PERSONALES',
    metaTitle: 'Aviso de Privacidad y Protección de Datos | Sutra México',
    metaDesc: 'Aviso de Privacidad integral de Sutra México conforme a la LFPDPPP. Conoce cómo protegemos tus datos personales y tus derechos ARCO.',
    lastUpdated: '2026-10-28',
  },
  shipping: {
    key: 'shipping',
    collection: 'PoliticadeEnvios',
    path: '/politica-de-envios',
    aliasPaths: ['/envios', '/politica-de-envio', '/legal/envios'],
    label: 'Política de Envíos',
    tag: 'COBERTURA NACIONAL SIN LÍMITES',
    metaTitle: 'Política de Envíos a Todo México | Sutra México',
    metaDesc: 'Envíos a los 32 estados de México sin límite de ciudades. Tiempos de entrega, paqueterías aliadas, embalaje seguro y seguro de rotura gratis.',
    lastUpdated: '2026-10-28',
  },
};

export const DEFAULT_LEGAL_CONTENT = {
  // ─── 1. POLÍTICA DE ENVÍOS ───────────────────────────────────────────────
  shipping: `
    <h2>1. Cobertura Nacional Total sin Límite de Ciudades</h2>
    <p>
      En <strong>Sutra México</strong> creemos que cualquier rincón del país merece convertirse en un santuario de paz y bienestar. Por ello, <strong>ofrecemos cobertura completa de envíos a las 32 entidades federativas de la República Mexicana, sin exclusión ni límite de ciudades o municipios</strong>.
    </p>
    <p>
      Llegamos a todas las capitales, áreas metropolitanas (Ciudad de México, Guadalajara, Monterrey, Puebla, Querétaro, Mérida, Cancún, León, Tijuana, Toluca, San Luis Potosí, Hermosillo, Cuernavaca, Aguascalientes, etc.), así como a municipios del interior, zonas costeras y localidades con frecuencia de entrega extendida.
    </p>

    <h2>2. Alianzas Logísticas y Paqueterías Oficiales</h2>
    <p>
      Para garantizar traslados puntuales y seguros, operamos con las empresas de mensajería líderes en México:
    </p>
    <ul>
      <li><strong>DHL Express:</strong> Envíos prioritarios y cobertura aérea acelerada.</li>
      <li><strong>FedEx México:</strong> Red logística nacional de alta confiabilidad.</li>
      <li><strong>Estafeta:</strong> Máxima penetración en códigos postales de toda la República.</li>
      <li><strong>99Minutos:</strong> Envíos sostenibles y entregas ágiles en zonas metropolitanas clave.</li>
    </ul>

    <h2>3. Tiempos de Preparación y Entrega</h2>
    <p>
      Nuestros tiempos se dividen en dos etapas transparentes:
    </p>
    <ul>
      <li><strong>Tiempo de Preparación Artesanal:</strong> Todos los pedidos se preparan y dosifican cuidadosamente en nuestro taller en un lapso de <strong>24 a 48 horas hábiles</strong> tras la confirmación del pago.</li>
      <li><strong>Envío Estándar Nacional:</strong> <strong>2 a 5 días hábiles</strong> posteriores al despacho en paquetería para la gran mayoría de ciudades del país.</li>
      <li><strong>Envío Express Nacional:</strong> <strong>1 a 2 días hábiles</strong> posteriores al despacho en las principales zonas urbanas de México.</li>
      <li><strong>Zonas Extendidas o Remotas:</strong> <strong>4 a 7 días hábiles</strong>, sujeto a la frecuencia de visita semanal de la paquetería en la localidad específica.</li>
    </ul>

    <h2>4. Costos y Tarifas de Envío</h2>
    <ul>
      <li><strong>Envío Gratis:</strong> En todas las compras superiores a <strong>$999 MXN</strong> a cualquier código postal de México.</li>
      <li><strong>Envío Estándar Fijo:</strong> <strong>$149 MXN</strong> para compras menores a $999 MXN, cubriendo todo el territorio nacional sin recargos ocultos.</li>
      <li><strong>Envío Express Opcional:</strong> <strong>$229 MXN</strong> para entregas prioritarias (disponible al finalizar la compra en checkout).</li>
    </ul>

    <h2>5. Embalaje Especial y Seguro Total de Tránsito (Garantía Antirrotura)</h2>
    <p>
      Nuestras velas de arena, recipientes cerámicos artesanales y aceites botánicos requieren un cuidado excepcional. Por ello, cada envío cuenta con:
    </p>
    <ul>
      <li><strong>Caja de alta resistencia:</strong> Cartón corrugado rígido reciclable con cinta de seguridad reforzada.</li>
      <li><strong>Acolchado de panal ecológico:</strong> Amortiguación biodegradable que protege recipientes de cerámica y vidrio sin generar plástico innecesario.</li>
      <li><strong>Seguro de Tránsito Gratuito:</strong> Todos los paquetes viajan 100% asegurados por cuenta de Sutra México. Si algún recipiente o producto llega dañado o roto, te enviamos un reemplazo nuevo sin ningún costo adicional.</li>
    </ul>

    <h2>6. Seguimiento en Tiempo Real</h2>
    <p>
      Tan pronto como tu pedido sea recolectado por la mensajería, recibirás un correo electrónico y un mensaje de confirmación con tu número de guía y el enlace directo para rastrear el trayecto de tu paquete minuto a minuto.
    </p>

    <h2>7. Entregas y Dirección de Envío</h2>
    <p>
      Las paqueterías realizan hasta 2 intentos de entrega en el domicilio señalado. Te recomendamos verificar que tus datos de calle, número exterior/interior, colonia, código postal y referencias (entre qué calles o color de fachada) sean precisos para evitar demoras.
    </p>
  `,

  // ─── 2. POLÍTICA DE REEMBOLSOS ───────────────────────────────────────────
  refund: `
    <h2>1. Garantía de Paz y Satisfacción Sutra</h2>
    <p>
      Queremos que cada producto de <strong>Sutra México</strong> enriquezca tus espacios y te brinde un momento de calma genuina. Si por algún motivo tu compra no cumple tus expectativas, contamos con una política de devoluciones y reembolsos clara, justa y transparente.
    </p>

    <h2>2. Plazo de Devolución</h2>
    <p>
      Dispones de <strong>30 días naturales</strong> a partir de la fecha de entrega de tu pedido para solicitar una devolución o reembolso.
    </p>

    <h2>3. Condiciones para Devoluciones</h2>
    <p>
      Para que una devolución sea aprobada, los artículos deben cumplir con los siguientes requisitos:
    </p>
    <ul>
      <li>El producto debe encontrarse en las mismas condiciones en que fue recibido: sin usar, sin quemar y en su empaque original cerrado.</li>
      <li>Debe incluir todos sus componentes: mechas vegetales, cera de arena dosificada, empaques y manuales de ritual.</li>
      <li>Por motivos de higiene y pureza botánica, los aceites aromáticos, esencias puras y tés ceremoniales cuyos sellos de seguridad hayan sido rotos o abiertos no son susceptibles de devolución voluntaria, salvo por defecto de fábrica.</li>
    </ul>

    <h2>4. Reemplazo Inmediato por Daños en Paquetería</h2>
    <p>
      Si al abrir tu paquete detectas que algún recipiente de cerámica, frasco de vidrio o accesorio sufrió daños durante el traslado:
    </p>
    <ol>
      <li>Toma 2 o 3 fotografías o un video corto donde se aprecie el daño y la etiqueta exterior de la caja.</li>
      <li>Envíanos un mensaje vía WhatsApp al <strong>+52 55 1234 5678</strong> o por correo a <strong>contacto@sutramexico.com</strong> dentro de las primeras <strong>48 horas</strong> posteriores a la entrega.</li>
      <li><strong>Repondremos el producto roto de inmediato sin ningún costo para ti</strong>, asumiendo nosotros el nuevo envío exprés.</li>
    </ol>

    <h2>5. Proceso y Tiempos de Reembolso</h2>
    <p>
      Una vez recibido el producto devuelto en nuestro taller y verificado su estado:
    </p>
    <ul>
      <li>Te notificaremos por correo electrónico la aprobación de tu reembolso.</li>
      <li>El reembolso se acreditará en un plazo de <strong>3 a 5 días hábiles</strong> mediante el mismo método de pago utilizado en la compra original (tarjeta de débito/crédito, Mercado Pago, PayPal o transferencia SPEI).</li>
      <li>Los tiempos de reflejo en tu estado de cuenta bancario dependen exclusivamente de tu institución financiera emisora (habitualmente entre 5 y 15 días hábiles para tarjetas de crédito).</li>
    </ul>

    <h2>6. Cancelación de Pedidos</h2>
    <p>
      Puedes solicitar la cancelación de tu orden y el reembolso íntegro inmediato siempre y cuando el paquete no haya sido entregado a la paquetería. Una vez generado el número de guía y recolectado el paquete, deberá seguirse el proceso de devolución ordinario.
    </p>
  `,

  // ─── 3. AVISO DE PRIVACIDAD ──────────────────────────────────────────────
  privacy: `
    <h2>1. Identidad y Domicilio del Responsable</h2>
    <p>
      <strong>Sutra México</strong> (en lo sucesivo "Sutra"), con domicilio en Ciudad de México, México, y portal web oficial <a href="https://www.sutramexico.com">www.sutramexico.com</a>, es el responsable del uso, tratamiento y protección de sus datos personales, en estricto apego a la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> y su Reglamento.
    </p>

    <h2>2. Datos Personales que Recabamos</h2>
    <p>
      Para las finalidades señaladas en este aviso, podemos recabar los siguientes datos:
    </p>
    <ul>
      <li><strong>Datos de Identificación y Contacto:</strong> Nombre y apellidos, correo electrónico, número telefónico celular (WhatsApp) y dirección física completa de entrega.</li>
      <li><strong>Datos de Facturación:</strong> Registro Federal de Contribuyentes (RFC), razón social, régimen fiscal, uso de CFDI y código postal fiscal.</li>
      <li><strong>Datos de Transacción:</strong> Información de compras y pedidos. <em>Importante: Los datos bancarios y de tarjetas son procesados directamente por pasarelas de pago certificadas con estándar PCI-DSS (Mercado Pago, Stripe, PayPal). Sutra nunca almacena números de tarjeta ni códigos de seguridad CVV en sus servidores.</em></li>
    </ul>

    <h2>3. Finalidades del Tratamiento de Datos</h2>
    <p>
      Sus datos personales serán utilizados para las siguientes finalidades:
    </p>
    <ul>
      <li><strong>Finalidades Primarias (necesarias para el servicio):</strong>
        <ul>
          <li>Procesar, preparar, embalar y entregar sus pedidos en cualquier ciudad de México.</li>
          <li>Notificarle sobre el estado de su envío y proporcionarle guías de rastreo en tiempo real.</li>
          <li>Emitir la factura fiscal digital (CFDI) correspondiente si así lo solicita.</li>
          <li>Brindarle soporte técnico, atención al cliente y seguimiento de garantías o devoluciones.</li>
          <li>Administrar su cuenta de usuario y gestionar su suscripción bimestral Mystery Box.</li>
        </ul>
      </li>
      <li><strong>Finalidades Secundarias (opcionales):</strong>
        <ul>
          <li>Enviarle boletines de bienestar, rituales conscientes, lanzamientos de nuevas esencias y promociones exclusivas.</li>
          <li>Evaluar la calidad de nuestro servicio y realizar encuestas voluntarias de satisfacción.</li>
        </ul>
      </li>
    </ul>
    <p>
      <em>Si no desea que sus datos sean tratados para finalidades secundarias, puede darse de baja en cualquier momento haciendo clic en el enlace al pie de cualquiera de nuestros correos o escribiendo a privacidad@sutramexico.com.</em>
    </p>

    <h2>4. Transferencia de Datos Personales</h2>
    <p>
      Sutra México no vende, no renta ni comercializa sus datos personales con terceros. Sus datos únicamente son transferidos a:
    </p>
    <ul>
      <li><strong>Empresas de Paquetería y Logística:</strong> (DHL, FedEx, Estafeta, 99Minutos) con el único fin de completar la entrega física de sus pedidos en su domicilio.</li>
      <li><strong>Pasarelas de Pago Certificadas:</strong> Para la autorización y procesamiento seguro de los cobros.</li>
      <li><strong>Autoridades Fiscales (SAT):</strong> Para el cumplimiento estricto de obligaciones tributarias en la emisión de facturas.</li>
    </ul>

    <h2>5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
    <p>
      Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información (Rectificación); que la eliminemos de nuestros registros cuando considere que no está siendo utilizada adecuadamente (Cancelación); o bien oponerse al uso de sus datos para fines específicos (Oposición).
    </p>
    <p>
      Para ejercer cualquiera de los derechos ARCO, envíe una solicitud al correo electrónico <strong>privacidad@sutramexico.com</strong> indicando su nombre completo, copia de identificación oficial y la descripción clara del derecho que desea ejercer. Responderemos en un plazo máximo de <strong>15 días hábiles</strong>.
    </p>

    <h2>6. Uso de Cookies y Tecnologías Similares</h2>
    <p>
      Nuestro sitio web utiliza cookies técnicas y analíticas para recordar los productos de su carrito de compra, recordar sus preferencias de navegación y optimizar la velocidad de carga. Puede desactivar las cookies en cualquier momento a través de la configuración de su navegador web.
    </p>

    <h2>7. Modificaciones al Aviso de Privacidad</h2>
    <p>
      El presente aviso de privacidad puede sufrir modificaciones derivadas de requerimientos legales o de nuestras propias prácticas comerciales. Cualquier cambio será publicado oportunamente en esta misma página con su fecha de actualización respectiva.
    </p>
  `,

  // ─── 4. TÉRMINOS Y CONDICIONES ───────────────────────────────────────────
  terms: `
    <h2>1. Disposiciones Generales</h2>
    <p>
      Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web <strong>www.sutramexico.com</strong> (en adelante, el "Sitio"), así como la adquisición de velas de arena, recipientes de cerámica, esencias botánicas, té ceremonial y cajas de suscripción (en adelante, los "Productos") comercializados por <strong>Sutra México</strong>.
    </p>
    <p>
      Al navegar en el Sitio o completar una orden de compra, el usuario declara ser mayor de 18 años de edad, contar con capacidad legal para contratar y aceptar expresamente estos Términos y Condiciones en su totalidad.
    </p>

    <h2>2. Precios, Moneda y Facturación</h2>
    <ul>
      <li>Todos los precios mostrados en el Sitio se encuentran expresados en <strong>Pesos Mexicanos (MXN)</strong> e incluyen el Impuesto al Valor Agregado (IVA) correspondiente conforme a la legislación fiscal mexicana.</li>
      <li>Sutra se reserva el derecho de modificar los precios en cualquier momento sin previo aviso; sin embargo, se respetará el precio vigente al momento en que el usuario haya completado y pagado su orden.</li>
      <li><strong>Facturación CFDI:</strong> Si requiere factura con validez fiscal (CFDI versión 4.0), podrá solicitarla durante el proceso de compra o dentro del mismo mes calendario de su pedido enviando su Constancia de Situación Fiscal actualizada a <strong>contacto@sutramexico.com</strong>.</li>
    </ul>

    <h2>3. Métodos de Pago Seguros</h2>
    <p>
      Aceptamos los principales métodos de pago del mercado mexicano a través de pasarelas de pago cifradas con protocolo SSL/TLS de 256 bits:
    </p>
    <ul>
      <li>Tarjetas de crédito y débito Visa, Mastercard y American Express.</li>
      <li>Mercado Pago (incluyendo saldo en cuenta y pagos en efectivo en tiendas de conveniencia OXXO).</li>
      <li>PayPal México.</li>
      <li>Transferencias electrónicas interbancarias vía SPEI.</li>
    </ul>

    <h2>4. Naturaleza Artesanal de los Productos</h2>
    <p>
      Nuestras velas de arena se elaboran con <strong>cera 100% vegetal perlada</strong>, mechas de algodón puro libre de plomo y extractos botánicos naturales. Los recipientes son producidos y esmaltados de manera artesanal, por lo que pueden presentar sutiles variaciones en tono, textura y acabado, lo cual constituye el sello de autenticidad de cada pieza.
    </p>

    <h2>5. Medidas de Seguridad y Uso Responsable de Velas</h2>
    <p>
      Para disfrutar de un ritual seguro y satisfactorio, el cliente se compromete a seguir las siguientes instrucciones esenciales de uso:
    </p>
    <ul>
      <li>Verter la cera de arena únicamente en recipientes resistentes al calor (cerámica, vidrio templado o metal adecuado).</li>
      <li>Insertar la mecha dejando aproximadamente <strong>0.5 cm</strong> sobresaliendo de la superficie de arena.</li>
      <li>Mantener la vela encendida siempre bajo supervisión visual directa. <strong>Nunca dejar una vela desatendida.</strong></li>
      <li>Mantener alejada de corrientes de aire, cortinas, libros, niños pequeños y mascotas.</li>
      <li>Colocar sobre superficies planas, firmes y no inflamables. No mover el recipiente mientras la cera esté derretida.</li>
    </ul>

    <h2>6. Suscripciones y Mystery Box</h2>
    <p>
      Sutra ofrece planes de suscripción periódica bimestral (Mystery Box):
    </p>
    <ul>
      <li>El cobro se realiza automáticamente de manera bimestral según la fecha de alta.</li>
      <li>El suscriptor puede pausar, omitir un ciclo o cancelar su suscripción en cualquier momento sin penalizaciones desde su panel de usuario o enviando un correo a soporte al menos <strong>48 horas antes</strong> del siguiente corte de facturación.</li>
    </ul>

    <h2>7. Propiedad Intelectual</h2>
    <p>
      Todos los contenidos del Sitio, incluyendo logotipos, textos, descripciones, fotografías, composiciones aromáticas, código fuente y diseño gráfico son propiedad exclusiva de Sutra México y están protegidos por las leyes mexicanas e internacionales en materia de propiedad industrial y derechos de autor. Queda estrictamente prohibida su reproducción o explotación no autorizada.
    </p>

    <h2>8. Legislación Aplicable y Jurisdicción</h2>
    <p>
      Para la interpretación y cumplimiento de estos Términos y Condiciones, las partes se someten a la legislación federal de los Estados Unidos Mexicanos y a la competencia de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros, sin perjuicio de los derechos que correspondan al consumidor ante la <strong>Procuraduría Federal del Consumidor (PROFECO)</strong>.
    </p>
  `,
};
