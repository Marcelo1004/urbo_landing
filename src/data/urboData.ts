export interface Metric {
  value: string;
  label: string;
  detail: string;
  isAmber?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  context: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'active' | 'upcoming';
  badge?: string;
  quarter?: string;
}

export interface CommunityMessage {
  id: string;
  sender: string;
  role: 'driver' | 'passenger';
  intern?: string;
  line?: string;
  time: string;
  text?: string;
  location?: {
    title: string;
    subtitle: string;
    isLive?: boolean;
  };
}

export const URBO_METRICS: Metric[] = [
  {
    value: '5 meses',
    label: 'Trabajo de campo',
    detail: 'En la Línea 30 · validación presencial continua con choferes y directiva',
  },
  {
    value: '140',
    label: 'Usuarios piloto',
    detail: 'En la zona norte de Santa Cruz · crecimiento orgánico sin pauta publicitaria',
  },
  {
    value: '1.239',
    label: 'Mensajes analizados',
    detail: '63,4% correspondientes a tracking de micros y tiempos de espera',
  },
  {
    value: '83',
    label: 'Remitentes activos',
    detail: 'Comportamiento recurrente de consulta y colaboración vecinal',
    isAmber: true,
  },
];

export const TESTIMONIAL_DON_MAURICIO: Testimonial = {
  quote: "Esto es lo que falta para que el transporte mejore. Entre todos podemos lograrlo.",
  author: "Don Mauricio",
  role: "Chofer Línea 30",
  context: "Ex conductor de transporte público en Argentina · Santa Cruz de la Sierra",
};

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: '01',
    title: 'Validación de campo',
    description: '92 encuestas presenciales · 9 choferes asociados · grupo piloto de validación activa.',
    status: 'done',
    quarter: 'Fase 1',
  },
  {
    id: '02',
    title: 'MVP técnico integrado',
    description: 'App de pasajero, app de chofer con aviso por voz manos libres y dashboard de directiva.',
    status: 'done',
    quarter: 'Fase 2',
  },
  {
    id: '03',
    title: 'Google Play Store',
    description: 'Fase de closed testing con usuarios reales de calle · despliegue oficial para Santa Cruz.',
    status: 'active',
    badge: 'EN CURSO',
    quarter: 'Fase 3',
  },
  {
    id: '04',
    title: 'Escalabilidad Santa Cruz',
    description: 'Integración progresiva de 10+ líneas troncales · alianzas con comercios de la ruta.',
    status: 'upcoming',
    quarter: 'Fase 4',
  },
  {
    id: '05',
    title: 'Expansión regional',
    description: 'Cochabamba, La Paz y ciudades capitales de Latinoamérica con transporte de alta demanda.',
    status: 'upcoming',
    quarter: 'Fase 5',
  },
];

export const COMMUNITY_MESSAGES: CommunityMessage[] = [
  {
    id: 'm1',
    sender: 'NEYER',
    role: 'driver',
    intern: 'INT 32',
    line: 'LÍNEA 30',
    time: '06:47 a.m.',
    location: {
      title: 'Ubicación en tiempo real compartida',
      subtitle: 'Saliendo de parada norte · rumbo al centro por 2do Anillo',
      isLive: true,
    },
  },
  {
    id: 'm2',
    sender: 'ANTONIO GUMIEL',
    role: 'passenger',
    time: '07:47 a.m.',
    location: {
      title: 'Ubicación en tiempo real',
      subtitle: 'Esperando micro · Av. Banzer y 3er Anillo',
      isLive: true,
    },
  },
  {
    id: 'm3',
    sender: 'JOSE LUIS',
    role: 'driver',
    intern: 'INT 58',
    line: 'LÍNEA 30',
    time: '06:33 a.m.',
    location: {
      title: 'Ubicación en tiempo real compartida',
      subtitle: 'Saliendo del norte hacia el centro',
      isLive: true,
    },
  },
  {
    id: 'm4',
    sender: 'RUTHY',
    role: 'passenger',
    time: '06:39 a.m.',
    text: '¿Alguno que vaya a salir en los próximos 10 minutos? 🙏',
  },
  {
    id: 'm5',
    sender: 'MARIANA RIBERA',
    role: 'passenger',
    time: '06:41 a.m.',
    text: 'Aquí estamos por doña Naty esperando el 30 👍',
    location: {
      title: 'Av. Cristóbal de Mendoza',
      subtitle: 'Rumbo al sur',
    },
  },
];

export const SOLUTIONS_LIST = [
  {
    id: 'esperar-aqui',
    title: 'Modo Esperar Aquí',
    subtitle: 'La innovación central de URBO',
    description: 'El pasajero marca su parada en el mapa. El chofer recibe un aviso por voz automático a 300 metros: "Pasajero esperando, mano derecha." Sin tocar el celular ni desviar la vista del camino mientras conduce.',
    tag: 'Aviso por voz manos libres',
    isHero: true,
  },
  {
    id: 'gps-tiempo-real',
    title: 'GPS en tiempo real',
    subtitle: 'Telemetría continua de flota',
    description: 'El mapa muestra con precisión milimétrica dónde viene cada micro y el tiempo estimado de llegada en minutos. Actualización constante sin consumir la batería del chofer.',
    tag: 'Infraestructura activa',
  },
  {
    id: 'rutas-inteligentes',
    title: 'Rutas más inteligentes',
    subtitle: 'Optimización de flujo y frecuencias',
    description: 'Algoritmos que aprenden los tiempos y cuellos de botella históricos del recorrido, ayudando al chofer a anticipar zonas de alta demanda y reducir combustible quemado en vacío.',
    tag: 'Eficiencia operativa',
  },
  {
    id: 'seguridad-urbana',
    title: 'Seguridad urbana',
    subtitle: 'Tranquilidad en viajes nocturnos',
    description: 'Tus familiares pueden seguir tu viaje en vivo desde cualquier dispositivo y saber cuándo descendiste del micro. Pensado especialmente para estudiantes y traslados de noche.',
    tag: 'Tranquilidad familiar',
  },
  {
    id: 'sistema-puntos',
    title: 'Sistema de puntos',
    subtitle: 'Comercio local aliado',
    description: 'Pasajeros y choferes acumulan puntos por validar paso, reportar incidentes y calificar el trayecto. Canjeables en talleres mecánicos, farmacias y negocios aliados de la ruta.',
    tag: 'Economía circular',
  },
  {
    id: 'dashboard-linea',
    title: 'Dashboard para la línea',
    subtitle: 'Gestión institucional de flota',
    description: 'La directiva visualiza toda su flota en vivo, regularidad de frecuencias, mapa de calor de pasajeros y métricas con evidencia documentada para gestiones con el municipio.',
    tag: 'Control de flota',
  },
];
