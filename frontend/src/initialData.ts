import { Auction, UserProfile, Dispute, UserAccount } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Usuario Demo",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  balance: 5500, // $5,500 ARS de saldo para pujar
  rating: 4.9,
  joinedDate: "Marzo 2026"
};

export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: "1",
    title: "MacBook Pro 16\" M3 Max (36GB RAM, 1TB SSD)",
    description: "MacBook Pro de última generación en perfecto estado. Se vende por renovación de equipo de diseño. Incluye cargador MagSafe original y caja original. Ciclo de batería en 94%. Ideal para desarrollo de software, diseño 3D o edición de video profesional.",
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    startingPrice: 1800,
    currentPrice: 2150,
    minIncrement: 50,
    bidsCount: 6,
    endTime: new Date(Date.now() + 1000 * 60 * 35).toISOString(), // Finaliza en 35 minutos para máxima urgencia
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    seller: {
      name: "Lucía Fernández",
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    bids: [
      { id: "b1-1", auctionId: "1", bidderName: "Carlos Gómez", bidderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", amount: 1850, time: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
      { id: "b1-2", auctionId: "1", bidderName: "Sofía Medina", bidderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", amount: 1950, time: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: "b1-3", auctionId: "1", bidderName: "Mateo Pérez", bidderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", amount: 2000, time: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
      { id: "b1-4", auctionId: "1", bidderName: "Sofía Medina", bidderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", amount: 2050, time: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { id: "b1-5", auctionId: "1", bidderName: "Andrés Silva", bidderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", amount: 2100, time: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: "b1-6", auctionId: "1", bidderName: "Sofía Medina", bidderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", amount: 2150, time: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
    ],
    status: "active"
  },
  {
    id: "2",
    title: "Guitarra Eléctrica Fender Stratocaster Custom Shop 1962",
    description: "Una joya absoluta para coleccionistas y músicos. Cuerpo de aliso seleccionado, mástil de arce flameado con perfil en C de los 60, diapasón de palisandro de la India. Pastillas Custom Shop enrolladas a mano que entregan ese sonido 'glassy' icónico. Acabado Relic de 3 colores Sunburst.",
    category: "Instrumentos",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=800",
    startingPrice: 3200,
    currentPrice: 3450,
    minIncrement: 100,
    bidsCount: 3,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // Finaliza en 4 horas
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    seller: {
      name: "Estudio de Música Vintage",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    },
    bids: [
      { id: "b2-1", auctionId: "2", bidderName: "Roberto Díaz", bidderAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", amount: 3200, time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
      { id: "b2-2", auctionId: "2", bidderName: "Marcos Torres", bidderAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200", amount: 3300, time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
      { id: "b2-3", auctionId: "2", bidderName: "Roberto Díaz", bidderAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", amount: 3450, time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
    ],
    status: "active"
  },
  {
    id: "3",
    title: "Game Boy Color Amarillo Edición Especial Dandelion",
    description: "Game Boy Color original importado de Japón. En excelente estado estético y funcional. Botones firmes, sonido claro, y lente de pantalla reemplazada por una de vidrio templado libre de rayones. Incluye los cartuchos originales de Pokémon Amarillo y Tetris.",
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=800",
    startingPrice: 80,
    currentPrice: 165,
    minIncrement: 5,
    bidsCount: 8,
    endTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // Finaliza en 2 horas
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    seller: {
      name: "RetroGamer Store",
      rating: 4.7,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
    },
    bids: [
      { id: "b3-1", auctionId: "3", bidderName: "Juan Pérez", bidderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", amount: 85, time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
      { id: "b3-2", auctionId: "3", bidderName: "Alan Walker", bidderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", amount: 100, time: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
      { id: "b3-3", auctionId: "3", bidderName: "Tomas Cruz", bidderAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", amount: 110, time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
      { id: "b3-4", auctionId: "3", bidderName: "Alan Walker", bidderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", amount: 125, time: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
      { id: "b3-5", auctionId: "3", bidderName: "Martina Paz", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 135, time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
      { id: "b3-6", auctionId: "3", bidderName: "Alan Walker", bidderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", amount: 150, time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: "b3-7", auctionId: "3", bidderName: "Martina Paz", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 160, time: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: "b3-8", auctionId: "3", bidderName: "Alan Walker", bidderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200", amount: 165, time: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
    ],
    status: "active"
  },
  {
    id: "4",
    title: "Obra de Arte: 'Sinfonía del Caos' (Óleo sobre Lienzo, 120x90cm)",
    description: "Cuadro original pintado por el artista emergente Julián Valdés en 2025. Utiliza una técnica mixta con predominancia de óleo, espátula y texturizados en relieve. Firmado a mano por el artista. Viene con certificado de autenticidad y bastidor de pino de excelente calidad. Perfecto para salas modernas u oficinas creativas.",
    category: "Arte y Coleccionables",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    startingPrice: 450,
    currentPrice: 580,
    minIncrement: 20,
    bidsCount: 4,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Finaliza en 24 horas
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    seller: {
      name: "Gallería de Arte Prisma",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    },
    bids: [
      { id: "b4-1", auctionId: "4", bidderName: "Guillermo Ortiz", bidderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", amount: 450, time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "b4-2", auctionId: "4", bidderName: "Verónica Salas", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 480, time: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
      { id: "b4-3", auctionId: "4", bidderName: "Guillermo Ortiz", bidderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", amount: 520, time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
      { id: "b4-4", auctionId: "4", bidderName: "Verónica Salas", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 580, time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
    ],
    status: "active"
  },
  {
    id: "5",
    title: "Teclado Mecánico Custom 75% 'Cyberpunk Carbon'",
    description: "Teclado personalizado armado meticulosamente por un entusiasta. Base de aluminio CNC color negro medianoche, placa de latón de alta densidad para una retroalimentación acústica ideal. Interruptores lineales Gateron Oil King lubricados a mano con Krytox 205g0. Teclas PBT dobles con diseño retro-futurista e iluminación RGB personalizable.",
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800",
    startingPrice: 150,
    currentPrice: 220,
    minIncrement: 10,
    bidsCount: 5,
    endTime: new Date(Date.now() + 1000 * 60 * 18).toISOString(), // Finaliza en 18 minutos (SUPER URGENTE)
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    seller: {
      name: "Keebs Specialist",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
    },
    bids: [
      { id: "b5-1", auctionId: "5", bidderName: "Ignacio Soto", bidderAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200", amount: 150, time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
      { id: "b5-2", auctionId: "5", bidderName: "Lorena Flores", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 160, time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
      { id: "b5-3", auctionId: "5", bidderName: "Ignacio Soto", bidderAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200", amount: 180, time: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: "b5-4", auctionId: "5", bidderName: "Lorena Flores", bidderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", amount: 200, time: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { id: "b5-5", auctionId: "5", bidderName: "Ignacio Soto", bidderAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200", amount: 220, time: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
    ],
    status: "active"
  },
  {
    id: "6",
    title: "Bicicleta de Montaña Trek Marlin 7 Gen 3 (Talla M, 29\")",
    description: "Bicicleta ideal para iniciarse en el trail de montaña y XC. Cuadro de aluminio liviano Alpha Silver con ruteo de cables interno. Suspensión delantera RockShox Judy con bloqueo hidráulico. Transmisión monoplato Shimano Deore de 10 velocidades y potentes frenos de disco hidráulicos Shimano. Comprada a finales de 2024, usada muy pocas veces en parque pavimentado. Prácticamente nueva.",
    category: "Deportes",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    startingPrice: 500,
    currentPrice: 500,
    minIncrement: 20,
    bidsCount: 0,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // Finaliza en 12 horas
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    seller: {
      name: "Juan Sebastián",
      rating: 4.6,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200"
    },
    bids: [],
    status: "active"
  }
];

export const CATEGORIES = ["Todos", "Tecnología", "Instrumentos", "Arte y Coleccionables", "Deportes", "Otros"];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: "disp-1",
    subastaId: "1",
    subastaTitle: "MacBook Pro 16\" M3 Max (36GB RAM, 1TB SSD)",
    iniciador: "Carlos Gómez (Comprador)",
    motivo: "PRODUCTO_NO_RECIBIDO",
    descripcion: "Gané la subasta hace 5 días y realicé el pago mediante transferencia bancaria de inmediato. He intentado ponerme en contacto con la vendedora Lucía Fernández en múltiples ocasiones, pero no responde mis mensajes ni actualiza el estado del envío. Solicito la intervención de un administrador para liberar mis fondos o cancelar la transacción.",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // hace 1 día
    estado: "ABIERTA"
  },
  {
    id: "disp-2",
    subastaId: "2",
    subastaTitle: "Guitarra Eléctrica Fender Stratocaster Custom Shop 1962",
    iniciador: "Estudio de Música Vintage (Vendedor)",
    motivo: "FALTA_DE_PAGO",
    descripcion: "La subasta finalizó a favor de Roberto Díaz, pero ha transcurrido el tiempo límite reglamentario de 48 horas y no ha efectuado el pago ni responde a nuestros intentos de contacto para coordinar la entrega. Solicitamos la cancelación de la adjudicación para poder publicar el instrumento de nuevo.",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // hace 12 horas
    estado: "ABIERTA"
  },
  {
    id: "disp-3",
    subastaId: "3",
    subastaTitle: "Game Boy Color Amarillo Edición Especial Dandelion",
    iniciador: "Alan Walker (Comprador)",
    motivo: "FRAUDE",
    descripcion: "El artículo recibido no coincide con las fotos de la publicación. La carcasa está notablemente rayada en la parte trasera y tiene una grieta cerca del compartimiento de pilas que no fue mencionada en la descripción. El vendedor RetroGamer Store se niega a realizar un reembolso.",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // hace 3 días
    estado: "RESUELTA",
    resolucionAdmin: "Se verificaron las pruebas provistas por el comprador. Se ordena al vendedor RetroGamer Store aceptar la devolución y se reintegra el importe total al comprador. Al vendedor se le aplica una advertencia por descripción engañosa.",
    estadoFinalSubasta: "CANCELADA",
    fechaResolucion: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // hace 2 días
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "u-1",
    name: "Usuario Demo",
    email: "maximilianopablo14@gmail.com",
    roles: ["USER", "SELLER"],
    rating: 4.9,
    status: "ACTIVE",
    createdAt: "2026-03-12T10:30:00Z"
  },
  {
    id: "u-2",
    name: "Lucía Fernández",
    email: "lucia.f@gmail.com",
    roles: ["USER", "SELLER"],
    rating: 4.8,
    status: "ACTIVE",
    createdAt: "2026-01-20T14:45:00Z"
  },
  {
    id: "u-3",
    name: "Estudio de Música Vintage",
    email: "vintage.music@studio.com",
    roles: ["SELLER"],
    rating: 5.0,
    status: "ACTIVE",
    createdAt: "2025-11-05T09:15:00Z"
  },
  {
    id: "u-4",
    name: "Carlos Gómez",
    email: "carlos.gomez@gmail.com",
    roles: ["USER"],
    rating: 4.5,
    status: "ACTIVE",
    createdAt: "2026-02-18T18:20:00Z"
  },
  {
    id: "u-5",
    name: "Roberto Díaz",
    email: "roberto.diaz@outlook.com",
    roles: ["USER"],
    rating: 4.2,
    status: "ACTIVE",
    createdAt: "2026-04-01T11:00:00Z"
  },
  {
    id: "u-6",
    name: "RetroGamer Store",
    email: "retrogamer@store.jp",
    roles: ["USER", "SELLER"],
    rating: 4.7,
    status: "ACTIVE",
    createdAt: "2025-08-30T16:40:00Z"
  },
  {
    id: "u-7",
    name: "Alan Walker",
    email: "alan.walker@dj.com",
    roles: ["USER"],
    rating: 4.6,
    status: "ACTIVE",
    createdAt: "2026-05-15T12:00:00Z"
  }
];

